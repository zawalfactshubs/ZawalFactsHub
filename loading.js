window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const realContent = document.getElementById("real-content");
  
  const DISPLAY_MS = 1800;
  
  setTimeout(() => {
    loader.style.transition = "opacity .7s ease, visibility .7s";
    loader.style.opacity = 0;
    loader.style.visibility = "hidden";
    
    realContent.style.display = "block";
    realContent.style.opacity = 0;
    realContent.style.transition = "opacity .6s ease";
    requestAnimationFrame(() => realContent.style.opacity = 1);
    
  }, DISPLAY_MS);
});