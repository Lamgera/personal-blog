package com.personalblog.core.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.personalblog.core.errors.JsonException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.experimental.UtilityClass;

import java.io.IOException;
import java.io.InputStream;

@UtilityClass
public class JSONMapper {

    private static final ObjectMapper mapper = new ObjectMapper();

    public <T> T readObject(InputStream stream, Class<T> tClass) {
        try {
            T readValue = mapper.readValue(stream, tClass);
            return readValue;
        } catch (IOException e) {
            throw new JsonException("Ошибка при парсинге JSON объекта");
            //TODO сюда мы запишем лог ошибки и отправим в Elastic
        }
    }

    public void writeObject(HttpServletResponse resp, Object o) {
        try {
            mapper.writeValue(resp.getOutputStream(), o);
        } catch (IOException e) {
            throw new JsonException("Ошибка при записи ответа в JSON объект");
            //TODO аналогично методу readObject
        }
    }
}
