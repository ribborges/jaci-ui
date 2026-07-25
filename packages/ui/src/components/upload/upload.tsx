"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode, RefObject } from "react";

import { cx } from "../../styled-system/css";
import { upload } from "../../styled-system/recipes";

export type UploadRejectionReason = "type" | "size" | "count" | "duplicate" | "validation";

export type UploadFileStatus = "queued" | "uploading" | "success" | "error" | "canceled";

export interface UploadFileState {
  status: UploadFileStatus;
  progress?: number;
  error?: ReactNode;
}

export interface UploadRejection {
  file: File;
  message: string;
  reason: UploadRejectionReason;
}

interface UploadContextValue {
  accept: string | undefined;
  addFiles: (files: FileList | File[]) => void;
  disabled: boolean;
  dropActive: boolean;
  files: File[];
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  fileState: ((file: File) => UploadFileState | undefined) | undefined;
  maxFiles: number | undefined;
  maxSize: number | undefined;
  multiple: boolean;
  removeFile: (file: File) => void;
  cancelFile: (file: File) => void;
  rejections: UploadRejection[];
  setDropActive: (active: boolean) => void;
  styles: ReturnType<typeof upload>;
}

const UploadContext = createContext<UploadContextValue | null>(null);

function useUploadContext() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("Upload parts must be rendered inside Upload.Root.");
  }

  return context;
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function acceptsFile(file: File, accept: string | undefined) {
  if (!accept) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return accept.split(",").some((entry) => {
    const pattern = entry.trim().toLowerCase();
    if (!pattern) return true;
    if (pattern.startsWith(".")) return fileName.endsWith(pattern);
    if (pattern.endsWith("/*")) return fileType.startsWith(pattern.slice(0, -1));
    return pattern === fileType;
  });
}

export interface UploadRootProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  /** Accepted MIME types or file extensions, using the native input syntax. */
  accept?: string;
  /** Controlled files. Use with `onFilesChange`. */
  files?: File[];
  /** Initial files for an uncontrolled upload. */
  defaultFiles?: File[];
  /** Called whenever accepted files are added or removed. */
  onFilesChange?: (files: File[]) => void;
  /** Called with files rejected by `accept`, `maxSize`, `maxFiles` or duplicates. */
  onReject?: (rejections: UploadRejection[]) => void;
  /** Maximum number of accepted files. Defaults to one when `multiple` is false. */
  maxFiles?: number;
  /** Maximum size per file, in bytes. */
  maxSize?: number;
  /** Allows selecting more than one file. */
  multiple?: boolean;
  /** Disables file selection and drag-and-drop. */
  disabled?: boolean;
  /** Optional asynchronous validation. Return an error message to reject a file. */
  validateFile?: (file: File) => string | null | Promise<string | null>;
  /** Controlled status used by the status, progress and cancel slots. */
  fileState?: (file: File) => UploadFileState | undefined;
  /** Called when a consumer cancels an upload. */
  onCancel?: (file: File) => void;
  children?: ReactNode;
}

