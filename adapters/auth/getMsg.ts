import { API_ROUTES } from "~/constants/api_routes";

interface secretMsgBody {
  message: string;
}

export default async function getMsg() {
  const res = await fetch(API_ROUTES.REQUEST_MESSAGE(), {
    credentials: "include",
    method: "GET",
    mode: "cors",
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  return (await res.json()) as secretMsgBody;
}
