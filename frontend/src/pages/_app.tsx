import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
// https://mui.com/material-ui/customization/theming/#themeprovider
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../mui/theme";
import { CssBaseline } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import client from "@/graphql/apollo-client";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