export const UploadRoot = forwardRef<HTMLDivElement, UploadRootProps>(function UploadRoot(
  {
    accept,
    fileState,
    children,
    className,
    defaultFiles = [],
    disabled = false,
    files: controlledFiles,
    maxFiles,
    maxSize,
    multiple = false,
    onFilesChange,
    onCancel,
    onReject,
    validateFile,
    ...props
  },
  ref,
) {
  const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>(defaultFiles);
  const [dropActive, setDropActive] = useState(false);
  const [rejections, setRejections] = useState<UploadRejection[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const styles = upload({ disabled, dropActive });
  const currentFiles = controlledFiles ?? uncontrolledFiles;
  const fileLimit = maxFiles ?? (multiple ? undefined : 1);

  const updateFiles = useCallback(
    (nextFiles: File[]) => {
      if (controlledFiles === undefined) setUncontrolledFiles(nextFiles);
      onFilesChange?.(nextFiles);
    },
    [controlledFiles, onFilesChange],
  );

  const removeFile = useCallback(
    (file: File) => {
      updateFiles(currentFiles.filter((current) => fileKey(current) !== fileKey(file)));
    },
    [currentFiles, updateFiles],
  );

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (disabled) return;

      const candidates = Array.from(fileList);
      const acceptedFiles: File[] = [];
      const nextRejections: UploadRejection[] = [];
      const pendingValidations = new Map<File, Promise<string | null>>();
      const existingKeys = new Set(currentFiles.map(fileKey));

      for (const file of candidates) {
        const key = fileKey(file);
        if (existingKeys.has(key) || acceptedFiles.some((accepted) => fileKey(accepted) === key)) {
          nextRejections.push({
            file,
            reason: "duplicate",
            message: `${file.name} was already added.`,
          });
          continue;
        }
        if (!acceptsFile(file, accept)) {
          nextRejections.push({
            file,
            reason: "type",
            message: `${file.name} is not an accepted file type.`,
          });
          continue;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          nextRejections.push({
            file,
            reason: "size",
            message: `${file.name} is larger than the allowed limit.`,
          });
          continue;
        }
        if (
          fileLimit !== undefined &&
          (multiple ? currentFiles.length + acceptedFiles.length : acceptedFiles.length) >=
            fileLimit
        ) {
          nextRejections.push({
            file,
            reason: "count",
            message: `Only ${fileLimit} file${fileLimit === 1 ? "" : "s"} can be selected.`,
          });
          continue;
        }
        if (validateFile) {
          const validation = validateFile(file);
          if (validation && typeof validation !== "object") {
            nextRejections.push({ file, reason: "validation", message: validation });
            continue;
          }
          if (validation && typeof validation === "object" && "then" in validation) {
            pendingValidations.set(file, Promise.resolve(validation));
          }
        }
        acceptedFiles.push(file);
      }

      const nextFiles = multiple ? [...currentFiles, ...acceptedFiles] : acceptedFiles.slice(0, 1);
      if (acceptedFiles.length > 0) {
        updateFiles(nextFiles);
      }
      if (validateFile) {
        for (const file of acceptedFiles) {
          const validation = pendingValidations.get(file);
          if (validation) {
            void validation
              .then((message) => {
                if (!message) return;
                const rejection = { file, reason: "validation" as const, message };
                updateFiles(nextFiles.filter((current) => fileKey(current) !== fileKey(file)));
                setRejections((current) => [...current, rejection]);
                onReject?.([rejection]);
              })
              .catch((error: unknown) => {
                const message = error instanceof Error ? error.message : "File validation failed.";
                const rejection = { file, reason: "validation" as const, message };
                updateFiles(nextFiles.filter((current) => fileKey(current) !== fileKey(file)));
                setRejections((current) => [...current, rejection]);
                onReject?.([rejection]);
              });
          }
        }
      }
      if (nextRejections.length > 0) {
        setRejections(nextRejections);
        onReject?.(nextRejections);
      } else {
        setRejections([]);
      }
    },
    [
      accept,
      currentFiles,
      disabled,
      fileLimit,
      maxSize,
      multiple,
      onReject,
      updateFiles,
      validateFile,
    ],
  );

  const cancelFile = useCallback((file: File) => onCancel?.(file), [onCancel]);

  const context = useMemo<UploadContextValue>(
    () => ({
      accept,
      addFiles,
      cancelFile,
      disabled,
      dropActive,
      files: currentFiles,
      inputId,
      inputRef,
      fileState,
      maxFiles: fileLimit,
      maxSize,
      multiple,
      removeFile,
      rejections,
      setDropActive,
      styles,
    }),
    [
      accept,
      addFiles,
      cancelFile,
      currentFiles,
      disabled,
      dropActive,
      fileLimit,
      fileState,
      inputId,
      maxSize,
      multiple,
      rejections,
      removeFile,
      styles,
    ],
  );

  return (
    <UploadContext.Provider value={context}>
      <div
        {...props}
        ref={ref}
        className={cx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-jaci-component="upload"
        data-slot="upload"
      >
        {children}
      </div>
    </UploadContext.Provider>
  );
});

export interface UploadDropzoneProps extends ComponentPropsWithoutRef<"label"> {
  children?: ReactNode;
}

export const UploadDropzone = forwardRef<HTMLLabelElement, UploadDropzoneProps>(
  function UploadDropzone(
    { children, className, htmlFor, onDragEnter, onDragLeave, onDragOver, onDrop, ...props },
    ref,
  ) {
    const { addFiles, disabled, dropActive, inputId, setDropActive, styles } = useUploadContext();

    return (
      <label
        {...props}
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cx(styles.dropzone, className)}
        data-drag-active={dropActive || undefined}
        data-slot="upload-dropzone"
        htmlFor={htmlFor ?? inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDropActive(true);
            event.currentTarget.dataset.dragActive = "true";
          }
          onDragEnter?.(event);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setDropActive(false);
            event.currentTarget.dataset.dragActive = "false";
          }
          onDragLeave?.(event);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDropActive(true);
          onDragOver?.(event);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDropActive(false);
          event.currentTarget.dataset.dragActive = "false";
          if (!disabled) addFiles(event.dataTransfer.files);
          onDrop?.(event);
        }}
      >
        {children}
      </label>
    );
  },
);

