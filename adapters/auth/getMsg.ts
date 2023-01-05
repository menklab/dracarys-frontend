import { API_ROUTES } from "~/constants/api_routes";

interface secretMsgBody {
  message: string;
}

export default async function getMsg() {
  const res = await fetch(API_ROUTES.REQUEST_MESSAGE(), {
    credentials: "include",
    method: "GET",
  });
  if (!res.ok) throw new Error(await res.text());

  return (await res.json()) as secretMsgBody;
}
