import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps as AppPropsBase } from "next/app";
import Head from "next/head";
import { SnackbarProvider as NotistackProvider } from "notistack";
import NetworkStatus from "~/components/NetworkStatus";
import { NOTISTACK_ANCHOR_ORIGIN, NOTISTACK_AUTO_HIDE_DURATION, NOTISTACK_MAX_SNACK } from "~/constants/notistack";
import AuthProvider from "~/contexts/auth/provider";
import createEmotionCache from "~/utils/createEmotionCache";
import theme from "~/utils/muiTheme";

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends AppPropsBase {
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotistackProvider
          maxSnack={NOTISTACK_MAX_SNACK}
          autoHideDuration={NOTISTACK_AUTO_HIDE_DURATION}
          anchorOrigin={NOTISTACK_ANCHOR_ORIGIN}
        >
          <AuthProvider>
            <Component {...pageProps} />
            <NetworkStatus />
          </AuthProvider>
        </NotistackProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
