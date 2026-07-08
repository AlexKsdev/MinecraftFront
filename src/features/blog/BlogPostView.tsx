import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function BlogPostView({ slug }: { slug: string }) {
  return (
    <Container sx={{ pt: 8, pb: 6 }}>
      <Typography variant="h4" component="h1">
        Post: {slug}
      </Typography>
    </Container>
  );
}
