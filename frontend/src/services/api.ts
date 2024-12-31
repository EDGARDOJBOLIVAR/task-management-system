import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface User {
  id?: number;
  name: string;
  email: string;
}

interface Task {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
}

export const api = {
  // Users
  getUsers: () => axios.get(`${API_URL}/users`),
  getUser: (id: number) => axios.get(`${API_URL}/users/${id}`),
  createUser: (user: User) => axios.post(`${API_URL}/users`, user),
  updateUser: (id: number, user: User) => axios.put(`${API_URL}/users/${id}`, user),
  deleteUser: (id: number) => axios.delete(`${API_URL}/users/${id}`),

  // Tasks
  getTasks: (userId: number) => axios.get(`${API_URL}/users/${userId}/tasks`),
  getTask: (userId: number, taskId: number) => axios.get(`${API_URL}/users/${userId}/tasks/${taskId}`),
  createTask: (userId: number, task: Task) => axios.post(`${API_URL}/users/${userId}/tasks`, task),
  updateTask: (userId: number, taskId: number, task: Task) => axios.put(`${API_URL}/users/${userId}/tasks/${taskId}`, task),
  deleteTask: (userId: number, taskId: number) => axios.delete(`${API_URL}/users/${userId}/tasks/${taskId}`)
};

export type { User, Task };
