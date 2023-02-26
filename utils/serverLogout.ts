import { ServerResponse } from "http";
import logout from "~/adapters/auth/logout";
import { ROUTES } from "~/constants/routes";

export default async function serverLogout(res: ServerResponse) {
  try {
    await logout();
  } catch (e) {
    console.warn(e);
  }
  res.writeHead(302, { Location: ROUTES.LOGIN() });
  res.end();
}
