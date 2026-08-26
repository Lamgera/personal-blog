/**
 * Точка входа для страницы регистрации
 * Содержит логику валидации и отправки данных на сервер
 */

const API_BASE_URL =
  "https://19ebd1bb-b458-49a3-8316-213c96d0c443.mock.pstmn.io";

// Настройки стилей для валидации (можно вынести в utils/config.js в будущем)
const validationSettings = {
  inputErrorClass: "form-input_type_error", // Убедитесь, что этот класс есть в CSS (или используйте "error", как в вашем CSS)
  errorClass: "visible", // В вашем CSS используется .form-error.visible
};

// DOM узлы
const registrationForm = document.getElementById("registration-form");
const emailInput = document.getElementById("reg-email");
const passwordInput = document.getElementById("reg-password");
const confirmPasswordInput = document.getElementById("reg-confirm-password");
const submitButton = registrationForm.querySelector(".form-submit");
const buttonText = submitButton.querySelector(".button-text");
const buttonLoading = submitButton.querySelector(".button-loading");
const formMessage = document.getElementById("form-message");

const emailError = document.getElementById("reg-email-error");
const passwordError = document.getElementById("reg-password-error");
const confirmPasswordError = document.getElementById(
  "reg-confirm-password-error",
);

const passwordToggles = document.querySelectorAll(".password-toggle");

// Получить текст ошибки
const getInputErrorMessage = (input) => {
  if (input.validity.valueMissing) {
    if (input === emailInput) return "Email обязателен";
    if (input === passwordInput) return "Пароль обязателен";
    if (input === confirmPasswordInput)
      return "Подтверждение пароля обязательно";
  }
  if (input.validity.typeMismatch && input === emailInput) {
    return "Введите корректный email";
  }
  if (
    input.validity.tooShort &&
    (input === passwordInput || input === confirmPasswordInput)
  ) {
    return "Минимум 6 символов";
  }
  return input.validationMessage || "Ошибка валидации";
};

// Показать ошибку под полем ввода
const showInputError = (input, errorElement) => {
  input.classList.add("error"); // Используем класс .error из вашего CSS
  errorElement.textContent = getInputErrorMessage(input);
  errorElement.classList.add(validationSettings.errorClass);
};

// Очистить ошибку поля ввода
const clearInputError = (input, errorElement) => {
  input.classList.remove("error");
  errorElement.textContent = "";
  errorElement.classList.remove(validationSettings.errorClass);
};

// Очистить все ошибки валидации в форме
const clearValidation = () => {
  clearInputError(emailInput, emailError);
  clearInputError(passwordInput, passwordError);
  clearInputError(confirmPasswordInput, confirmPasswordError);
  clearFormMessage();
};

// Проверка совпадения паролей (кастомная валидация)
const checkPasswordsMatch = () => {
  if (
    confirmPasswordInput.value &&
    passwordInput.value !== confirmPasswordInput.value
  ) {
    confirmPasswordInput.setCustomValidity("Пароли не совпадают");
  } else {
    confirmPasswordInput.setCustomValidity("");
  }
};

// Проверить валидность формы и активировать/деактивировать кнопку
const checkFormValidity = () => {
  checkPasswordsMatch(); // Обновляем кастомную валидацию перед проверкой
  submitButton.disabled = !registrationForm.checkValidity();
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

// Полностью сбросить форму
const resetForm = () => {
  registrationForm.reset();
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

// Обработка отправки формы регистрации
const handleRegistrationFormSubmit = (evt) => {
  evt.preventDefault();
  clearFormMessage();

  // Финальная валидация всех полей перед отправкой
  const isEmailValid = validateField(emailInput, emailError);
  const isPasswordValid = validateField(passwordInput, passwordError);

  checkPasswordsMatch(); // Принудительно проверяем совпадение перед валидацией последнего поля
  const isConfirmValid = validateField(
    confirmPasswordInput,
    confirmPasswordError,
  );

  if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
    return;
  }

  const formData = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  setLoading(true);

  fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-mock-response-code": 201,
    }, // x-mock-response-code для postman, для тестирования разных примеров - менять код
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "Что-то пошло не так...");
        });
      }
      return response.json();
    })
    .then((data) => {
      // Опционально: сохранить токен, если сервер его возвращает при регистрации
      // if (data.token) localStorage.setItem("auth_token", data.token);

      showFormMessage(
        "Регистрация прошла успешно! Теперь вы можете войти в ваш аккаунт",
        "success",
      );

      setTimeout(() => {
        window.location.href = "index.html#login";
      }, 5000);
    })
    .catch((error) => {
      const errorMessage = error.message || "Сервер не отвечает";
      showFormMessage(errorMessage, "error");
      setLoading(false);
    });
};

// === Event Listeners ===

// Отправка формы
registrationForm.addEventListener("submit", handleRegistrationFormSubmit);

// Обработка ввода для очистки ошибок и проверки валидности
[emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
  input.addEventListener("input", () => {
    // Для поля подтверждения пароля также проверяем совпадение при вводе
    if (input === confirmPasswordInput || input === passwordInput) {
      checkPasswordsMatch();
    }

    // Находим соответствующий элемент ошибки
    const errorElement =
      input === emailInput
        ? emailError
        : input === passwordInput
          ? passwordError
          : confirmPasswordError;

    clearInputError(input, errorElement);
    checkFormValidity();
  });

  // Потеря фокуса — показать ошибку, если поле невалидно
  input.addEventListener("blur", () => {
    if (input === confirmPasswordInput) checkPasswordsMatch();
    const errorElement =
      input === emailInput
        ? emailError
        : input === passwordInput
          ? passwordError
          : confirmPasswordError;
    validateField(input, errorElement);
  });
});

// Обработка кнопок показа пароля (универсально для обеих кнопок)
passwordToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const wrapper = toggle.closest(".password-wrapper");
    const input = wrapper.querySelector("input");
    const eyeOpen = toggle.querySelector(".eye-open");
    const eyeClosed = toggle.querySelector(".eye-closed");

    if (input.type === "password") {
      input.type = "text";
      eyeOpen.style.display = "none";
      eyeClosed.style.display = "block";
      toggle.setAttribute("aria-label", "Скрыть пароль");
    } else {
      input.type = "password";
      eyeOpen.style.display = "block";
      eyeClosed.style.display = "none";
      toggle.setAttribute("aria-label", "Показать пароль");
    }
  });
});

// Инициализация состояния кнопки при загрузке страницы
checkFormValidity();
