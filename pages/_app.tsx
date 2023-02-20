import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import type { AppProps as AppPropsBase } from "next/app";
import Head from "next/head";
import { SnackbarProvider as NotistackProvider } from "notistack";
import NetworkStatus from "~/components/NetworkStatus";
import { NOTISTACK_ANCHOR_ORIGIN, NOTISTACK_AUTO_HIDE_DURATION, NOTISTACK_MAX_SNACK } from "~/constants/notistack";
import AuthProvider from "~/contexts/auth/provider";
import ThemeProvider from "~/contexts/theme/provider";
import { LayoutColorMode } from "~/types/layout";
import createEmotionCache from "~/utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

interface AppProps extends AppPropsBase {
  colorMode: LayoutColorMode;
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, colorMode } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Dracarys App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider defaultColorMode={colorMode}>
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
