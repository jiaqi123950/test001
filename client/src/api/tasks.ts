import { logger } from '@lark-apaas/client-toolkit/logger';
import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';

import type {
  Task,
  TaskListResponse,
  CreateTaskRequest,
  TaskPriority,
} from '@shared/api.interface';

export async function getTasks(priority?: TaskPriority): Promise<Task[]> {
  try {
    const url = priority ? `/api/tasks?priority=${priority}` : '/api/tasks';
    const response = await axiosForBackend.get<TaskListResponse>(url);
    return response.data.items;
  } catch (error) {
    logger.error('获取任务列表失败', error);
    throw error;
  }
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  try {
    const response = await axiosForBackend.post<Task>('/api/tasks', data);
    return response.data;
  } catch (error) {
    logger.error('创建任务失败', error);
    throw error;
  }
}

export async function toggleTask(id: string, isCompleted: boolean): Promise<Task> {
  try {
    const response = await axiosForBackend.patch<Task>(`/api/tasks/${id}/toggle`, {
      isCompleted,
    });
    return response.data;
  } catch (error) {
    logger.error('更新任务状态失败', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/api/tasks/${id}`);
  } catch (error) {
    logger.error('删除任务失败', error);
    throw error;
  }
}
