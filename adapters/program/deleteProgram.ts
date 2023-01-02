import absoluteUrl from "next-absolute-url";

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function deleteProgram(programId: number): Promise<void> {
  const { origin } = absoluteUrl();
  const res = await fetch(origin + `/api/programs/${programId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
