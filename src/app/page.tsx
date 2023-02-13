import { PageContent } from "./page-content";

export default async function Home(props: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const forceOffline = props.searchParams?.offline === "true";

  if (process.env.HEARTBEAT_URL == null) {
    throw new Error("HEARTBEAT_URL is not set");
  }

  const heartbeatRes = await fetch(process.env.HEARTBEAT_URL, {
    next: { revalidate: 10 },
  });
  const heartbeat = (await heartbeatRes.json()) as {
    heartbeatList: Record<
      string,
      Array<{ status: number; time: string; msg: string; ping: number }>
    >;
    uptimeList: Record<string, number>;
  };

  const statusPerKey = Object.fromEntries(
    Object.entries(heartbeat.heartbeatList)
      .map(([key, list]) => {
        const entry = list[list.length - 1];
        if (!entry) return null;
        return [key, entry.status] as const;
      })
      .filter(<T,>(tuple: T | null): tuple is T => tuple != null)
  );

  const isMauOnline = forceOffline
    ? false
    : Object.values(statusPerKey).every((status) => status >= 1);

  return <PageContent isMauOnline={isMauOnline} />;
}
