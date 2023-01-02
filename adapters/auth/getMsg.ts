interface secretMsgBody {
  message: string;
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function getMsg(origin: string) {
  const res = await fetch(origin + "/api/auth/requestMessage", {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());

  return (await res.json()) as secretMsgBody;
}
