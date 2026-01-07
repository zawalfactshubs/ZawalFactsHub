// lazyload-global.js
document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll("img");
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Skip if already lazy-loaded
        if (!img.dataset.src) return;
        
        img.src = img.dataset.src; // load actual image
        img.removeAttribute("data-src"); // clean up
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: "100px", // preload just before scrolling
    threshold: 0.1
  });
  
  images.forEach(img => {
    // If src is not a placeholder, mark it for lazy loading
    if (!img.hasAttribute("data-lazy")) {
      img.dataset.src = img.src; // store original src
      img.src = "placeholder.jpg"; // tiny placeholder
      img.dataset.lazy = "true"; // mark as lazy
      observer.observe(img);
    }
  });
});