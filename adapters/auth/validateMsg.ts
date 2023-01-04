import { API_ROUTES } from "~/constants/api_routes";

interface validateMsgBody {
  pubKey: string;
  message: string;
  signature: string;
}

export default async function validateMsg(body: validateMsgBody): Promise<boolean> {
  const res = await fetch(API_ROUTES.VALIDATE_MESSAGE(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
