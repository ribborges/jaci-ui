import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, Toast } from "jaci-ui";

const meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  component: Toast.Root,
  args: { toast: { id: "story", title: "Story toast", description: "A toast example." } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface LocalToast {
  id: string;
  description: string;
  title: string;
  type: "error" | "success";
}

/**
 * This example intentionally uses React state and the compound parts instead
 * of a process-wide notification service. Applications can keep the same
 * declarative structure while sourcing the toast object from their own state.
 */
export const Declarative: Story = {
  render: function DeclarativeToast() {
    const [toast, setToast] = useState<LocalToast | null>({
      id: "project-saved",
      description: "Your latest changes are available to collaborators.",
      title: "Project saved",
      type: "success",
    });

    return (
      <Toast.Provider timeout={0}>
        <Button
          onClick={() =>
            setToast({
              id: "project-saved",
              description: "Your latest changes are available to collaborators.",
              title: "Project saved",
              type: "success",
            })
          }
        >
          Show success toast
        </Button>

        <Toast.Portal>
          <Toast.Viewport>
            {toast ? (
              <Toast.Root toast={toast}>
                <Toast.Content>
                  <Toast.Text>
                    <Toast.Title />
                    <Toast.Description />
                  </Toast.Text>
                  <Toast.Close onClick={() => setToast(null)} />
                </Toast.Content>
              </Toast.Root>
            ) : null}
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    );
  },
};

export const ErrorAndAction: Story = {
  render: function ErrorAndActionToast() {
    const [toast, setToast] = useState<LocalToast | null>({
      id: "save-failed",
      description: "Check your connection and try saving again.",
      title: "Could not save the project",
      type: "error",
    });

    return (
      <Toast.Provider timeout={0}>
        <Button
          onClick={() =>
            setToast({
              id: "save-failed",
              description: "Check your connection and try saving again.",
              title: "Could not save the project",
              type: "error",
            })
          }
          variant="danger"
        >
          Show error toast
        </Button>

        <Toast.Portal>
          <Toast.Viewport>
            {toast ? (
              <Toast.Root toast={toast}>
                <Toast.Content>
                  <Toast.Text>
                    <Toast.Title />
                    <Toast.Description />
                  </Toast.Text>
                  <Toast.Action onClick={() => setToast(null)}>Retry</Toast.Action>
                  <Toast.Close onClick={() => setToast(null)} />
                </Toast.Content>
              </Toast.Root>
            ) : null}
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    );
  },
};

export const TranslucentStatuses: Story = {
  render: function TranslucentStatusToasts() {
    type StatusToast = readonly ["info" | "success" | "warning" | "danger", string, string];
    const [toasts, setToasts] = useState<StatusToast[]>([
      ["info", "Information", "A translucent surface with an opaque status border."],
      ["success", "Saved", "The project was saved successfully."],
      ["warning", "Review needed", "Some fields still need your attention."],
      ["danger", "Failed", "The request could not be completed."],
    ]);

    return (
      <Toast.Provider timeout={0}>
        <Toast.Portal>
          <Toast.Viewport>
            {toasts.map(([tone, title, description]) => (
              <Toast.Root key={tone} toast={{ id: tone, title, description }} tone={tone}>
                <Toast.Content>
                  <Toast.Text>
                    <Toast.Title />
                    <Toast.Description />
                  </Toast.Text>
                  <Toast.Close
                    onClick={() =>
                      setToasts((current) => current.filter((item) => item[0] !== tone))
                    }
                  />
                </Toast.Content>
              </Toast.Root>
            ))}
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<Toast.Provider timeout={0}>
  <Toast.Portal>
    <Toast.Viewport>
      <Toast.Root toast={{ id: "saved", title: "Saved", description: "Done" }} tone="success">
        <Toast.Content>
          <Toast.Text><Toast.Title /><Toast.Description /></Toast.Text>
          <Toast.Close />
        </Toast.Content>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Portal>
</Toast.Provider>`,
      },
    },
  },
};
