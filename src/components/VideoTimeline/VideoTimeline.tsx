import React, { useState, useRef, useEffect, useCallback } from "react";
import "./VideoTimeline.css";

interface TimelineClip {
  id: string;
  trackId: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  name: string;
  type: "video" | "audio" | "text";
  color?: string;
  canvasId?: number; // Link to canvas
}

interface TimelineTrack {
  id: string;
  name: string;
  type: "video" | "audio" | "text";
  height: number;
  clips: TimelineClip[];
}

interface Canvas {
  id: number;
  content: string;
  color?: string;
  gradient?: any;
  elements?: any[];
}

interface VideoTimelineProps {
  duration?: number; // Total timeline duration in seconds
  currentTime?: number;
  canvases?: Canvas[];
  activeCanvasId?: number;
  onTimeChange?: (time: number) => void;
  onClipSelect?: (clip: TimelineClip | null) => void;
  onClipUpdate?: (clip: TimelineClip) => void;
  onClipDelete?: (clipId: string) => void;
  onCanvasSelect?: (canvasId: number) => void;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({
  duration = 60,
  currentTime = 0,
  canvases = [],
  activeCanvasId,
  onTimeChange,
  onClipSelect,
  onClipUpdate,
  onClipDelete,
  onCanvasSelect,
}) => {
  // Convert canvases to timeline clips
  const canvasesToClips = (canvases: Canvas[]): TimelineClip[] => {
    const clipDuration = Math.max(5, duration / Math.max(canvases.length, 1)); // Minimum 5 seconds per clip
    return canvases.map((canvas, index) => ({
      id: `canvas-${canvas.id}`,
      trackId: "video-1",
      startTime: index * clipDuration,
      duration: clipDuration,
      name: `Scene ${canvas.id}`,
      type: "video" as const,
      color: canvas.color || "#0969da",
      canvasId: canvas.id,
    }));
  };

  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: "video-1",
      name: "Video Track",
      type: "video",
      height: 80,
      clips: canvasesToClips(canvases),
    },
    {
      id: "audio-1",
      name: "Audio Track",
      type: "audio",
      height: 40,
      clips: [],
    },
    {
      id: "text-1",
      name: "Text Track",
      type: "text",
      height: 40,
      clips: [],
    },
  ]);

  const [selectedClip, setSelectedClip] = useState<TimelineClip | null>(null);
  const [zoom, setZoom] = useState(1);
  const [playheadTime, setPlayheadTime] = useState(currentTime);
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<{
    clipId: string;
    offset: number;
    isResizing: boolean;
    resizeDirection?: "left" | "right";
  } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Constants
  const PIXELS_PER_SECOND = 20 * zoom;
  const SNAP_THRESHOLD = 10;
  const TIMELINE_WIDTH = duration * PIXELS_PER_SECOND;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert time to pixels
  const timeToPixels = (time: number): number => time * PIXELS_PER_SECOND;

  // Convert pixels to time
  const pixelsToTime = (pixels: number): number => pixels / PIXELS_PER_SECOND;

  // Snap time to grid
  const snapToGrid = (time: number): number => {
    const snapInterval = 1; // 1 second snap
    return Math.round(time / snapInterval) * snapInterval;
  };

  // Handle playhead click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || isDragging) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = pixelsToTime(x);
    const snappedTime = snapToGrid(Math.max(0, Math.min(time, duration)));

    setPlayheadTime(snappedTime);
    onTimeChange?.(snappedTime);
  };

  // Handle clip selection
  const handleClipClick = (clip: TimelineClip, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClip(clip);
    onClipSelect?.(clip);

    // If this clip represents a canvas, select that canvas
    if (clip.canvasId && onCanvasSelect) {
      onCanvasSelect(clip.canvasId);
    }
  };

  // Handle clip drag start
  const handleClipDragStart = (clip: TimelineClip, e: React.MouseEvent) => {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clipElement = e.currentTarget as HTMLElement;
    const clipRect = clipElement.getBoundingClientRect();
    const offset = e.clientX - clipRect.left;

    setIsDragging(true);
    setDragData({
      clipId: clip.id,
      offset,
      isResizing: false,
    });
  };

  // Handle resize start
  const handleResizeStart = (
    clip: TimelineClip,
    direction: "left" | "right",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragData({
      clipId: clip.id,
      offset: 0,
      isResizing: true,
      resizeDirection: direction,
    });
  };

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragData || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      const updatedTracks = tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id !== dragData.clipId) return clip;

          if (dragData.isResizing) {
            const newClip = { ...clip };
            if (dragData.resizeDirection === "left") {
              const newStartTime = snapToGrid(Math.max(0, pixelsToTime(x)));
              const maxStartTime = clip.startTime + clip.duration - 0.5;
              newClip.startTime = Math.min(newStartTime, maxStartTime);
              newClip.duration = clip.startTime + clip.duration - newClip.startTime;
            } else {
              const newEndTime = snapToGrid(Math.max(clip.startTime + 0.5, pixelsToTime(x)));
              newClip.duration = Math.min(newEndTime - clip.startTime, duration - clip.startTime);
            }
            return newClip;
          } else {
            // Dragging
            const newStartTime = snapToGrid(Math.max(0, pixelsToTime(x - dragData.offset)));
            const maxStartTime = duration - clip.duration;
            return {
              ...clip,
              startTime: Math.min(newStartTime, maxStartTime),
            };
          }
        }),
      }));

      setTracks(updatedTracks);
    },
    [isDragging, dragData, tracks, duration, PIXELS_PER_SECOND]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging && dragData) {
      const updatedClip = tracks
        .flatMap(track => track.clips)
        .find(clip => clip.id === dragData.clipId);

      if (updatedClip) {
        onClipUpdate?.(updatedClip);
      }
    }

    setIsDragging(false);
    setDragData(null);
  }, [isDragging, dragData, tracks, onClipUpdate]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedClip) {
          // Only allow deletion of non-canvas clips (audio, text)
          if (!selectedClip.canvasId) {
            setTracks(
              tracks.map(track => ({
                ...track,
                clips: track.clips.filter(clip => clip.id !== selectedClip.id),
              }))
            );
            onClipDelete?.(selectedClip.id);
          }
          setSelectedClip(null);
        }
      }
    },
    [selectedClip, tracks, onClipDelete]
  );

  // Zoom functions
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.25));

  // Setup event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseMove, handleMouseUp, handleKeyDown]);

  // Update playhead when currentTime prop changes
  useEffect(() => {
    setPlayheadTime(currentTime);
  }, [currentTime]);

  // Update tracks when canvases change
  useEffect(() => {
    setTracks(prevTracks => [
      {
        ...prevTracks[0],
        clips: canvasesToClips(canvases),
      },
      ...prevTracks.slice(1),
    ]);
  }, [canvases, duration]);

  return (
    <div className="video-timeline">
      {/* Timeline Header */}
      <div className="timeline-header">
        <div className="header-left">
          <div className="timeline-controls">
            <button onClick={handleZoomOut} className="zoom-btn">
              −
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="zoom-btn">
              +
            </button>
          </div>
        </div>
        <div className="header-right">
          {/* Time Ruler */}
          <div className="time-ruler-header" style={{ width: TIMELINE_WIDTH }}>
            {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => (
              <div key={i} className="time-marker-header" style={{ left: timeToPixels(i) }}>
                <div className="time-tick-header" />
                <div className="time-label-header">{formatTime(i)}</div>
              </div>
            ))}
          </div>
          <div className="timeline-time">
            {formatTime(playheadTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      <div className="timeline-container">
        {/* Track Labels */}
        {/* <div className="track-labels">
          {tracks.map(track => (
            <div key={track.id} className="track-label" style={{ height: track.height }}>
              <span className="track-name">{track.name}</span>
              <div className="track-type-indicator" data-type={track.type} />
            </div>
          ))}
        </div> */}

        {/* Timeline Content */}
        <div className="timeline-content" ref={timelineRef} onClick={handleTimelineClick}>
          {/* Tracks */}
          <div className="tracks-container">
            {tracks.map(track => (
              <div
                key={track.id}
                className="track"
                data-track-id={track.id}
                style={{ height: track.height }}
              >
                {/* Track Background */}
                <div className="track-background" style={{ width: TIMELINE_WIDTH }} />

                {/* Clips */}
                {track.clips.map(clip => (
                  <div
                    key={clip.id}
                    className={`timeline-clip ${
                      selectedClip?.id === clip.id || clip.canvasId === activeCanvasId
                        ? "selected"
                        : ""
                    }`}
                    data-type={clip.type}
                    style={{
                      left: timeToPixels(clip.startTime),
                      width: timeToPixels(clip.duration),
                    }}
                    onClick={e => handleClipClick(clip, e)}
                    onMouseDown={e => handleClipDragStart(clip, e)}
                  >
                    <div className="clip-content">
                      {clip.type === "video" && (
                        <div className="clip-thumbnail">{clip.canvasId || "🎬"}</div>
                      )}
                      <span className="clip-name">{clip.name}</span>
                    </div>

                    {/* Resize Handles */}
                    <div
                      className="resize-handle left"
                      onMouseDown={e => handleResizeStart(clip, "left", e)}
                    />
                    <div
                      className="resize-handle right"
                      onMouseDown={e => handleResizeStart(clip, "right", e)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div className="playhead" style={{ left: timeToPixels(playheadTime) }}>
            <div className="playhead-line" />
            <div className="playhead-handle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTimeline;
