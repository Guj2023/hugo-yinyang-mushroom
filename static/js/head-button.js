// This file handles UI controls for the audio player
document.addEventListener("DOMContentLoaded", () => {
  // Check if the iframe already exists
  let audioFrame = document.getElementById("audio-service-frame");
  
  // Create iframe for persistent audio if it doesn't exist
  if (!audioFrame) {
    audioFrame = document.createElement("iframe");
    audioFrame.id = "audio-service-frame";
    audioFrame.src = "/html/audio-frame.html";
    audioFrame.style.display = "none";
    document.body.appendChild(audioFrame);
  }
  
  // Retrieve state from localStorage
  let playing = localStorage.getItem("audioPlaying") === "true";
  
  const headButton = document.getElementById("head-button");
  const progressBar = document.getElementById("audio-progress");
  
  if (headButton) {
    // Set initial button text based on saved state with standard symbols
    const playSymbol = "▶"; // Standard Unicode play triangle
    const pauseSymbol = "❙ ❙"; // Double vertical bars for pause
    headButton.textContent = playing ? pauseSymbol : playSymbol;
    
    // Update progress bar based on stored value
    if (progressBar) {
      progressBar.value = parseFloat(localStorage.getItem("audioProgress") || "0");
      
      // Update progress bar when audio progresses (event from service)
      window.addEventListener("storage", (event) => {
        if (event.key === "audioProgress") {
          progressBar.value = parseFloat(event.newValue || "0");
        } else if (event.key === "audioPlaying") {
          playing = event.newValue === "true";
          headButton.textContent = playing ? pauseSymbol : playSymbol;
        }
      });
    }
    
    headButton.addEventListener("click", () => {
      if (!playing) {
      // Send command to play audio
      localStorage.setItem("audioCommand", "play");
      headButton.textContent = pauseSymbol;
      playing = true;
      } else {
      // Send command to pause audio
      localStorage.setItem("audioCommand", "pause");
      headButton.textContent = playSymbol;
      playing = false;
      }
      // Clear the command (to allow repeated same commands)
      setTimeout(() => localStorage.removeItem("audioCommand"), 100);
    });
    
    // Allow seeking through the track
    if (progressBar) {
      progressBar.addEventListener("input", () => {
        const duration = parseFloat(localStorage.getItem("audioDuration") || "0");
        if (duration > 0) {
          const seekTime = (progressBar.value * duration) / 100;
          localStorage.setItem("audioCommand", `seek:${seekTime}`);
          // Clear the command
          setTimeout(() => localStorage.removeItem("audioCommand"), 100);
        }
      });
    }
  }
});
