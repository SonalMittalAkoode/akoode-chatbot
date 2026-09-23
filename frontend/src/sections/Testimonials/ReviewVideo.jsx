"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import resolveImageUrl from "@/utils/resolveImageUrl";

export default function ReviewVideo({ video }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!video) return null;

  const videoThumbnail = video.image || video.videoThumbnail;
  const thumbnail = resolveImageUrl(videoThumbnail) || "/testimonials/video1.png";
  const embedCode = video.embedCode || video.embedcode || video.videoEmbedCode || "";
  const videoUrl = video.videoUrl || video.videoURL || video.url || "";

  const hasVideo = embedCode.trim() || videoUrl.trim();

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVideo) setIsModalOpen(true);
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget || e.target.closest("[data-close-modal]")) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const onEscape = (e) => e.key === "Escape" && setIsModalOpen(false);
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);
  
  return (
    <>
      {/* Desktop View: Thumbnail with overlay play button */}
      <div
        className="hidden sm:block relative rounded-xl overflow-hidden h-[300px] w-full group transition-transform hover:scale-[1.05] cursor-pointer"
        onClick={handlePlayClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handlePlayClick(e)}
      >
        <Image
          src={thumbnail}
          alt={video.title ? `Thumbnail for ${video.title} video review` : "Video testimonial thumbnail"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
          <button
            type="button"
            className="relative flex items-center justify-center group cursor-pointer"
            onClick={handlePlayClick}
            aria-label="Play video"
          >
            <div className="absolute w-10 h-10 bg-white/90 rounded-full animate-ping [animation-duration:1.5s]" aria-hidden />
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-white transition group-hover:scale-110 relative z-10 shadow-lg" aria-hidden>
              <Play className="text-[#7683C5]" size={24} fill="currentColor" />
            </div>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white font-medium truncate">{video.title}</p>
        </div>
      </div>

      {/* Mobile View: Square thumbnail image */}
      <div
        className="sm:hidden relative w-full h-40 rounded-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        onClick={handlePlayClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handlePlayClick(e)}
        aria-label={video.title ? `Play video: ${video.title}` : "Play video testimonial"}
      >
        <Image
          src={thumbnail}
          alt={video.title ? `Thumbnail for ${video.title} video review` : "Video testimonial thumbnail"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="text-[#7683C5]" size={22} fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      {/* Video popup modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label="Video testimonial"
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button
              type="button"
              data-close-modal
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            {embedCode.trim() ? (
              <div
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: embedCode }}
              />
            ) : videoUrl.trim() ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/70">
                No video source available.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
 