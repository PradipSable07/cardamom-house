import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuPage } from "@/features/menu/components/MenuPage";
import { DEFAULT_DEMO_STATE, DEMO_STATES, isDemoState } from "@/features/menu/scenario";

// Reached through the ?state= rewrites in next.config.ts. Every state is
// prerendered at build time; anything else is a 404 rather than a server render.
export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_STATES.filter((state) => state !== DEFAULT_DEMO_STATE).map((state) => ({ state }));
}

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!isDemoState(state)) notFound();
  return <MenuPage state={state} />;
}
