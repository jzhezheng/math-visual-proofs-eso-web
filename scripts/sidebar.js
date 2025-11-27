const hamBtn = document.getElementById("hamburger-btn");
const sidebar = document.getElementById("sidebar-menu");
const closeBtn = document.getElementById("close-sidebar");

function openSidebar() {
  sidebar.style.display = "block";
  void sidebar.offsetWidth;
  sidebar.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => {
    if (!sidebar.classList.contains("open")) {
      sidebar.style.display = "none";
    }
  }, 300);
}

hamBtn.addEventListener("click", () => {
  const isOpening = !sidebar.classList.contains("open");

  if (isOpening) {
    openSidebar();
  } else {
    closeSidebar();
  }
});

closeBtn.addEventListener("click", closeSidebar);

document.addEventListener("click", (e) => {
  const clickedOutside =
    !hamBtn.contains(e.target) &&
    !sidebar.contains(e.target) &&
    !closeBtn.contains(e.target);

  if (clickedOutside && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

const submenuToggles = document.querySelectorAll('.submenu-toggle');

submenuToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const parentLi = toggle.parentElement;

    document.querySelectorAll('.has-submenu.active').forEach(activeItem => {
      if (activeItem !== parentLi) {
        activeItem.classList.remove('active');
      }
    });

    parentLi.classList.toggle('active');
  });
});

function closeAllSubmenus() {
  document.querySelectorAll('.has-submenu.active').forEach(item => {
    item.classList.remove('active');
  });
}

const originalCloseSidebar = closeSidebar;
closeSidebar = function() {
  closeAllSubmenus();
  originalCloseSidebar();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && sidebar.classList.contains('open')) {
    const focusableElements = sidebar.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});
