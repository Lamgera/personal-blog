package com.personalblog.registration.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ReadUserDto {
    Long id;
    String login;
}
