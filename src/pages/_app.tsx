import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Fraunces, Geist } from "next/font/google";
import { ToastProvider } from "@/components/Toast";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${display.variable} ${sans.variable} grain min-h-dvh`}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </div>
  );
}
