package com.tasktracker.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)   // cuando se lance → HTTP 409
public class DuplicateTitleException extends RuntimeException {

    public DuplicateTitleException(String message) {
        super(message);
    }
}