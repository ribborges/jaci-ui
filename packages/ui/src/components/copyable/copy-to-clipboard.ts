"use client";

export async function copyToClipboard(value: string) {
  let primaryError: unknown;

  if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function") {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (error) {
      primaryError = error;
    }
  }

  if (typeof document !== "undefined" && typeof document.execCommand === "function") {
    const textarea = document.createElement("textarea");
    const selection = document.getSelection();
    const ranges = selection
      ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index))
      : [];

    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      if (document.execCommand("copy")) return;
    } finally {
      textarea.remove();
      selection?.removeAllRanges();
      for (const range of ranges) selection?.addRange(range);
    }
  }

  throw primaryError instanceof Error
    ? primaryError
    : new Error("Clipboard access is unavailable.");
}
