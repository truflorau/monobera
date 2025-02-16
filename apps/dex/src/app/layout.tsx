"use client";

import "@bera/ui/styles.css";
import "../styles/globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { dexName } from "@bera/config";
import {
  Header,
  TailwindIndicator,
  TermOfUseModal,
  getBannerCount,
} from "@bera/shared-ui";
import { cn } from "@bera/ui";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";

import { navItems } from "~/app/config";
import Providers from "./Providers";

const fontSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const [firstTimeUser, setFirstTimeUser] = useLocalStorage(
    "FIRST_TIME_USER",
    true,
  );
  const pathName = usePathname();
  const activeBanners = getBannerCount(dexName, pathName);

  return (
    <html lang="en" className="bg-background">
      <Script
        id="HotJarAnalytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3728405,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
        }}
      />
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <span className="warning-foreground hidden text-amber-300 text-green-300 text-green-400 text-green-500 text-neutral-400 text-red-400 text-red-500" />
        <TermOfUseModal open={firstTimeUser} setOpen={setFirstTimeUser} />
        <Providers>
          <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
            <div className="z-[100]">
              <Toaster position="bottom-right" />
            </div>
            <div className="z-10 flex-1">
              <span className="hidden text-amber-300 text-green-300 text-green-400 text-green-500 text-neutral-400 text-red-400 text-red-500" />
              <Header navItems={navItems} appName={dexName} />
              <main
                className="w-full"
                style={{ paddingTop: `${48 * activeBanners + 72}px` }}
              >
                {props.children}
              </main>
            </div>
          </div>
          <TailwindIndicator />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
