import { api } from './config';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../interfaces/pagination.interface';

export const UserAPI = {
  getAll: (page: number = 1, limit: number = 5) => 
    api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  delete: (id: number) => api.delete(`/users/${id}`),
  create: (data: Omit<User, 'id'>) => {
    return api.post<User>(`/users`, data);
  },
  update: (id: number, data: Omit<User, 'id'>) => {
    return api.put<User>(`/users/${id}`, data);
  },
};