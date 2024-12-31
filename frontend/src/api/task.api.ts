import { api } from './config';
import { Task } from '../models/task.model';

export const TaskAPI = {
  getAll: (userId: number) => api.get<Task[]>(`/users/${userId}/tasks`),
  getOne: (userId: number, taskId: number) => api.get<Task>(`/users/${userId}/tasks/${taskId}`),
  create: (userId: number, data: Omit<Task, 'id' | 'userId'>) => {
    return api.post<Task>(`/users/${userId}/tasks`, data);
  },
  update: (userId: number, taskId: number, data: Omit<Task, 'id' | 'userId'>) => {
    return api.put<Task>(`/users/${userId}/tasks/${taskId}`, data);
  },
  delete: (userId: number, taskId: number) => api.delete(`/users/${userId}/tasks/${taskId}`)
};
