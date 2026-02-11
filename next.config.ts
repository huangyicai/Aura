import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const nextConfig: {
  output: string;
  serverExternalPackages: string[];
  env: {
    NEXT_PUBLIC_APP_VERSION: string;
  };
  experimental?: {
    allowedDevOrigins?: string[];
  };
} = {
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3'],
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  experimental: {
    allowedDevOrigins: ['http://127.0.0.1:3000'],
  },
};

export default nextConfig;
