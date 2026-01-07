// highresolution.js
window.HighRes = (function() {
  
  function exportElement(element, options = {}) {
    const {
      filename = 'image.png',
        scaleFactor = 2, // extra sharpness
        background = null
    } = options;
    
    const dpr = window.devicePixelRatio || 1;
    
    return html2canvas(element, {
      scale: dpr * scaleFactor,
      backgroundColor: background,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  
  function exportCanvas(drawFn, options = {}) {
    const {
      width = 1080,
        height = 1350,
        filename = 'image.png',
        scaleFactor = 2
    } = options;
    
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width * dpr * scaleFactor;
    canvas.height = height * dpr * scaleFactor;
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(dpr * scaleFactor, dpr * scaleFactor);
    
    drawFn(ctx, width, height);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  
  return {
    exportElement,
    exportCanvas
  };
})();