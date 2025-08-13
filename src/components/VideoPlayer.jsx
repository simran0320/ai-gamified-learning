// src/components/VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import { trackEvent } from "../lib/tracker";

/**
 * YouTube IFrame API wrapper that fires tracking events.
 * Props:
 *   videoId: string (YouTube ID)
 *   onSecondsWatched: (secs) => void (to award XP)
 */
export default function VideoPlayer({ videoId, onSecondsWatched }) {
  const playerRef = useRef(null);   // ref to the <div> container
  const ytPlayer = useRef(null);    // store the YT player instance
  const lastTime = useRef(0);       // track playtime deltas
  const intervalId = useRef(null);  // store interval for watch time ticks

  // Load the YouTube IFrame API if not present
  useEffect(() => {
    // If API already loaded globally, just init player
    if (window.YT && window.YT.Player) {
      create();
    } else {
      // Create script tag for YT API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      // When API ready, window.onYouTubeIframeAPIReady is called once
      window.onYouTubeIframeAPIReady = () => create();
    }

    // Clean up on unmount
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      if (ytPlayer.current && ytPlayer.current.destroy) ytPlayer.current.destroy();
    };

    // Create the player after API is loaded
    function create() {
      ytPlayer.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          // Minimal UI; we track ourselves
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange
        }
      });
    }

    // When player is ready, mark a page/video_view event
    async function handleReady() {
      await trackEvent("video_ready", { videoId });
    }

    // Map YT states to our tracker and compute watch time
    async function handleStateChange(e) {
      const YTState = window.YT.PlayerState; // {UNSTARTED:-1, ENDED:0, PLAYING:1, PAUSED:2, BUFFERING:3, CUED:5}
      const state = e.data;
      const currentTime = ytPlayer.current.getCurrentTime();

      if (state === YTState.PLAYING) {
        // Start ticking every second to accumulate watch time
        lastTime.current = currentTime;
        intervalId.current = setInterval(() => {
          try {
            const t = ytPlayer.current.getCurrentTime();
            const delta = Math.max(0, t - lastTime.current);
            lastTime.current = t;
            // Send watched seconds up for XP
            onSecondsWatched?.(delta);
          } catch {}
        }, 1000);
        await trackEvent("video_play", { videoId, currentTime });
      }

      if (state === YTState.PAUSED) {
        // Stop ticking
        if (intervalId.current) clearInterval(intervalId.current);
        await trackEvent("video_pause", { videoId, currentTime });
      }

      if (state === YTState.ENDED) {
        if (intervalId.current) clearInterval(intervalId.current);
        await trackEvent("video_complete", { videoId });
      }
    }
  }, [videoId, onSecondsWatched]);

  // Render the container div that YT replaces with an <iframe>
  return (
    <div className="rounded-2xl overflow-hidden shadow-soft">
      <div ref={playerRef} className="w-full aspect-video bg-black" />
    </div>
  );
}
