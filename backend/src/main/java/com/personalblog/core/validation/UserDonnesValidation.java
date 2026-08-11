package com.personalblog.core.validation;

import com.personalblog.registration.dto.LoginUserDto;

import java.util.regex.Pattern;

public class UserDonnesValidation implements Validator<LoginUserDto>{

    private static final UserDonnesValidation INSTANCE = new UserDonnesValidation();
    private static final Pattern EmailRegex = Pattern.compile("^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern PasswordPattern = Pattern.compile("^(?=(?:.*[@#%,.?&*^<>\\-]){2,})" +
            "[a-zA-Z0-9!@#%,.?&*^<>\\-]{10,}$");

    public ValidationResult isValid(LoginUserDto object) {

        var result = new ValidationResult();

        if (object == null) {
            result.addError(Error.of("Object is null.", "User data is missing!"));
            return result;
        }

        var login = object.getLogin();
        var password = object.getRawPassword();

        if (login == null || login.isBlank() || password == null || password.isBlank()) {
            result.addError(Error.of("Login or password are invalid", "Some donnes are invalid"));
            return result;
        }
        if (!EmailRegex.matcher(login).matches()) {
            result.addError(Error.of("Login is incorrect", "Some donnes are invalid"));
        }
        if (!PasswordPattern.matcher(password).matches()) {
            result.addError(Error.of("Password is incorrect", "The password must be longer" +
                    "than 10 characters and contain 2 special characters"));
        }
        return result;
    }

    public static UserDonnesValidation getInstance() {
        return INSTANCE;
    }
}
