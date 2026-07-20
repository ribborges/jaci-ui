import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text, Upload } from "jaci-ui";

const meta = {
  title: "Forms/Upload",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropzone: Story = {
  render: () => (
    <Upload.Root accept="image/*,.pdf" maxSize={5 * 1024 * 1024} multiple>
      <Upload.Dropzone aria-label="Upload files">
        <Upload.Input />
        <Upload.Icon />
        <Upload.Text>Drop files here or choose from your device</Upload.Text>
        <Upload.Hint>Images and PDF files up to 5 MB.</Upload.Hint>
      </Upload.Dropzone>
      <Upload.Error />
      <Upload.List />
    </Upload.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <Stack gap="sm" style={{ minWidth: "22rem" }}>
        <Upload.Root files={files} onFilesChange={setFiles} multiple>
          <Upload.Dropzone aria-label="Add attachments">
            <Upload.Input />
            <Upload.Icon>＋</Upload.Icon>
            <Upload.Text>Add attachments</Upload.Text>
            <Upload.Hint>Drop or browse files.</Upload.Hint>
          </Upload.Dropzone>
          <Upload.List />
        </Upload.Root>
        <Text size="sm" tone="muted">
          {files.length} file{files.length === 1 ? "" : "s"} selected.
        </Text>
      </Stack>
    );
  },
};

export const PreviewAndProgress: Story = {
  render: function PreviewAndProgressStory() {
    const [file] = useState(() => new File(["preview"], "jaci-preview.png", { type: "image/png" }));

    return (
      <Upload.Root defaultFiles={[file]}>
        <Upload.List>
          <Upload.Item file={file}>
            <Upload.Preview aria-label="Preview of jaci-preview.png" file={file} />
            <Stack gap="sm" style={{ minWidth: 0 }}>
              <Text size="sm">{file.name}</Text>
              <Upload.Progress label="68% uploaded" value={68} />
            </Stack>
            <Upload.Remove file={file} />
          </Upload.Item>
        </Upload.List>
      </Upload.Root>
    );
  },
};

export const IndeterminateProgress: Story = {
  render: () => (
    <Upload.Root>
      <Upload.Progress label="Uploading file" />
    </Upload.Root>
  ),
};
