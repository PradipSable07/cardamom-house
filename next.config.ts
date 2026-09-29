import type { NextConfig } from "next";
import { DEFAULT_DEMO_STATE, DEMO_STATES } from "./src/features/menu/constants/demo-states";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  // ?state= is resolved at the routing layer, so each state is a static,
  // CDN-cacheable page instead of a per-request server render. Unknown values
  // match nothing and fall through to `/` (the default state). When the param
  // repeats, Next matches the last value.
  async rewrites() {
    return {
      beforeFiles: DEMO_STATES.filter((state) => state !== DEFAULT_DEMO_STATE).map((state) => ({
        source: "/",
        has: [{ type: "query" as const, key: "state", value: state }],
        destination: `/state/${state}`,
      })),
    };
  },
};

export default nextConfig;
