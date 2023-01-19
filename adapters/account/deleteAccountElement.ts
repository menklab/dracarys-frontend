import { API_ROUTES } from "~/constants/api_routes";

// FE usage only
export default async function deleteAccountElement(elementId: number): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS() + `/${String(elementId)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
}
