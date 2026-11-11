import { Component, computed, inject, signal } from '@angular/core';
import { CalendarOptions, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import esLocale from 'fullcalendar/locales/es';
import { Task } from '../Task/task.model';
import { TaskService } from '../Task/task.service';

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
        color: '#2563eb',          // 🎨 color de fondo de la tarea (azul)
        contrastColor: '#ffffff',  // color del texto sobre la tarea
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

  eliminar(id: number) {
    this.taskService.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: () => this.mensaje.set('Error al eliminar'),
    });
  }
}
