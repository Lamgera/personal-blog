package com.personalblog.core.validation;

import lombok.Value;

@Value(staticConstructor = "of")
public class Error {
    String errorCode;
    String message;
}
