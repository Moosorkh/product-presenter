type SeekRequest =
  | { kind: "time"; value: number }
  | { kind: "progress"; value: number };

type QueuedVideoSeekerOptions = {
  frameRate?: number;
  loop?: boolean;
  onSettled?: () => void;
};

type QueuedVideoSeeker = {
  clear: () => void;
  destroy: () => void;
  isIdle: () => boolean;
  seek: (time: number) => void;
  seekToProgress: (progress: number) => void;
};

const hasDuration = (video: HTMLVideoElement) =>
  Number.isFinite(video.duration) && video.duration > 0;

const wrap = (value: number, duration: number) =>
  ((value % duration) + duration) % duration;

export function createBufferedVideoSource(
  video: HTMLVideoElement,
  sourceUrl: string,
  observeTarget: Element
) {
  const abortController = new AbortController();
  let objectUrl: string | null = null;
  let disposed = false;
  let loading = false;

  const load = async () => {
    if (disposed || loading || objectUrl) return;
    loading = true;

    try {
      const response = await fetch(sourceUrl, {
        cache: "force-cache",
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`Video request failed: ${response.status}`);

      const blob = await response.blob();
      if (disposed) return;

      objectUrl = URL.createObjectURL(blob);
      video.src = objectUrl;
      video.load();
    } catch (error) {
      if (disposed || (error instanceof DOMException && error.name === "AbortError")) {
        return;
      }

      // Preserve playback if an aggressive privacy setting blocks Blob URLs.
      video.src = sourceUrl;
      video.load();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void load();
    },
    { rootMargin: "150% 0px" }
  );

  observer.observe(observeTarget);

  return {
    destroy() {
      disposed = true;
      observer.disconnect();
      abortController.abort();

      if (objectUrl) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    },
  };
}

function createQueuedVideoSeeker(
  video: HTMLVideoElement,
  {
    frameRate = 24,
    loop = false,
    onSettled,
  }: QueuedVideoSeekerOptions = {}
): QueuedVideoSeeker {
  const frameDuration = 1 / frameRate;
  const seekThreshold = frameDuration / 2;
  let pending: SeekRequest | null = null;
  let disposed = false;
  let frameCheckId: number | null = null;

  const resolveTarget = (request: SeekRequest) => {
    const duration = video.duration;

    if (request.kind === "progress") {
      const lastFrame = Math.max(duration - frameDuration, 0);
      return Math.min(Math.max(request.value, 0), 1) * lastFrame;
    }

    if (loop) return wrap(request.value, duration);

    return Math.min(
      Math.max(request.value, 0),
      Math.max(duration - frameDuration, 0)
    );
  };

  const notifyWhenIdle = () => {
    if (!disposed && pending === null && !video.seeking) onSettled?.();
  };

  const flush = () => {
    if (disposed || pending === null || video.seeking || !hasDuration(video)) {
      return;
    }

    const request = pending;
    const target = resolveTarget(request);
    pending = null;

    if (Math.abs(video.currentTime - target) < seekThreshold) {
      notifyWhenIdle();
      return;
    }

    try {
      video.currentTime = target;
    } catch {
      pending = request;
      return;
    }

    // Chromium normally flips `seeking` synchronously. This fallback also
    // covers cached frames where no seek event is dispatched.
    if (!video.seeking) {
      frameCheckId = window.requestAnimationFrame(() => {
        frameCheckId = null;
        if (pending) flush();
        else notifyWhenIdle();
      });
    }
  };

  const onSeeked = () => {
    if (pending) flush();
    else notifyWhenIdle();
  };

  const onMetadata = () => {
    if (pending) flush();
    else notifyWhenIdle();
  };

  video.addEventListener("seeked", onSeeked);
  video.addEventListener("loadedmetadata", onMetadata);
  video.addEventListener("loadeddata", onMetadata);
  video.addEventListener("durationchange", onMetadata);

  return {
    seek(time) {
      if (!Number.isFinite(time)) return;
      pending = { kind: "time", value: time };
      flush();
    },
    seekToProgress(progress) {
      if (!Number.isFinite(progress)) return;
      pending = { kind: "progress", value: progress };
      flush();
    },
    clear() {
      pending = null;
    },
    isIdle() {
      return pending === null && !video.seeking;
    },
    destroy() {
      disposed = true;
      pending = null;
      if (frameCheckId !== null) window.cancelAnimationFrame(frameCheckId);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", onMetadata);
      video.removeEventListener("durationchange", onMetadata);
    },
  };
}

type HybridVideoScrubberOptions = {
  frameRate?: number;
  resumeDelayMs?: number;
};

export function createHybridVideoScrubber(
  video: HTMLVideoElement,
  {
    frameRate = 24,
    resumeDelayMs = 220,
  }: HybridVideoScrubberOptions = {}
) {
  let active = false;
  let scrubbing = false;
  let desiredTime = 0;
  let pendingProgressDelta = 0;
  let resumeTimer: number | null = null;
  let wantsPlayback = false;
  let disposed = false;
  let playbackGeneration = 0;

  const playWhenReady = () => {
    if (
      disposed ||
      !active ||
      !wantsPlayback ||
      !seeker.isIdle() ||
      video.readyState < HTMLMediaElement.HAVE_METADATA
    ) {
      return;
    }

    const generation = ++playbackGeneration;
    wantsPlayback = false;
    scrubbing = false;
    void video
      .play()
      .then(() => {
        if (
          disposed ||
          !active ||
          (generation !== playbackGeneration && scrubbing)
        ) {
          video.pause();
        }
      })
      .catch(() => {
        // Muted autoplay can still be disabled by browser or OS preferences.
      });
  };

  const seeker = createQueuedVideoSeeker(video, {
    frameRate,
    loop: true,
    onSettled: playWhenReady,
  });

  const clearResumeTimer = () => {
    if (resumeTimer === null) return;
    window.clearTimeout(resumeTimer);
    resumeTimer = null;
  };

  const scheduleResume = () => {
    clearResumeTimer();
    resumeTimer = window.setTimeout(() => {
      resumeTimer = null;
      wantsPlayback = true;
      playWhenReady();
    }, resumeDelayMs);
  };

  const applyPendingDelta = () => {
    if (!hasDuration(video) || pendingProgressDelta === 0) return;

    if (!scrubbing) {
      desiredTime = video.currentTime;
      scrubbing = true;
    }

    desiredTime = wrap(
      desiredTime + pendingProgressDelta * video.duration,
      video.duration
    );
    pendingProgressDelta = 0;
    seeker.seek(desiredTime);
  };

  const onMetadata = () => {
    applyPendingDelta();
    playWhenReady();
  };
  video.addEventListener("loadedmetadata", onMetadata);
  video.addEventListener("durationchange", onMetadata);

  return {
    setActive(nextActive: boolean) {
      active = nextActive;

      if (!active) {
        playbackGeneration += 1;
        clearResumeTimer();
        wantsPlayback = false;
        scrubbing = false;
        pendingProgressDelta = 0;
        seeker.clear();
        video.pause();
        return;
      }

      wantsPlayback = true;
      playWhenReady();
    },
    scrubByProgress(delta: number) {
      if (!active || !Number.isFinite(delta) || Math.abs(delta) < 0.00001) {
        return;
      }

      clearResumeTimer();
      playbackGeneration += 1;
      wantsPlayback = false;
      video.pause();
      pendingProgressDelta += delta;
      applyPendingDelta();
      scheduleResume();
    },
    destroy() {
      disposed = true;
      playbackGeneration += 1;
      clearResumeTimer();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("durationchange", onMetadata);
      seeker.destroy();
      video.pause();
    },
  };
}

export function createAbsoluteVideoScrubber(
  video: HTMLVideoElement,
  { frameRate = 24 }: { frameRate?: number } = {}
) {
  const seeker = createQueuedVideoSeeker(video, { frameRate });

  video.pause();

  return {
    scrubToProgress(progress: number) {
      video.pause();
      seeker.seekToProgress(progress);
    },
    destroy() {
      seeker.destroy();
      video.pause();
    },
  };
}
