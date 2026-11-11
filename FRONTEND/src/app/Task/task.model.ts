export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface Task {
  id?: number;           // opcional: el backend lo genera
  title: string;
  description?: string;
  dueDate?: string;      // fecha en formato 'YYYY-MM-DD' (opcional)
  status?: TaskStatus;   // estado: PENDIENTE (por defecto), EN_PROGRESO, COMPLETADA
}
