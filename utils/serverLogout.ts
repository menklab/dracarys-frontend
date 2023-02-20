import { ServerResponse } from "http";
import { ROUTES } from "~/constants/routes";

export default function serverLogout(res: ServerResponse) {
  res.writeHead(302, { Location: ROUTES.LOGIN() });
  res.end();
}
