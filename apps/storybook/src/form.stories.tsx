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
      errors={{ email: "Use um endereço de e-mail válido." }}
      onFormSubmit={() => undefined}
      style={{ maxWidth: "32rem" }}
    >
      <Fieldset.Root>
        <Fieldset.Legend>Perfil público</Fieldset.Legend>
        <Fieldset.Description>
          Os atributos nativos e os erros vindos do servidor usam a mesma composição.
        </Fieldset.Description>
        <Stack gap="md">
          <Field name="displayName">
            <FieldLabel htmlFor="form-display-name">Nome</FieldLabel>
            <Input id="form-display-name" name="displayName" required />
            <FieldDescription>Nome exibido para outras pessoas.</FieldDescription>
          </Field>
          <Field name="email">
            <FieldLabel htmlFor="form-email">E-mail</FieldLabel>
            <Input id="form-email" name="email" type="email" required />
            <FieldError />
          </Field>
        </Stack>
      </Fieldset.Root>
      <Button type="submit">Salvar perfil</Button>
      <VisuallyHidden>As mensagens de validação aparecem após o envio.</VisuallyHidden>
    </Form>
  ),
};
