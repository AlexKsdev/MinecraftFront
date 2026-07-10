import { createTheme } from "@mui/material/styles";

// Drive MUI's baseline (body background/text) from the same CSS variables the
// rest of the site uses, so the light/dark toggle controls MUI surfaces too.
export const theme = createTheme({
  palette: {
    background: {
      default: "var(--background)",
    },
    text: {
      primary: "var(--foreground)",
    },
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
  },
});
