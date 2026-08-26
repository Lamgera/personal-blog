/**
 * Модуль работы с авторизацией: токены, данные пользователя, авторизованные запросы
 */

// Ключи для хранения в localStorage
const STORAGE_KEYS = {
  accessToken: "auth_access_token",
  refreshToken: "auth_refresh_token",
  userData: "auth_user_data",
};

/**
 * Сохранить данные после успешного входа
 * @param {Object} data - ответ сервера с токенами и данными пользователя
 */
export const saveAuthData = (data) => {
  const { accessToken, refreshToken, id, login, username, role } = data;

  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);

  // Роль сохраняем, но не показываем пользователю
  localStorage.setItem(
    STORAGE_KEYS.userData,
    JSON.stringify({ id, login, username, role })
  );
};

/**
 * Получить accessToken
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.accessToken);
};

/**
 * Получить refreshToken
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
};

/**
 * Получить данные пользователя (без роли для отображения)
 * @returns {Object|null}
 */
export const getUserData = () => {
  const data = localStorage.getItem(STORAGE_KEYS.userData);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    // Возвращаем только то, что показываем пользователю
    return {
      id: parsed.id,
      login: parsed.login,
      username: parsed.username,
    };
  } catch {
    return null;
  }
};

/**
 * Проверка авторизации пользователя
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getAccessToken() !== null;
};

/**
 * Выход — очистка всех данных авторизации
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userData);
};

/**
 * Обёртка над fetch, которая автоматически прикрепляет accessToken в заголовок
 * Используется для ВСЕХ запросов авторизованного пользователя
 *
 * @param {string} url - адрес запроса
 * @param {Object} options - параметры запроса (как в обычном fetch)
 * @returns {Promise<Response>}
 */
export const authFetch = (url, options = {}) => {
  const token = getAccessToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      // Формат из спецификации: "Авторизация": "Берер <токен>"
      Authorization: `Bearer ${token}`,
    },
  });
};