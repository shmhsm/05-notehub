import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { CreateNotePayload } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  content: Yup.string()
    .min(10, 'Minimum 10 characters')
    .required('Required'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Required'),
});

const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });

      onCancel();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    },
  });

  const handleSubmit = (values: CreateNotePayload) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
        {() => (
        <Form className={css.form}>
          <div className={css.fieldWrapper}>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.fieldWrapper}>
            <label htmlFor="content">Content</label>
            <Field name="content" as="textarea" className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.fieldWrapper}>
            <label htmlFor="tag">Tag</label>
            <Field name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button 
              type="submit" 
              className={css.submitBtn} 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Note'}
            </button>
            <button 
              type="button" 
              className={css.cancelBtn} 
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}