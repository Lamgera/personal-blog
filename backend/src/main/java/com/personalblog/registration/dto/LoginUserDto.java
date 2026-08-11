package com.personalblog.registration.dto;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class LoginUserDto {
    String login;
    String rawPassword;
}
