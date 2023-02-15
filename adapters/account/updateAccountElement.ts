import { API_ROUTES } from "~/constants/api_routes";
import { ElementType } from "~/enums/elementType";

interface UpdateAccountElementBody {
  name: string;
  type: ElementType;
}

export interface UpdateAccountElementBodyResponse {
  id: number;
  name: string;
  type: ElementType;
  createdAt: string;
  updatedAt: string;
}

// FE usage only
export default async function updateAccountElement(
  elementId: number,
  body: UpdateAccountElementBody
): Promise<UpdateAccountElementBodyResponse> {
  const res = await fetch(API_ROUTES.ACCOUNTS_ELEMENTS() + `/${elementId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw await res.json();
  const data = (await res.json()) as UpdateAccountElementBodyResponse;
  return data || {};
}
