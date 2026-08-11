package com.personalblog.registration.servlet;

import com.personalblog.core.servlet.BaseServlet;
import com.personalblog.core.util.JSONMapper;
import com.personalblog.core.util.UrlPath;
import com.personalblog.core.validation.UserDonnesValidation;
import com.personalblog.registration.dto.LoginUserDto;
import com.personalblog.registration.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(UrlPath.LOGIN)
public class LoginServlet extends BaseServlet {

    private final UserDonnesValidation validator = UserDonnesValidation.getInstance();
    private final UserService service = UserService.getInstance();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        var data = JSONMapper.readObject(req.getInputStream(), LoginUserDto.class);

        var parsedData = validator.isValid(data);
        if (!parsedData.isValid()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONMapper.writeObject(resp, parsedData.getErrors());
            return;
        }
        var readUserDto = service.login(data);

        JSONMapper.writeObject(resp, readUserDto);
        resp.setStatus(HttpServletResponse.SC_OK); //уведомляем клиент, что все хорошо
        //TODO здесь же мы должны будем потом обработать открытие сессии или поработать с JWT токенами
        //TODO Также нужно добавить обработку исключений из нижних уровней (места со @SneakyThrows)
        //TODO нужно ли обработать в этом сервлете все запросы, которые мы писали в Postman (200,400,401,429,500)
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Мы достучались из браузера до сервера");
    }
}
