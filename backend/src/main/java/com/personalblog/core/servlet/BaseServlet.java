package com.personalblog.core.servlet;

import com.personalblog.core.errors.JsonException;
import com.personalblog.core.errors.ServiceException;
import com.personalblog.core.errors.ValidationException;
import com.personalblog.core.util.JSONMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

public class BaseServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            super.service(req, resp);
        } catch (ServiceException e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            JSONMapper.writeObject(resp, Map.of("Error!", e.getMessage()));
        } catch (ValidationException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONMapper.writeObject(resp, Map.of("Error!", e.getMessage()));
        } catch (JsonException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONMapper.writeObject(resp, Map.of("Error", "Malformed JSON request!"));
        } catch (Exception e) {
            e.printStackTrace(); //TODO добавить сюда логгер который отследит ошибку (или он тут не нужен, т.к. та же БД запишет лог еще в DAO
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONMapper.writeObject(resp,
                    Map.of("Error", "Error. Internal server error! Please try again later."));
        }
    }
}
