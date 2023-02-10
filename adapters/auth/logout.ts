import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function logout(): Promise<void> {
  const res = await fetch(API_ROUTES.LOGOUT(), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
