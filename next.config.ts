import type { NextConfig } from "next";
import { pid } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  allowedDevOrigins: ['192.168.3.247'],
}

export default nextConfig;
