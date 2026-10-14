import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Radio,
  Stack,
  Switch,
  Textarea,
} from "jaci-ui";
import { expect } from "storybook/test";

const meta = {
  title: "Forms/Field",
  tags: ["autodocs"],
  component: Field,
  parameters: {
    docs: {
      source: {
        code: `<Field name="email"><FieldLabel>Email</FieldLabel><Input type="email" /><FieldDescription>We never share your email.</FieldDescription><FieldError /></Field>`,
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Controls: Story = {
  render: () => (
    <Stack style={{ minWidth: "20rem" }}>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="Ada Lovelace" />
        <FieldDescription>Your preferred public name.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <Textarea id="message" aria-invalid="true" />
        <FieldError>Please write a message.</FieldError>
      </Field>
      <Stack direction="horizontal" align="center">
        <Checkbox id="newsletter" />
        <FieldLabel htmlFor="newsletter">Send product updates</FieldLabel>
      </Stack>
      <Stack direction="horizontal" align="center">
        <Radio id="plan" name="plan" />
        <FieldLabel htmlFor="plan">Pro plan</FieldLabel>
      </Stack>
      <Stack direction="horizontal" align="center">
        <Switch aria-label="Enable notifications" defaultChecked id="notifications" />
        <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
      </Stack>
    </Stack>
  ),
};

export const Password: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input id="password" defaultValue="secret" type="password" />
      <FieldDescription>Use the embedded button to reveal or hide the password.</FieldDescription>
    </Field>
  ),
  play: async () => {
    const input = document.querySelector<HTMLInputElement>("input[type='password']");
    const toggle = document.querySelector<HTMLButtonElement>("[data-slot='input-password-toggle']");
    if (!input || !toggle)
      throw new Error("The password input did not render its visibility toggle.");

    expect(toggle).toHaveAttribute("aria-label", "Show password");
    await toggle.click();
    expect(input.type).toBe("text");
  },
};
