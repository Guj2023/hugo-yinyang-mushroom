// Audio service that runs in the background
let audio = new Audio("../audio/jazz-hiphop.mp3");
let playing = localStorage.getItem("audioPlaying") === "true";

// Initialize audio
function initAudio() {
  // Set audio time to saved position
  audio.addEventListener("loadedmetadata", () => {
    // Get saved time from localStorage
    const savedTime = parseFloat(localStorage.getItem("audioCurrentTime") || "0");
    audio.currentTime = Math.min(savedTime, audio.duration || 0);
    
    // Store audio duration for seeking functionality
    localStorage.setItem("audioDuration", audio.duration.toString());
    
    // Resume playback if it was playing before
    if (playing) {
      audio.play().catch(e => {
        console.log("Auto-play prevented: ", e);
        playing = false;
        localStorage.setItem("audioPlaying", "false");
      });
    }
  });
  
  // Audio progress tracking
  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    localStorage.setItem("audioProgress", progress.toString());
  });
  
  // Save time when the page is closed
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("audioCurrentTime", audio.currentTime.toString());
  });

  // Save time on pause for more accuracy
  audio.addEventListener("pause", () => {
    localStorage.setItem("audioCurrentTime", audio.currentTime.toString());
  });
  
  // Listen for play/pause commands from main pages
  window.addEventListener("storage", (event) => {
    if (event.key === "audioCommand") {
      if (event.newValue === "play") {
        audio.play();
        playing = true;
        localStorage.setItem("audioPlaying", "true");
      } else if (event.newValue === "pause") {
        audio.pause();
        playing = false;
        localStorage.setItem("audioPlaying", "false");
      } else if (event.newValue && event.newValue.startsWith("seek:")) {
        const seekTime = parseFloat(event.newValue.replace("seek:", ""));
        audio.currentTime = seekTime;
        localStorage.setItem("audioCurrentTime", audio.currentTime.toString());
      }
    }
  });
}

initAudio();
