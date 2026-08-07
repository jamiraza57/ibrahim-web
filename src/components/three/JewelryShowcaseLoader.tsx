"use client";

import dynamic from "next/dynamic";

// The three.js/@react-three/fiber/drei stack is a heavy bundle (~150kB+) that
// every homepage visitor would otherwise download even on first paint; code-split
// it out of the initial hero render and skip SSR since it's a WebGL canvas.
const JewelryShowcase = dynamic(
  () => import("./JewelryShowcase").then((mod) => mod.JewelryShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
      </div>
    ),
  }
);

export function JewelryShowcaseLoader() {
  return <JewelryShowcase />;
}