export type UploadInputProps = ComponentPropsWithoutRef<"input">;

export const UploadInput = forwardRef<HTMLInputElement, UploadInputProps>(function UploadInput(
  { accept, className, id, multiple, onChange, ...props },
  ref,
) {
  const {
    addFiles,
    accept: rootAccept,
    disabled,
    inputId,
    inputRef,
    multiple: rootMultiple,
    styles,
  } = useUploadContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) addFiles(event.currentTarget.files);
    event.currentTarget.value = "";
    onChange?.(event);
  };

  return (
    <input
      {...props}
      accept={accept ?? rootAccept}
      aria-label={props["aria-label"] ?? "Select files"}
      className={cx(styles.input, className)}
      disabled={disabled}
      id={id ?? inputId}
      multiple={multiple ?? rootMultiple}
      onChange={handleChange}
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      tabIndex={-1}
      type="file"
    />
  );
});

export type UploadTriggerProps = ComponentPropsWithoutRef<"button">;

export const UploadTrigger = forwardRef<HTMLButtonElement, UploadTriggerProps>(
  function UploadTrigger(
    { children = "Choose files", className, disabled, onClick, ...props },
    ref,
  ) {
    const { disabled: rootDisabled, inputRef, styles } = useUploadContext();

    return (
      <button
        {...props}
        className={cx(styles.trigger, className)}
        data-slot="upload-trigger"
        disabled={disabled ?? rootDisabled}
        onClick={(event) => {
          inputRef.current?.click();
          onClick?.(event);
        }}
        ref={ref}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export type UploadIconProps = ComponentPropsWithoutRef<"span">;

export const UploadIcon = forwardRef<HTMLSpanElement, UploadIconProps>(function UploadIcon(
  { children = "↥", className, ...props },
  ref,
) {
  const { styles } = useUploadContext();
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cx(styles.icon, className)}
      data-slot="upload-icon"
    >
      {children}
    </span>
  );
});

export type UploadTextProps = ComponentPropsWithoutRef<"span">;

export const UploadText = forwardRef<HTMLSpanElement, UploadTextProps>(function UploadText(
  { className, ...props },
  ref,
) {
  const { styles } = useUploadContext();
  return (
    <span {...props} ref={ref} className={cx(styles.text, className)} data-slot="upload-text" />
  );
});

export type UploadHintProps = ComponentPropsWithoutRef<"span">;

export const UploadHint = forwardRef<HTMLSpanElement, UploadHintProps>(function UploadHint(
  { className, ...props },
  ref,
) {
  const { styles } = useUploadContext();
  return (
    <span {...props} ref={ref} className={cx(styles.hint, className)} data-slot="upload-hint" />
  );
});

export interface UploadPreviewProps extends ComponentPropsWithoutRef<"span"> {
  /** File whose preview should be rendered. Image files use a temporary object URL. */
  file: File;
  /** Alternative text for image previews. Defaults to the file name. */
  alt?: string;
  /** Content rendered while the preview is unavailable or the file is not an image. */
  fallback?: ReactNode;
}

export const UploadPreview = forwardRef<HTMLSpanElement, UploadPreviewProps>(function UploadPreview(
  { alt, className, fallback = "Preview unavailable", file, ...props },
  ref,
) {
  const { styles } = useUploadContext();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (
      !file.type.startsWith("image/") ||
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !== "function"
    ) {
      setSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <span
      {...props}
      ref={ref}
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cx(styles.preview, className)}
      data-slot="upload-preview"
      role={props["aria-label"] ? "img" : undefined}
    >
      {src ? <img alt={alt ?? file.name} src={src} /> : fallback}
    </span>
  );
});

export interface UploadProgressProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Progress from 0 to 100. Omit it for an indeterminate upload. */
  value?: number;
  /** Accessible label and optional visible status text. */
  label?: ReactNode;
  file?: File;
}

export const UploadProgress = forwardRef<HTMLDivElement, UploadProgressProps>(
  function UploadProgress({ className, file, label = "Uploading", value, ...props }, ref) {
    const { fileState, styles } = useUploadContext();
    const state = file ? fileState?.(file) : undefined;
    const normalizedValue =
      value === undefined
        ? state?.progress === undefined
          ? undefined
          : Math.min(100, Math.max(0, state.progress))
        : Math.min(100, Math.max(0, value));

    return (
      <div
        {...props}
        ref={ref}
        aria-label={typeof label === "string" ? label : "Upload progress"}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className={cx(styles.progress, className)}
        data-indeterminate={normalizedValue === undefined || undefined}
        data-slot="upload-progress"
        role="progressbar"
      >
        <span className={styles.progressTrack} data-slot="upload-progress-track">
          <span
            className={styles.progressIndicator}
            data-indeterminate={normalizedValue === undefined || undefined}
            data-slot="upload-progress-indicator"
            style={{ width: normalizedValue === undefined ? undefined : `${normalizedValue}%` }}
          />
        </span>
        <span className={styles.progressLabel} data-slot="upload-progress-label">
          {label}
        </span>
      </div>
    );
  },
);

