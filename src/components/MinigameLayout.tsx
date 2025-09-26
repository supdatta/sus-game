import React from "react";
import { Link } from "react-router-dom";
import { PixelButton } from "./ui/pixel-button";
import { ArrowLeft } from "lucide-react";

interface MinigameLayoutProps {
  children: React.ReactNode;
  gameTitle: string;
  gameSubtitle: string;
  videoSrc?: string;
}

export const MinigameLayout: React.FC<MinigameLayoutProps> = ({
  children,
  gameTitle,
  gameSubtitle,
  videoSrc,
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {videoSrc && (
        <>
          <video
            className="absolute left-0 top-0 h-full object-cover z-0 w-1/2"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
          <video
            className="absolute right-0 top-0 h-full object-cover z-0 w-1/2"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </>
      )}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <Link to="/quest" className="absolute left-4 top-4">
              <PixelButton className="flex items-center px-4 py-2">
                <ArrowLeft className="mr-2" size={20} /> RETURN TO QUESTS
              </PixelButton>
            </Link>
            <div className="flex-grow text-center">
              <h1 className="text-3xl font-bold">{gameTitle}</h1>
              <p className="text-lg">{gameSubtitle}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">{children}</div>
        </div>
      </div>
    </div>
  );
};