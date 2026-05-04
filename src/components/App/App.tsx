import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import NoteForm from '../NoteForm/NoteForm';
import Modal from 'react-modal'; 
import css from './App.module.css';

Modal.setAppElement('#root');

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const perPage = 6;

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); 
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: keepPreviousData, // Для плавной смены страниц
  });

  return (
  <div className={css.container}>
   <header className={css.header}>
      <input
        type="text"
        placeholder="Search notes"
        className={css.searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {data && (
        <Pagination
          totalPages={data.totalPages}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <button 
        className={css.addBtn} 
        onClick={() => setIsModalOpen(true)}
      >
        Create note +
      </button>
    </header>

    <main className={css.main}>
      {isLoading && <p className={css.message}>Loading notes...</p>}
      {isError && <p className={css.error}>Error loading notes. Please try again.</p>}

      {data && <NoteList notes={data.notes} />}
    </main>

    {isModalOpen && (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={css.modal}
        overlayClassName={css.overlay}
      >
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    )}
  </div>
);
}