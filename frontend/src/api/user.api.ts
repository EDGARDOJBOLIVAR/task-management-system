import { api } from './config';
import { User } from '../models/user.model';

export const UserAPI = {
  getAll: () => api.get<User[]>('/users'),
  delete: (id: number) => api.delete(`/users/${id}`),
  create: (data: Omit<User, 'id'>) => {
    return api.post<User>(`/users`, data);
  },
  update: (id: number, data: Omit<User, 'id'>) => {
    return api.put<User>(`/users/${id}`, data);
  },
};