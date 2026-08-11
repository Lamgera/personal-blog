package com.personalblog.core.validation;

public interface Validator<T> {

    ValidationResult isValid(T object);
}
