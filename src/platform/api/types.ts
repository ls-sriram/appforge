export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRouteDefinition {
  method: HttpMethod;
  path: string;
  requestType: string;
  responseType: string;
}
