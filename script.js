function startAnnyang() {
    if (annyang) {
      const commands = {
        'hello': () => alert('Hello World!'),
        'change the color to *color': function (color) {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': function (page) {
          const lowerPage = page.toLowerCase();
          if (lowerPage === 'home') window.location.href = 'index.html';
          else if (lowerPage === 'stocks') window.location.href = 'stocks.html';
          else if (lowerPage === 'dogs') window.location.href = 'dogs.html';
        }
      };
  
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  function stopAnnyang() {
    if (annyang) {
      annyang.abort();
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-audio");
    const stopBtn = document.getElementById("stop-audio");
  
    if (startBtn) startBtn.addEventListener("click", startAnnyang);
    if (stopBtn) stopBtn.addEventListener("click", stopAnnyang);
  });
  