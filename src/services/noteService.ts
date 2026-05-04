import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Note } from '../types/note';

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
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
  search?: string; 
}): Promise<FetchNotesResponse> => {
  
 const params: FetchNotesParams = { 
    page, 
    perPage 
  };

  if (search && search.trim() !== '') {
    params.search = search;
  }

  const response = await noteInstance.get<FetchNotesResponse>('/notes', {
    params,
  });
  
  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response = await noteInstance.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};