// @ts-check
import { env } from "./src/env/server.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      allowFutureImage: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "f004.backblazeb2.com",
          port: "",
          pathname: "file/thekalacollective-website-user-media/**",
        },
        {
          protocol: "https",
          port: "",
          hostname: "images.unsplash.com",
        },
      ],
    },
  },
  images: {
    domains: ["f004.backblazeb2.com", "images.unsplash.com"],
  },
});
