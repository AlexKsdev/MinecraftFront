import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function WikiArticleView({ slug }: { slug: string }) {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" component="h1">
        Article: {slug}
      </Typography>
    </Container>
  );
}
