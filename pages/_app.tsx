import React, { useState } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Source_Code_Pro } from "next/font/google";
import { Work_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import AppContext from "@/src/context/AppContext";
import { Position } from "@/utils/types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Weight } from "lucide-react";

const boing = localFont({
  src: "../public/fonts/Boing.ttf",
  variable: "--font-boing",
});

const graphik = localFont({
  src: [
    {
      path: "../public/fonts/graphik/Graphik-Bold-Trial.otf",
      weight: "700",
    },
    {
      path: "../public/fonts/graphik/Graphik-Semibold-Trial.otf",
      weight: "600",
    },
    {
      path: "../public/fonts/graphik/Graphik-Medium-Trial.otf",
      weight: "500",
    },
    {
      path: "../public/fonts/graphik/Graphik-Regular-Trial.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/graphik/Graphik-Light-Trial.otf",
      weight: "300",
    },
  ],
  variable: "--font-graphik",
});

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

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-source-code-pro",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
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
    {
      name_of_position: "",
      show_pictures: true,
      allow_abstain: true,
      candidates: [],
      election_id: "",
    },
  ]);
  const value = {
    preview,
    setpreview,
  };
  return (
    <AppContext.Provider value={value}>
      <Provider store={store}>
        <SessionProvider session={pageProps.session}>
          <div className={` ${workSans.variable} font-workSans  font-light`}>
            <ThemeProvider theme={THEME}>
              <Toaster />
              <Component {...pageProps} />
            </ThemeProvider>
          </div>
        </SessionProvider>
      </Provider>
    </AppContext.Provider>
  );
}
