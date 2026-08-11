package com.personalblog.registration.dao;

import com.personalblog.core.dao.Dao;
import com.personalblog.core.errors.DaoException;
import com.personalblog.core.util.DatabaseConnectionPool;
import com.personalblog.registration.entity.UserEntity;
import lombok.SneakyThrows;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

public class UserDao implements Dao<Long, UserEntity> {

    private static final UserDao INSTANCE = new UserDao();

    private static final String FIND_BY_LOGIN_SQL = """
            SELECT
                id,
                login,
                password_hash
            FROM user_registration.users
            WHERE login = ?
            """;
    private static final String SAVE_SQL = """
            INSERT INTO user_registration.users
            VALUES (?, ?);
            """;

    private UserDao() {}

    public Optional<UserEntity> findByLogin(String login) {
        try (var connection = DatabaseConnectionPool.getConnection();
             var statement = connection.prepareStatement(FIND_BY_LOGIN_SQL)){
                statement.setObject(1, login);
                var resultSet = statement.executeQuery();

                UserEntity user = null;
                if (resultSet.next()) {
                    user = buildUser(resultSet);
                }
                return Optional.ofNullable(user);
        }
        catch (SQLException e) {
            throw new DaoException("The database couldn't find the user in the database", e);
            //TODO тут должна тоже быть запись в логгер - система должна зафиксировать проблему подключения
        }
    }

    public UserEntity save(UserEntity entity) {
        try (var connection = DatabaseConnectionPool.getConnection();
             var statement = connection.prepareStatement(SAVE_SQL, Statement.RETURN_GENERATED_KEYS)) {
            statement.setObject(1, entity.getLogin());
            statement.setObject(2, entity.getPasswordHash());
            statement.executeUpdate();

            var key = statement.getGeneratedKeys();
            if (key.next()) {
                entity.setId(key.getLong(1));
            }
            return entity;
        } catch (SQLException e) {
            throw new DaoException("The database failed to save the user in the database!", e);
        }
    }

    @Override
    public void update(UserEntity entity) {}

    @Override
    public boolean delete(Long id) {
        return false;
    }

    @Override
    public Optional<UserEntity> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<UserEntity> findAll() {
        return List.of();
    }

    @SneakyThrows
    private UserEntity buildUser(ResultSet resultSet) {
        return UserEntity.builder()
                .id(resultSet.getObject("id", Long.class))
                .login(resultSet.getObject("login", String.class))
                .passwordHash(resultSet.getObject("password_hash", String.class))
                .build();
    }

    public static UserDao getInstance() {
        return INSTANCE;
    }
}
