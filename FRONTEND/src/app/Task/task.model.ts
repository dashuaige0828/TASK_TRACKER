export interface Task {
  id?: number;           // opcional: el backend lo genera
  title: string;
  description?: string;
  dueDate?: string;      // fecha en formato 'YYYY-MM-DD' (opcional)
}
