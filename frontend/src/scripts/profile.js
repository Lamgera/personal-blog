// Импортируем функции авторизации (убедись, что путь правильный относительно profile.js)
import { isAuthenticated, getUserData, logout } from "./components/auth.js";

// === 1. ЛОГИКА ХЕДЕРА (как в index.js) ===
const loginButton = document.querySelector(".header__login-button");
const profileWrapper = document.querySelector(".header__profile-wrapper");
const profileButton = profileWrapper.querySelector(".header__profile-button");
const profileAvatar = document.querySelector(".header__avatar");
const profileUsername = document.querySelector(".header__username");
const logoutButton = document.querySelector(".header__dropdown-item--logout");

const getInitials = (username) => username ? username.charAt(0).toUpperCase() : "?";

const toggleProfileDropdown = () => {
  const isOpen = profileWrapper.classList.toggle("open");
  profileButton.setAttribute("aria-expanded", isOpen);
};

const closeProfileDropdown = () => {
  profileWrapper.classList.remove("open");
  profileButton.setAttribute("aria-expanded", "false");
};

// === 2. ЛОГИКА СТРАНИЦЫ ПРОФИЛЯ ===
const profileNickname = document.getElementById("profile-nickname");
const profileStatus = document.getElementById("profile-status");
const profileBio = document.getElementById("profile-bio");
const profileActionBtn = document.getElementById("profile-action-btn");
const profileArticlesList = document.getElementById("profile-articles-list");

// Функция рендеринга статей (пока заглушка, позже заменишь на fetch)
const renderArticles = (articles) => {
  profileArticlesList.innerHTML = ""; // Очистка
  
  if (!articles || articles.length === 0) {
    profileArticlesList.innerHTML = `<p class="muted-text" style="padding: 1rem;">У пользователя пока нет статей.</p>`;
    return;
  }

  articles.forEach(article => {
    const articleCard = document.createElement("article");
    articleCard.className = "article-card";
    articleCard.innerHTML = `
      <div class="article-card__img" style="background-image: url('${article.image || 'https://via.placeholder.com/300x150'}')"></div>
      <div class="article-card__content">
        <h3 class="article-card__title">${article.title}</h3>
        <p class="article-card__date">${article.date}</p>
      </div>
    `;
    // Можно добавить переход на страницу статьи: articleCard.addEventListener('click', () => ...)
    profileArticlesList.appendChild(articleCard);
  });
};

// Инициализация страницы
const initProfilePage = () => {
  if (isAuthenticated()) {
    const user = getUserData();
    
    if (user) {
      // 1. Настраиваем хедер
      loginButton.classList.add("visually-hidden");
      profileWrapper.classList.remove("visually-hidden");
      profileUsername.textContent = user.username;
      profileAvatar.textContent = getInitials(user.username);

      // 2. Заполняем данные профиля
      profileNickname.textContent = user.username;
      // Если в объекте user есть status/bio, используем их, иначе ставим заглушку
      profileStatus.textContent = user.status || "Пользователь"; 
      profileBio.textContent = user.bio || "Фронтенд-разработчик, любитель чистого кода и минимализма. Ведет этот блог, чтобы делиться мыслями о веб-технологиях.";

      // 3. Настраиваем кнопку действия (это свой профиль)
      profileActionBtn.textContent = "Редактировать";
      profileActionBtn.addEventListener("click", () => {
        // Здесь будет переход на страницу редактирования или открытие модалки
        console.log("Переход к редактированию профиля");
        // window.location.href = "edit-profile.html"; 
      });

      // 4. Рендерим статьи (заглушка данных, замени на fetch к твоему API)
      const mockArticles = [
        { title: "Почему ванильный JS всё ещё крут", date: "12 Октября 2023", image: "https://via.placeholder.com/300x150" },
        { title: "CSS Grid: шпаргалка для запоминания", date: "05 Октября 2023", image: "https://via.placeholder.com/300x150" },
        { title: "Как не выгореть в IT", date: "28 Сентября 2023", image: "https://via.placeholder.com/300x150" }
      ];
      renderArticles(mockArticles);

      // 5. Обработчики событий для дропдауна
      profileButton.addEventListener("click", (evt) => {
        evt.stopPropagation();
        toggleProfileDropdown();
      });

      document.addEventListener("click", (evt) => {
        if (!profileWrapper.contains(evt.target)) {
          closeProfileDropdown();
        }
      });

      document.addEventListener("keydown", (evt) => {
        if (evt.key === "Escape") closeProfileDropdown();
      });

      // Выход из аккаунта (дублируем логику из хедера и кебаб-меню)
      const handleLogout = () => {
        logout();
        window.location.href = "index.html"; // Перенаправляем на главную после выхода
      };

      logoutButton.addEventListener("click", handleLogout);
      
      // Также добавим выход в кебаб-меню для удобства
      const kebabLogoutBtn = document.querySelector(".kebab-dropdown__item.text-danger");
      if (kebabLogoutBtn) {
        kebabLogoutBtn.addEventListener("click", handleLogout);
      }
    }
  } else {
    // Если пользователь не авторизован, перенаправляем на главную или показываем кнопку входа
    // Для простоты оставим кнопку "Войти" активной, а профиль заполним заглушками "Гость"
    profileNickname.textContent = "Гость";
    profileStatus.textContent = "Не авторизован";
    profileBio.textContent = "Пожалуйста, войдите в аккаунт, чтобы увидеть полную информацию профиля.";
    profileActionBtn.textContent = "Войти";
    profileActionBtn.addEventListener("click", () => {
      window.location.href = "index.html#login"; // Открываем главную с хешем для модалки
    });
    renderArticles([]);
  }
};

// === 3. ЛОГИКА КЕБАБ-МЕНЮ ===
const kebabToggle = document.getElementById("kebab-toggle");
const kebabDropdown = document.getElementById("kebab-dropdown");

if (kebabToggle && kebabDropdown) {
  kebabToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    kebabDropdown.classList.toggle("is-open");
  });

  document.addEventListener("click", (e) => {
    if (!kebabDropdown.contains(e.target) && e.target !== kebabToggle) {
      kebabDropdown.classList.remove("is-open");
    }
  });
}

// Запуск инициализации при загрузке DOM
document.addEventListener("DOMContentLoaded", initProfilePage);