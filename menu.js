// menu.js
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  
  // Add a close button if it doesn't exist
  let closeMenu = navMenu.querySelector(".close-menu");
  if (!closeMenu) {
    closeMenu = document.createElement("span");
    closeMenu.textContent = "✖";
    closeMenu.className = "close-menu";
    
    // 🔥 FORCE STYLES (inline = strongest)
    closeMenu.style.color = "#ffffff"; // white
    closeMenu.style.fontSize = "1.5rem";
    closeMenu.style.cursor = "pointer";
    closeMenu.style.marginBottom = "1rem";
    closeMenu.style.alignSelf = "flex-end";
    closeMenu.style.transition = "color 0.3s, transform 0.3s";
    
    // Hover effects (JS-based)
    closeMenu.addEventListener("mouseenter", () => {
      closeMenu.style.color = "#CD7F32"; // gold
      closeMenu.style.transform = "scale(1.2)";
    });
    
    closeMenu.addEventListener("mouseleave", () => {
      closeMenu.style.color = "#ffffff";
      closeMenu.style.transform = "scale(1)";
    });
    
    navMenu.prepend(closeMenu);
  }
  
  // Open / close menu
  hamburger.addEventListener("click", () => {
    navMenu.classList.add("open");
  });
  
  closeMenu.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove("open");
    }
  });
});