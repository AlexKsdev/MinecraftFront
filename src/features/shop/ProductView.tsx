import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function ProductView({ slug }: { slug: string }) {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" component="h1">
        Product: {slug}
      </Typography>
    </Container>
  );
}
