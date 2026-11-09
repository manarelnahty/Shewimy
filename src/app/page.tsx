import { getLatestSiteSettings, getLatestBranches } from "@/lib/serverSettings";
import { HomeClient } from "@/components/home/HomeClient";

export default function Home() {
  const initialSettings = getLatestSiteSettings();
  const initialBranches = getLatestBranches();

  return (
    <HomeClient
      initialSettings={initialSettings}
      initialBranches={initialBranches}
    />
  );
}
