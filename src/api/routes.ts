import type { ApiRouteDefinition } from "./types";

/**
 * Route manifest generated from proto `google.api.http` annotations.
 * The generated file is intentionally separate so route definitions
 * stay annotation-driven rather than hand-written in runtime services.
 */
import manifest from "../generated/proto/route-manifest.json";

export const apiRoutes = manifest as Record<string, ApiRouteDefinition>;
