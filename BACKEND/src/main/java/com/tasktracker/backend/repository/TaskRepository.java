package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    boolean existsByTitleIgnoreCase(String title);

    List<Task> findByDueDateOrderByIdAsc(LocalDate dueDate);
}
