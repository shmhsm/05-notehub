import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  createdAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number; 
}

const noteInstance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

noteInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = async ({ 
  page, 
  perPage, 
  search 
}: { 
  page: number; 
  perPage: number; 
  search: string 
}): Promise<FetchNotesResponse> => {
  const response = await noteInstance.get<Omit<FetchNotesResponse, 'totalPages'>>('/notes', {
    params: { page, perPage, search },
  });

  return {
    ...response.data,
    totalPages: Math.ceil(response.data.total / response.data.perPage)
  };
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response = await noteInstance.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await noteInstance.delete(`/notes/${id}`);
};