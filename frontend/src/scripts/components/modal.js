/**
 * Универсальный модуль для работы с модальными окнами
 */

// Храним элемент, который открыл модалку, чтобы вернуть на него фокус
let lastFocusedElement = null;

/**
 * Сделать весь контент страницы inert (недоступным для фокуса)
 */
const setPageInert = (modal) => {
  document.body.childNodes.forEach((node) => {
    // Пропускаем саму модалку и неэлементные узлы
    if (node === modal || node.nodeType !== Node.ELEMENT_NODE) return;
    node.setAttribute("inert", "");
    // Скрываем из дерева доступности
    node.setAttribute("aria-hidden", "true");
  });
};

/**
 * Вернуть доступность контенту страницы
 */
const setPageAccessible = (modal) => {
  document.body.childNodes.forEach((node) => {
    if (node === modal || node.nodeType !== Node.ELEMENT_NODE) return;
    node.removeAttribute("inert");
    node.removeAttribute("aria-hidden");
  });
};

/**
 * Открывает модальное окно
 */
export const openModalWindow = (modal) => {
  // Запоминаем, что было в фокусе до открытия
  lastFocusedElement = document.activeElement;

  // Блокируем фокус на остальной странице
  setPageInert(modal);

  modal.classList.add("active");
  document.body.classList.add("modal-open");

  // Фокус на первый интерактивный элемент модалки
  const firstFocusable = modal.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();
};

/**
 * Закрывает модальное окно
 */
export const closeModalWindow = (modal) => {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");

  // Возвращаем доступность странице
  setPageAccessible(modal);

  // Возвращаем фокус на элемент, открывший модалку
  lastFocusedElement?.focus();
  lastFocusedElement = null;
};

/**
 * Обработчики закрытия (крестик, оверлей, Escape)
 */
export const setCloseModalWindowEventListeners = (modal) => {
  const closeButton = modal.querySelector(".modal__close");

  closeButton?.addEventListener("click", () => closeModalWindow(modal));

  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) closeModalWindow(modal);
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && modal.classList.contains("active")) {
      closeModalWindow(modal);
    }
  });
};