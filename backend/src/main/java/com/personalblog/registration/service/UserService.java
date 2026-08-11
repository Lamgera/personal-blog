package com.personalblog.registration.service;

import com.personalblog.core.errors.ServiceException;
import com.personalblog.registration.dao.UserDao;
import com.personalblog.registration.dto.LoginUserDto;
import com.personalblog.registration.dto.ReadUserDto;
import org.mindrot.jbcrypt.BCrypt;

public class UserService {

    private static final UserService INSTANCE = new UserService();
    private final UserDao userDao = UserDao.getInstance();

    public ReadUserDto login(LoginUserDto loginUserDto) {

        var userLogin = userDao.findByLogin(loginUserDto.getLogin());

        if (userLogin.isEmpty()) {
            throw new ServiceException("Invalid login or password! Please try again.");
        }

        var userEntity = userLogin.get();

        if(!passwordVerification(loginUserDto.getRawPassword(), userEntity.getPasswordHash())) {
            throw new ServiceException("Invalid login or password! Please try again.");
        }

        return ReadUserDto.builder()
                .id(userEntity.getId())
                .login(userEntity.getLogin())
                .build();
    }

    private boolean passwordVerification(String rawPassword, String hashPassword) {
        return BCrypt.checkpw(rawPassword, hashPassword);
    }


    private UserService() {}

    public static UserService getInstance() {
        return INSTANCE;
    }
}
