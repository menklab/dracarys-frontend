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
    // mode: "cors",
    headers: { "Content-Type": "application/json" },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    //   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    //   "Content-Type": "application/json",
    // },
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}
