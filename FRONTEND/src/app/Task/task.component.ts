import { Component, inject, signal } from '@angular/core';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent {

  private taskService = inject(TaskService);

  tasks = signal<Task[]>([]);
  nuevoTitulo = signal('');
  mensaje = signal('');

  constructor() {
    this.cargar();
  }

  alEscribir(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.nuevoTitulo.set(input.value);
  }

  cargar() {
    this.taskService.listar().subscribe({
      next: (lista) => this.tasks.set(lista),
      error: () => this.mensaje.set('Error al cargar las tareas'),
    });
  }

  crear() {
    const titulo = this.nuevoTitulo().trim();
    if (!titulo) return;
    this.taskService.crear({ title: titulo }).subscribe({
      next: (tarea) => {
        this.tasks.update((lista) => [...lista, tarea]);
        this.nuevoTitulo.set('');
        this.mensaje.set('');
      },
      error: (e) => this.mensaje.set(e.error?.message ?? 'Error al crear'),
    });
  }

  eliminar(id: number) {
    this.taskService.eliminar(id).subscribe({
      next: () => this.tasks.update((lista) => lista.filter((t) => t.id !== id)),
      error: () => this.mensaje.set('Error al eliminar'),
    });
  }
}