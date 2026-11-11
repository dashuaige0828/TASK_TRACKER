package com.tasktracker.backend.controller;

import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.TaskStatus;
import com.tasktracker.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return taskService.listarTareas(fecha);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> obtener(@PathVariable Long id) {
        return taskService.obtenerTarea(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task crear(@Valid @RequestBody Task task) {
        return taskService.crearTarea(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> actualizar(@PathVariable Long id, @Valid @RequestBody Task datos) {
        return taskService.actualizarTarea(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Cambiar solo el estado: PUT /api/tasks/{id}/estado?estado=COMPLETADA */
    @PutMapping("/{id}/estado")
    public ResponseEntity<Task> cambiarEstado(@PathVariable Long id,
                                              @RequestParam TaskStatus estado) {
        return taskService.cambiarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (taskService.eliminarTarea(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
