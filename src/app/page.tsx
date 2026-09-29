import { MenuPage } from "@/features/menu/components/MenuPage";
import { DEFAULT_DEMO_STATE } from "@/features/menu/constants/demo-states";

// `/?state=closed` etc. are rewritten to /state/[state] in next.config.ts, so
// this route only ever serves the default state and can be fully static.
export default function Page() {
  return <MenuPage state={DEFAULT_DEMO_STATE} />;
}
