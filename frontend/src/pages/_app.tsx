import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
// https://mui.com/material-ui/customization/theming/#themeprovider
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../mui/theme";
import { CssBaseline } from "@mui/material";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
