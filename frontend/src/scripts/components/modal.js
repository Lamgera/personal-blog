/**
 * Универсальный модуль для работы с модальными окнами
 * Экспортирует функции для открытия, закрытия и настройки обработчиков
 */

/**
 * Открывает модальное окно
 * @param {HTMLElement} modal - DOM элемент модального окна
 */
export const openModalWindow = (modal) => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

/**
 * Закрывает модальное окно
 * @param {HTMLElement} modal - DOM элемент модального окна
 */
export const closeModalWindow = (modal) => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

/**
 * Устанавливает обработчики событий для закрытия модального окна
 * @param {HTMLElement} modal - DOM элемент модального окна
 */
export const setCloseModalWindowEventListeners = (modal) => {
  const closeButton = modal.querySelector(".modal__close");
  
  // Закрытие по кнопке крестика
  closeButton?.addEventListener("click", () => {
    closeModalWindow(modal);
  });
  
  // Закрытие по клику на оверлей
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModalWindow(modal);
    }
  });
  
  // Закрытие по Escape
  const handleEscapeKey = (evt) => {
    if (evt.key === "Escape" && modal.classList.contains("active")) {
      closeModalWindow(modal);
    }
  };
  
  document.addEventListener("keydown", handleEscapeKey);
  
  // Очистка обработчика при закрытии
  modal.addEventListener("transitionend", () => {
    if (!modal.classList.contains("active")) {
      document.removeEventListener("keydown", handleEscapeKey);
    }
  });
};