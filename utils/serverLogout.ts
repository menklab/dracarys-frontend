import { ServerResponse } from "http";
import { SID_COOKIE_NAME } from "~/constants/auth";
import { ROUTES } from "~/constants/routes";

export default function serverLogout(res: ServerResponse) {
  res.setHeader("Set-Cookie", `${SID_COOKIE_NAME}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  res.writeHead(302, { Location: ROUTES.LOGIN() });
  res.end();
}
