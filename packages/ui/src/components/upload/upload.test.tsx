// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Upload } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Upload", () => {
  it("accepts dropped files and reports rejected types", () => {
    const onFilesChange = vi.fn();
    const onReject = vi.fn();
    const container = renderInDocument(
      <Upload.Root accept="image/*" onFilesChange={onFilesChange} onReject={onReject}>
        <Upload.Dropzone aria-label="Upload files">
          <Upload.Input />
          <Upload.Text>Drop a file</Upload.Text>
        </Upload.Dropzone>
        <Upload.Error />
        <Upload.List />
      </Upload.Root>,
    );
    const dropzone = container.querySelector<HTMLElement>("[data-slot='upload-dropzone']");
    if (!dropzone) throw new Error("Upload dropzone was not rendered.");

    const image = new File(["image"], "photo.png", { type: "image/png" });
    const dataTransfer = { files: [image], types: ["Files"] } as unknown as DataTransfer;
    const drop = new Event("drop", { bubbles: true });
    Object.defineProperty(drop, "dataTransfer", { configurable: true, value: dataTransfer });
    act(() => dropzone.dispatchEvent(drop));
    expect(onFilesChange).toHaveBeenCalledWith([image]);

    const text = new File(["text"], "notes.txt", { type: "text/plain" });
    const rejectedTransfer = { files: [text], types: ["Files"] } as unknown as DataTransfer;
    const rejectedDrop = new Event("drop", { bubbles: true });
    Object.defineProperty(rejectedDrop, "dataTransfer", {
      configurable: true,
      value: rejectedTransfer,
    });
    act(() => dropzone.dispatchEvent(rejectedDrop));
    expect(onReject).toHaveBeenCalledTimes(1);
  });
});
