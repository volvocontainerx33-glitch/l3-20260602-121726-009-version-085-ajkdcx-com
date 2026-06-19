document.addEventListener("DOMContentLoaded", function () {
  var box = document.querySelector("[data-stream]");

  if (!box) {
    return;
  }

  var video = box.querySelector("video");
  var button = box.querySelector("button");
  var stream = box.getAttribute("data-stream");
  var hlsInstance = null;

  function markPlaying() {
    box.classList.add("is-playing");
  }

  function startVideo() {
    if (!video || !stream) {
      return;
    }

    if (hlsInstance) {
      video.play().catch(function () {});
      markPlaying();
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      video.play().catch(function () {});
      markPlaying();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
        markPlaying();
      });
      return;
    }

    video.src = stream;
    video.play().catch(function () {});
    markPlaying();
  }

  if (button) {
    button.addEventListener("click", startVideo);
  }

  if (video) {
    video.addEventListener("play", markPlaying);
  }
});
