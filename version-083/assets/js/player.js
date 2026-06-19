import { H as Hls } from './hlsjs-dru42stk.js';

function setupPlayer(player) {
  var video = player.querySelector('video');
  var overlay = player.querySelector('[data-player-overlay]');
  var status = player.querySelector('[data-player-status]');
  var source = player.dataset.video;
  var initialized = false;
  var hlsInstance = null;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function init() {
    if (initialized || !video || !source) {
      return;
    }

    initialized = true;
    setStatus('正在加载播放源…');

    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('播放源已就绪');
      });
      hlsInstance.on(Hls.Events.ERROR, function (_event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStatus('网络加载异常，正在重试…');
          hlsInstance.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setStatus('媒体解码异常，正在恢复…');
          hlsInstance.recoverMediaError();
        } else {
          setStatus('当前浏览器无法播放该视频源');
          hlsInstance.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        setStatus('播放源已就绪');
      });
    } else {
      setStatus('当前浏览器不支持 HLS 播放');
    }
  }

  function play() {
    init();
    if (video) {
      video.play().then(function () {
        if (overlay) {
          overlay.style.display = 'none';
        }
      }).catch(function () {
        setStatus('点击视频控制栏可继续播放');
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.movie-player').forEach(setupPlayer);
});
