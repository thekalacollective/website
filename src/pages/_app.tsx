// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Head from "next/head";
import Image from "next/future/image";

const TheKalaCollective: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
};

export default trpc.withTRPC(TheKalaCollective);

const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#003555] relative">
      <div className="container mx-auto p-4 flex justify-between items-center text-white font-extrabold relative z-10">
        <Link href="/" passHref>
          <a aria-label="The Kala Collective Homepage" className="flex">
            <Image
              height={256}
              width={472}
              src={"/header-logo.png"}
              className="h-16 w-auto"
            />
          </a>
        </Link>

        <nav>
          <ul className="flex gap-8">
            <li className="hover:underline">
              <Link href="/about">About Us</Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* <div className="w-full h-40 bg-[url('/footer.png')] bg-repeat-x bg-contain absolute -bottom-28 rotate-180"></div> */}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#003555] relative">
      <div className="w-full h-64 bg-[url('/footer.png')] bg-repeat-x bg-contain absolute top-0"></div>
    </footer>
  );
};
