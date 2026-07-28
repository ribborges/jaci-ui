import { Button, Heading, Stack, Text } from "jaci-ui";

export default function IndexRoute() {
  return (
    <main data-jaci-theme="light" style={{ minHeight: "100vh", padding: "2rem" }}>
      <Stack>
        <Heading as="h1">Remix Vite SSR</Heading>
        <Text>Jaci UI renders in a Remix route.</Text>
        <Button>Continue</Button>
      </Stack>
    </main>
  );
}
