interface validateMsgBody {
  pubKey: string;
  message: string;
  signature: string;
}

// TODO: replace origin to nest_host env var when backend dev is ready
export default async function validateMsg(origin: string, body: validateMsgBody): Promise<boolean> {
  const res = await fetch(origin + "/api/auth/validateMessage", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
