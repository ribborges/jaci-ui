import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Fieldset,
  Form,
  Input,
  Stack,
  VisuallyHidden,
} from "jaci-ui";

const meta = {
  title: "Forms/Form",
  tags: ["autodocs"],
  component: Form,
  parameters: {
    docs: {
      source: {
        code: `<Form onFormSubmit={() => undefined}><Field><FieldLabel>Name</FieldLabel><Input /></Field><Button type="submit">Save</Button></Form>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NativeConstraintsAndExternalErrors: Story = {
  render: () => (
    <Form
      errors={{ email: "Enter a valid email address." }}
      onFormSubmit={() => undefined}
      style={{ maxWidth: "32rem" }}
    >
      <Fieldset.Root>
        <Fieldset.Legend>Public profile</Fieldset.Legend>
        <Fieldset.Description>
          Native constraints and server errors use the same composition.
        </Fieldset.Description>
        <Stack gap="md">
          <Field name="displayName">
            <FieldLabel htmlFor="form-display-name">Name</FieldLabel>
            <Input id="form-display-name" name="displayName" required />
            <FieldDescription>The name shown to other people.</FieldDescription>
          </Field>
          <Field name="email">
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input id="form-email" name="email" type="email" required />
            <FieldError />
          </Field>
        </Stack>
      </Fieldset.Root>
      <Button type="submit">Save profile</Button>
      <VisuallyHidden>Validation messages appear after submission.</VisuallyHidden>
    </Form>
  ),
};
