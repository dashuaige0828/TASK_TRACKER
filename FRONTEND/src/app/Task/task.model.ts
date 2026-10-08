export interface Task {
  id?: number;           // opcional: el backend lo genera
  title: string;
  description?: string;
}
