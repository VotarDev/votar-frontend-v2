import React, { useState } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { SessionProvider } from "next-auth/react";
import AppContext from "@/src/context/AppContext";
import { Position } from "@/utils/types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const proxima = localFont({
  src: [
    {
      path: "../public/fonts/Proxima Nova Black.otf",
      weight: "900",
    },
    {
      path: "../public/fonts/Proxima Nova Extrabold.otf",
      weight: "800",
    },
    {
      path: "../public/fonts/Proxima Nova Bold.otf",
      weight: "700",
    },
    {
      path: "../public/fonts/Proxima Nova Semibold.otf",
      weight: "600",
    },
    {
      path: "../public/fonts/ProximaNova-Regular.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/Proxima Nova Thin.otf",
      weight: "300",
    },
  ],
  variable: "--font-proxima",
});

const THEME = createTheme({
  typography: {
    fontFamily: `var(--font-proxima), sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [preview, setpreview] = useState<Position[]>([
    { name: "", showPictures: true, allowAbstain: true, candidates: [] },
  ]);
  const value = {
    preview,
    setpreview,
  };
  return (
    <AppContext.Provider value={value}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="12194768072-ftkkte0iqtopa81s1n3u39jdje2ktv3b.apps.googleusercontent.com">
          <SessionProvider session={pageProps.session}>
            <div className={`${proxima.variable} font-proximaNova `}>
              <ThemeProvider theme={THEME}>
                <Toaster />
                <Component {...pageProps} />
              </ThemeProvider>
            </div>
          </SessionProvider>
        </GoogleOAuthProvider>
      </Provider>
    </AppContext.Provider>
  );
}
