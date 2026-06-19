import { H as Hls } from "./hls.js";

document.addEventListener("DOMContentLoaded", function () {
    var playerCards = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    playerCards.forEach(function (card) {
        var video = card.querySelector("video");
        var startButton = card.querySelector("[data-player-start]");
        var status = card.querySelector("[data-player-status]");
        if (!video || !startButton) {
            return;
        }

        startButton.addEventListener("click", function () {
            startPlayback(video, startButton, status);
        });
    });
});

function startPlayback(video, startButton, status) {
    var hlsSource = video.getAttribute("data-src");
    var mp4Source = video.getAttribute("data-mp4");

    setStatus(status, "正在初始化播放源");
    startButton.classList.add("is-hidden");

    if (hlsSource && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsSource;
        playVideo(video, status, mp4Source);
        return;
    }

    if (hlsSource && Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false
        });
        hls.loadSource(hlsSource);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            playVideo(video, status, mp4Source);
        });
        hls.on(Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
                setStatus(status, "HLS 播放失败，切换备用 MP4");
                fallbackToMp4(video, status, mp4Source);
            }
        });
        return;
    }

    fallbackToMp4(video, status, mp4Source);
}

function playVideo(video, status, mp4Source) {
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
        promise.then(function () {
            setStatus(status, "正在播放");
        }).catch(function () {
            setStatus(status, "浏览器阻止自动播放，请再次点击视频播放");
            fallbackToMp4(video, status, mp4Source);
        });
    } else {
        setStatus(status, "正在播放");
    }
}

function fallbackToMp4(video, status, mp4Source) {
    if (!mp4Source) {
        setStatus(status, "未检测到可用备用源");
        return;
    }
    video.src = mp4Source;
    playVideo(video, status, null);
}

function setStatus(status, text) {
    if (status) {
        status.textContent = text;
    }
}
