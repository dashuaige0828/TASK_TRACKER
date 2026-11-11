import { Component, computed, inject, signal } from '@angular/core';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import esLocale from 'fullcalendar/locales/es';
import { Task, TaskStatus } from '../Task/task.model';
import { TaskService } from '../Task/task.service';

/** Color de cada estado (los mismos que usa la leyenda del HTML). */
const COLOR_ESTADO: Record<TaskStatus, string> = {
  PENDIENTE: '#2563eb',    // azul
  EN_PROGRESO: '#f59e0b',  // ámbar
  COMPLETADA: '#16a34a',   // verde
};

@Component({
  selector: 'app-calendario',
  imports: [FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent {

  private taskService = inject(TaskService);

  // ===== Estado =====
  tareas = signal<Task[]>([]);                        // todas las tareas del backend
  diaSeleccionado = signal<string | null>(null);      // 'YYYY-MM-DD' del día pulsado
  titulo = signal('');                                // texto del formulario
  mensaje = signal('');                               // mensajes de error/info

  // ===== Derivados (se recalculan solos cuando cambian los signals) =====
  tareasDelDia = computed(() =>
    this.tareas().filter((t) => t.dueDate === this.diaSeleccionado())
  );

  eventos = computed(() =>
    this.tareas()
      .filter((t) => !!t.dueDate)
      .map((t) => ({
        id: String(t.id),
        title: t.title,
        start: t.dueDate!,
        allDay: true,
        color: COLOR_ESTADO[t.status ?? 'PENDIENTE'],   // 🎨 color según estado
        contrastColor: '#ffffff',
      }))
  );

  // ===== Configuración de FullCalendar =====
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',            // vista de mes
    locale: esLocale,                       // interfaz en español
    plugins: [themePlugin, dayGridPlugin, interactionPlugin],
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    height: 'auto',
    // al pulsar un día: guardamos su fecha
    dateClick: (info) => this.seleccionarDia(info.dateStr),
  };

  constructor() {
    this.cargar();
  }

  // ===== Cargar todas las tareas (alimenta calendario y lista) =====
  cargar() {
    this.taskService.listar().subscribe({
      next: (lista) => this.tareas.set(lista),
      error: () => this.mensaje.set('Error al cargar las tareas'),
    });
  }

  seleccionarDia(fecha: string) {
    this.diaSeleccionado.set(fecha);
    this.mensaje.set('');
  }

  alEscribir(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.titulo.set(input.value);
  }

  crear() {
    const dia = this.diaSeleccionado();
    const titulo = this.titulo().trim();
    if (!dia || !titulo) return;

    this.taskService.crear({ title: titulo, dueDate: dia }).subscribe({
      next: () => {
        this.titulo.set('');
        this.mensaje.set('');
        this.cargar();                       // recarga para actualizar el calendario
      },
      error: (e) => this.mensaje.set(e.error?.message ?? 'Error al crear'),
    });
  }

  /** Se dispara al cambiar el <select> de estado de una tarea. */
  alCambiarEstado(id: number, evento: Event) {
    const select = evento.target as HTMLSelectElement;
    this.cambiarEstado(id, select.value as TaskStatus);
  }

  cambiarEstado(id: number, estado: TaskStatus) {
    this.taskService.cambiarEstado(id, estado).subscribe({
      next: () => this.cargar(),
      error: () => this.mensaje.set('Error al cambiar el estado'),
    });
  }

  eliminar(id: number) {
    this.taskService.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: () => this.mensaje.set('Error al eliminar'),
    });
  }
}