export type UploadListProps = ComponentPropsWithoutRef<"ul">;

export const UploadList = forwardRef<HTMLUListElement, UploadListProps>(function UploadList(
  { children, className, ...props },
  ref,
) {
  const { files, styles } = useUploadContext();
  return (
    <ul {...props} ref={ref} className={cx(styles.list, className)} data-slot="upload-list">
      {children ?? files.map((file) => <UploadItem file={file} key={fileKey(file)} />)}
    </ul>
  );
});

export interface UploadItemProps extends Omit<ComponentPropsWithoutRef<"li">, "children"> {
  file: File;
  children?: ReactNode;
}

export const UploadItem = forwardRef<HTMLLIElement, UploadItemProps>(function UploadItem(
  { children, className, file, ...props },
  ref,
) {
  const { styles } = useUploadContext();
  return (
    <li {...props} ref={ref} className={cx(styles.item, className)} data-slot="upload-item">
      {children ?? (
        <>
          <span className={styles.itemName} data-slot="upload-item-name" title={file.name}>
            {file.name}
          </span>
          <span className={styles.itemMeta} data-slot="upload-item-meta">
            {formatBytes(file.size)}
          </span>
          <UploadRemove file={file} />
        </>
      )}
    </li>
  );
});

export interface UploadRemoveProps extends ComponentPropsWithoutRef<"button"> {
  file: File;
}

export const UploadRemove = forwardRef<HTMLButtonElement, UploadRemoveProps>(function UploadRemove(
  { children = "×", className, file, onClick, ...props },
  ref,
) {
  const { disabled, removeFile, styles } = useUploadContext();
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? `Remove ${file.name}`}
      className={cx(styles.remove, className)}
      data-slot="upload-remove"
      disabled={disabled}
      onClick={(event) => {
        removeFile(file);
        onClick?.(event);
      }}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
});

export interface UploadStatusProps extends ComponentPropsWithoutRef<"span"> {
  file: File;
}

export const UploadStatus = forwardRef<HTMLSpanElement, UploadStatusProps>(function UploadStatus(
  { children, className, file, ...props },
  ref,
) {
  const { fileState, styles } = useUploadContext();
  const state = fileState?.(file);
  const content = children ?? state?.error ?? state?.status ?? "queued";
  return (
    <span
      {...props}
      aria-live="polite"
      className={cx(styles.status, className)}
      data-status={state?.status}
      data-slot="upload-status"
      ref={ref}
    >
      {content}
    </span>
  );
});

export interface UploadCancelProps extends ComponentPropsWithoutRef<"button"> {
  file: File;
}

export const UploadCancel = forwardRef<HTMLButtonElement, UploadCancelProps>(function UploadCancel(
  { children = "Cancel", className, file, onClick, ...props },
  ref,
) {
  const { cancelFile, disabled, fileState, styles } = useUploadContext();
  const state = fileState?.(file);
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? `Cancel ${file.name}`}
      className={cx(styles.cancel, className)}
      data-slot="upload-cancel"
      disabled={disabled || state?.status === "canceled" || state?.status === "success"}
      onClick={(event) => {
        cancelFile(file);
        onClick?.(event);
      }}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
});

export type UploadErrorProps = ComponentPropsWithoutRef<"p">;

export const UploadError = forwardRef<HTMLParagraphElement, UploadErrorProps>(function UploadError(
  { children, className, ...props },
  ref,
) {
  const { rejections, styles } = useUploadContext();
  if (children === undefined && rejections.length === 0) return null;

  return (
    <p
      {...props}
      ref={ref}
      className={cx(styles.error, className)}
      data-slot="upload-error"
      role="alert"
    >
      {children ?? rejections.map((rejection) => rejection.message).join(" ")}
    </p>
  );
});

export const Upload = {
  Root: UploadRoot,
  Dropzone: UploadDropzone,
  Input: UploadInput,
  Trigger: UploadTrigger,
  Icon: UploadIcon,
  Text: UploadText,
  Hint: UploadHint,
  Preview: UploadPreview,
  Progress: UploadProgress,
  List: UploadList,
  Item: UploadItem,
  Remove: UploadRemove,
  Status: UploadStatus,
  Cancel: UploadCancel,
  Error: UploadError,
};
