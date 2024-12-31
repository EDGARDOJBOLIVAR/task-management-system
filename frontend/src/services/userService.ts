import { User } from './types';

const API_URL = 'http://localhost:3000';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
};