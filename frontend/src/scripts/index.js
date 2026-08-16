/**
 * Точка входа в приложение
 * Содержит логику инициализации и работы со страницей
 */

import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";

// Настройки стилей для валидации
const validationSettings = {
  inputErrorClass: "form-input_type_error",
  errorClass: "form-error_visible",
};

const API_BASE_URL = "https://ff48b7b8-3885-4946-a1d2-99d06cec5301.mock.pstmn.io";

// DOM узлы
const loginModal = document.getElementById("login-modal");
const loginForm = loginModal.querySelector(".login-form");
const emailInput = loginModal.querySelector("#email");
const passwordInput = loginModal.querySelector("#password");
const submitButton = loginModal.querySelector(".form-submit");
const buttonText = submitButton.querySelector(".button-text");
const buttonLoading = submitButton.querySelector(".button-loading");
const formMessage = loginModal.querySelector("#form-message");
const emailError = loginModal.querySelector("#email-error");
const passwordError = loginModal.querySelector("#password-error");
const passwordToggle = loginModal.querySelector(".password-toggle");
const eyeOpen = passwordToggle.querySelector(".eye-open");
const eyeClosed = passwordToggle.querySelector(".eye-closed");

// Кнопки для открытия модалки
const openLoginButton = document.querySelector(".header__login-button");
const editButton = document.querySelector('[data-navigate="editing"]');

// Получить текст ошибки
const getInputErrorMessage = (input) => {
  if (input.validity.valueMissing) {
    return input === emailInput ? "Email обязателен" : "Пароль обязателен";
  }
  if (input.validity.typeMismatch) {
    return "Введите корректный email";
  }
  return input.validationMessage || "Ошибка валидации";
};

// Показать ошибку под полем ввода
const showInputError = (input, errorElement) => {
  input.classList.add(validationSettings.inputErrorClass);
  errorElement.textContent = getInputErrorMessage(input);
  errorElement.classList.add(validationSettings.errorClass);
};

// Очистить ошибку поля ввода
const clearInputError = (input, errorElement) => {
  input.classList.remove(validationSettings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(validationSettings.errorClass);
};

// Очистить все ошибки валидации в форме
const clearValidation = () => {
  clearInputError(emailInput, emailError);
  clearInputError(passwordInput, passwordError);
  clearFormMessage();
};

// Проверить валидность формы и активировать/деактивировать кнопку
const checkFormValidity = () => {
  submitButton.disabled = !loginForm.checkValidity();
};

// Показать сообщение формы (успех или ошибка)
const showFormMessage = (message, type = "success") => {
  formMessage.textContent = message;
  formMessage.className = `form-message visible ${type}`;
};

// Очистить сообщение формы
const clearFormMessage = () => {
  formMessage.className = "form-message";
  formMessage.textContent = "";
};

// Установить состояние загрузки
const setLoading = (isLoading) => {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
  } else {
    submitButton.classList.remove("is-loading");
    checkFormValidity();
  }
};

// Полностью сбросить форму (очистить значения, ошибки, состояние)
const resetForm = () => {
  loginForm.reset();
  clearValidation();
  setLoading(false);
};

// Валидация конкретного поля с показом/скрытием ошибки
const validateField = (input, errorElement) => {
  if (!input.validity.valid) {
    showInputError(input, errorElement);
    return false;
  }
  clearInputError(input, errorElement);
  return true;
};

// Обработка отправки формы входа
const handleLoginFormSubmit = (evt) => {
  evt.preventDefault();
  clearFormMessage();

  const isEmailValid = validateField(emailInput, emailError);
  const isPasswordValid = validateField(passwordInput, passwordError);

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  const formData = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  setLoading(true);

  fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
        'x-mock-response-code': 200 }, // x-mock-response-code для postman, для тестирования разных примеров - менять код
    body: JSON.stringify(formData),
  })
    .then((response) => {
      // Сервер доступен, но отклонил запрос (4xx, 5xx)
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "Что-то пошло не так...");
        });
      }
      // Успех (200–299)
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("auth_token", data.token);
      showFormMessage("Вход выполнен успешно!", "success");
      setTimeout(() => {
        closeModalWindow(loginModal);
        window.location.reload();
      }, 1000);
    })
    .catch((error) => {
      // Network Error / Server Error
      const errorMessage = error.message || "Сервер не отвечает";
      showFormMessage(errorMessage, "error");
      setLoading(false);
    });
};

// Открыть модальное окно — СБРАСЫВАЕМ форму при открытии
const openLoginModal = () => {
  resetForm();
  openModalWindow(loginModal);
  checkFormValidity();
  emailInput.focus();
};

// Проверка авторизации пользователя
const isAuthenticated = () => {
  return localStorage.getItem("auth_token") !== null;
};

// Показать пароль (переключить input в type="text")
const showPassword = () => {
  passwordInput.type = "text";
  eyeOpen.style.display = "none";
  eyeClosed.style.display = "block";
};

// Скрыть пароль (переключить input в type="password")
const hidePassword = () => {
  passwordInput.type = "password";
  eyeOpen.style.display = "block";
  eyeClosed.style.display = "none";
};

// === Event Listeners ===

// Отправка формы
loginForm.addEventListener("submit", handleLoginFormSubmit);

// Ввод email — очистка ошибки + проверка валидности формы для кнопки
emailInput.addEventListener("input", () => {
  clearInputError(emailInput, emailError);
  checkFormValidity();
});

// Потеря фокуса email — показать ошибку если поле невалидно
emailInput.addEventListener("blur", () => {
  validateField(emailInput, emailError);
});

// Ввод пароля — очистка ошибки + проверка валидности формы
passwordInput.addEventListener("input", () => {
  clearInputError(passwordInput, passwordError);
  checkFormValidity();
});

// Потеря фокуса пароля
passwordInput.addEventListener("blur", () => {
  validateField(passwordInput, passwordError);
});

passwordToggle.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    showPassword();
  } else {
    hidePassword();
  }
});

// Открытие модалки по кнопке "Sign in"
openLoginButton.addEventListener("click", openLoginModal);

// Открытие модалки по кнопке "Редактировать" если пользователь не авторизован
editButton.addEventListener("click", (evt) => {
  if (!isAuthenticated()) {
    evt.preventDefault();
    openLoginModal();
  }
});

// Настройка закрытия модалки
setCloseModalWindowEventListeners(loginModal);

// Обработка авторизованного состояния
if (isAuthenticated()) {
  openLoginButton.textContent = "Выйти";
  // Удаляем старый listener и навешиваем новый
  openLoginButton.replaceWith(openLoginButton.cloneNode(true));
  document
    .querySelector(".header__login-button")
    .addEventListener("click", () => {
      localStorage.removeItem("auth_token");
      window.location.reload();
    });
}

// Инициализация состояния кнопки при загрузке
checkFormValidity();
