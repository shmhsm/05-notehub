import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}> 
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.card}> 
            <div className={css.header}>
              <span className={css.tag}>{note.tag}</span>
              <button
                onClick={() => mutation.mutate(note.id)}
                className={css.deleteBtn}
                disabled={mutation.isPending}
              >
                Delete
              </button>
            </div>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}