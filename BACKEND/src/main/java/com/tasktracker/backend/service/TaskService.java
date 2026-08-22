package com.tasktracker.backend.service;

import com.tasktracker.backend.exception.DuplicateTitleException;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> listarTareas() {
        return taskRepository.findAll();
    }

    public Optional<Task> obtenerTarea(Long id) {
        return taskRepository.findById(id);
    }

    public Task crearTarea(Task task) {
        String titulo = task.getTitle().trim();
        if (taskRepository.existsByTitleIgnoreCase(titulo)) {
            throw new DuplicateTitleException("Ya existe una tarea con el título: " + titulo);
        }
        task.setTitle(titulo);
        return taskRepository.save(task);
    }

    public Optional<Task> actualizarTarea(Long id, Task datos) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(datos.getTitle());
            task.setDescription(datos.getDescription());
            return taskRepository.save(task);
        });
    }

    public boolean eliminarTarea(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}