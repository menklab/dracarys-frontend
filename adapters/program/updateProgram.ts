import absoluteUrl from "next-absolute-url";

interface UpdateProgramBody {
  name: string;
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function updateProgram(programId: number, body: UpdateProgramBody): Promise<void> {
  const { origin } = absoluteUrl();
  const res = await fetch(origin + `/api/programs/${programId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
}
