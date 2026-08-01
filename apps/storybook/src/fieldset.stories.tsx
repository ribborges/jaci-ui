import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldDescription, FieldLabel, Fieldset, Input, Stack } from "jaci-ui";

const meta = {
  title: "Forms/Fieldset",
  component: Fieldset.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Agrupa campos relacionados com uma legenda e descrição acessíveis, sem aplicar reset global ao formulário.",
      },
      source: {
        code: `<Fieldset.Root><Fieldset.Legend>Contact details</Fieldset.Legend><Fieldset.Description>Visible to your team.</Fieldset.Description><Field name="email"><FieldLabel>Email</FieldLabel><Input type="email" /></Field></Fieldset.Root>`,
      },
    },
  },
} satisfies Meta<typeof Fieldset.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Fieldset.Root style={{ maxWidth: "32rem" }}>
      <Fieldset.Legend>Contact details</Fieldset.Legend>
      <Fieldset.Description>These fields are visible to your team.</Fieldset.Description>
      <Stack gap="md">
        <Field name="firstName">
          <FieldLabel htmlFor="fieldset-first-name">First name</FieldLabel>
          <Input id="fieldset-first-name" name="firstName" />
        </Field>
        <Field name="email">
          <FieldLabel htmlFor="fieldset-email">Email</FieldLabel>
          <Input id="fieldset-email" name="email" type="email" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </Field>
      </Stack>
    </Fieldset.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset.Root disabled style={{ maxWidth: "32rem" }}>
      <Fieldset.Legend>Locked profile</Fieldset.Legend>
      <Fieldset.Description>These values cannot be changed right now.</Fieldset.Description>
      <Stack gap="md">
        <Field name="organization">
          <FieldLabel htmlFor="fieldset-organization">Organization</FieldLabel>
          <Input id="fieldset-organization" name="organization" value="Jaci UI" readOnly />
        </Field>
      </Stack>
    </Fieldset.Root>
  ),
};
