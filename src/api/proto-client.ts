import { api } from "../services/ApiClient";
import { apiRoutes } from "./routes";

type RouteKey = keyof typeof apiRoutes;

export async function callProto<Req extends object, Res>(
  routeKey: RouteKey,
  request?: Req,
): Promise<{ ok: true; data: Res } | { ok: false; error: string }> {
  const route = apiRoutes[routeKey];
  if (!route) {
    return { ok: false, error: `Unknown route key: ${String(routeKey)}` };
  }

  switch (route.method) {
    case "GET":
      return api.get<Res>(route.path);
    case "POST":
      return api.post<Res>(route.path, request ?? {});
    case "PUT":
      return api.put<Res>(route.path, request ?? {});
    case "DELETE":
      return api.delete<Res>(route.path);
    default:
      return { ok: false, error: `Unsupported method: ${route.method}` };
  }
}
