// src/main/java/com/wbs/mymovie/estbm/exception/ResourceNotFoundException.java
package com.wbs.mymovie.estbm.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}