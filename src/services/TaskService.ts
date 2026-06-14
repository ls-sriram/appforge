import { api, type ApiResult } from "./ApiClient";

export type TaskStatus = "open" | "completed" | "archived";

export interface Task {
  id: string;
  type: string;
  title: string;
  status: TaskStatus;
  tag?: string | null;
  description?: string | null;
  priority?: string | null;
  assignee?: string | null;
  dueAt?: { seconds: number; nanos: number } | null;
  completedAt?: { seconds: number; nanos: number } | null;
  metadata: Record<string, string>;
  createdAt: { seconds: number; nanos: number };
  updatedAt: { seconds: number; nanos: number };
}

interface TaskResponse { task?: Task; tasks?: Task[] }

export class BackendTaskService {
  async list(status?: TaskStatus): Promise<ApiResult<{ tasks: Task[] }>> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return api.get<{ tasks: Task[] }>(`/tasks${query}`);
  }

  async create(input: { type: string; title: string; tag?: string }): Promise<ApiResult<Task>> {
    const result = await api.post<TaskResponse>("/tasks", input);
    if (!result.ok) return result;
    return { ok: true, status: result.status, data: (result.data.task as Task) ?? (result.data as unknown as Task) };
  }

  async update(
    id: string,
    patch: Partial<Pick<Task, "title" | "type" | "tag" | "description">> & {
      dueAt?: { seconds: number; nanos: number } | null;
      completedAt?: { seconds: number; nanos: number } | null;
      clearTag?: boolean;
      clearDescription?: boolean;
      clearDueAt?: boolean;
      clearCompletedAt?: boolean;
    },
  ): Promise<ApiResult<Task>> {
    const result = await api.patch<TaskResponse>(`/tasks/${id}`, patch);
    if (!result.ok) return result;
    return { ok: true, status: result.status, data: (result.data.task as Task) ?? (result.data as unknown as Task) };
  }

  async complete(id: string): Promise<ApiResult<Task>> {
    const result = await api.post<TaskResponse>(`/tasks/${id}/complete`, {});
    if (!result.ok) return result;
    return { ok: true, status: result.status, data: (result.data.task as Task) ?? (result.data as unknown as Task) };
  }

  async delete(id: string): Promise<ApiResult<{ success: boolean }>> {
    return api.delete<{ success: boolean }>(`/tasks/${id}`);
  }
}
