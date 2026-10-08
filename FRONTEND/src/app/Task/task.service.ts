import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tasks';

  listar(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  crear(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  actualizar(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}