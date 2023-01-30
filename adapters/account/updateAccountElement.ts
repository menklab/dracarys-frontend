import { API_ROUTES } from "~/constants/api_routes";
import { ElementType } from "~/enums/elementType";

interface UpdateAccountElementBody {
  name: string;
  type: ElementType;
}

// FE usage only
export default async function updateAccountElement(elementId: number, body: UpdateAccountElementBody): Promise<void> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS() + `/${elementId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
}
