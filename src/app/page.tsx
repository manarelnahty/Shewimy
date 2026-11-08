import { getLatestSiteSettings } from "@/lib/serverSettings";
import { HomeClient } from "@/components/home/HomeClient";

export default function Home() {
  const initialSettings = getLatestSiteSettings();

  return <HomeClient initialSettings={initialSettings} />;
}
