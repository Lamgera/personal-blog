package com.personalblog.core.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.SneakyThrows;
import lombok.experimental.UtilityClass;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

@UtilityClass
public class DatabaseConnectionPool {

    HikariDataSource dataSource;

    static {
        Properties properties = new Properties();
        try (InputStream stream = DatabaseConnectionPool.class.getClassLoader().
                getResourceAsStream("application.properties")) {
            if (stream == null) {
                throw new RuntimeException("File application.properties not found in the folder resources");
            }
            properties.load(stream);
        } catch (IOException e) {
            // TODO Добавить запись логов в Elastic
            throw new ExceptionInInitializerError(new RuntimeException("Critical fail: cannot load DB resources"));
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(properties.getProperty("db.url"));
        config.setUsername(properties.getProperty("db.user"));
        config.setPassword(properties.getProperty("db.pass"));
        config.setDriverClassName(properties.getProperty("db.driver"));

        config.setMaximumPoolSize(15); //максимум потоков строим от количества ядер cpu компьютера
        config.setMinimumIdle(15); //рабочих потоков столько же сколько и макисмум
        config.setMaxLifetime(300000); //5 минут ожидания - хватит
        config.setConnectionTimeout(3000); //концепция fail fast - за 3 секунды не подключились - отмена
        config.setValidationTimeout(2000); //валидация не прошла - 2 секунды и отказ
        config.setKeepaliveTime(30000); //30 секунд для того, чтобы соединения не застаивалось

        dataSource = new HikariDataSource(config);
    }

    @SneakyThrows //TODO Мы хотим пробросить исключение выше и выше его обработать (лучше обработать его в сервлете)
    public Connection getConnection() {
        return dataSource.getConnection();
    }
}
