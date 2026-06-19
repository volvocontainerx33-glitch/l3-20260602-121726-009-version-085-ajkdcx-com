var MoviePlayer = (function () {
  function mount(src) {
    var video = document.getElementById("moviePlayer");
    var cover = document.querySelector(".player-cover");
    if (!video || !src) return;
    var hls = null;
    var started = false;

    function hideCover() {
      if (cover) cover.classList.add("is-hidden");
    }

    function playVideo() {
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    function attach() {
      if (started) {
        hideCover();
        playVideo();
        return;
      }
      started = true;
      hideCover();

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) return;
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        playVideo();
      } else {
        video.src = src;
        playVideo();
      }
    }

    if (cover) {
      cover.addEventListener("click", attach);
    }

    video.addEventListener("click", function () {
      if (!started) attach();
    });

    video.addEventListener("play", hideCover);
    window.addEventListener("pagehide", function () {
      if (hls) hls.destroy();
    });
  }

  return {
    mount: mount
  };
})();
