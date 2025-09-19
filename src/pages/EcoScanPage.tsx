import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";

// Using a placeholder for eco-scanner image
const ecoScannerImg = "/placeholder.svg";

const EcoScanPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-pixel text-2xl md:text-4xl text-foreground mb-6 text-center">
        Eco-Scanner
      </h1>
      
      <PixelCard className="relative overflow-hidden max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center p-6 bg-muted border-4 border-border shadow-pixel-sm">
          {/* Eco-scanner image box with retro pixel-art styling - adjusted for image aspect ratio */}
          <div className="w-full max-w-2xl aspect-[4/3] mb-6 border-4 border-green-600 bg-amber-50/80 relative overflow-hidden" style={{imageRendering: 'pixelated'}}>
            {/* Pixel art border elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-green-600/30"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-green-600/30"></div>
            <div className="absolute left-0 top-0 w-2 h-full bg-green-600/30"></div>
            <div className="absolute right-0 top-0 w-2 h-full bg-green-600/30"></div>
            
            {/* Corner pixels */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-green-600"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-600"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-600"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-600"></div>
            
            {/* Eco-scanner image - centered with balanced padding */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={ecoScannerImg} 
                  alt="Eco-Scanner" 
                  className="max-w-full max-h-full object-contain"
                />
                {/* Eco image overlay with pixel art styling */}
                <div className="absolute bottom-4 right-4 w-1/3 h-auto bg-green-100 rounded-md border-2 border-green-500 shadow-md overflow-hidden">
                  <div className="w-full h-full bg-green-200 p-2" style={{imageRendering: 'pixelated'}}>
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-8 h-8 bg-green-600 mb-1"></div>
                      <div className="flex">
                        <div className="w-4 h-4 bg-green-800"></div>
                        <div className="w-4 h-4 bg-green-400"></div>
                        <div className="w-4 h-4 bg-green-600"></div>
                      </div>
                      <span className="text-green-800 font-pixel text-xs mt-1">ECO IMAGE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scan with Camera button */}
          <PixelButton 
            size="lg"
            variant="secondary"
            className="relative overflow-hidden group"
          >
            {/* Camera icon */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 mr-2 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{imageRendering: 'pixelated'}}>
                <rect x="2" y="4" width="12" height="8" fill="currentColor" />
                <rect x="4" y="2" width="8" height="2" fill="currentColor" />
                <rect x="7" y="6" width="2" height="2" fill="#fff" />
                <rect x="5" y="6" width="2" height="2" fill="#fff" />
                <rect x="9" y="6" width="2" height="2" fill="#fff" />
              </svg>
            </div>
            <span className="ml-6">SCAN WITH CAMERA</span>
          </PixelButton>
          
          <p className="mt-6 text-sm text-center text-muted-foreground max-w-lg">
            Use the eco-scanner to identify plants and learn about their environmental impact. 
            Point your camera at any plant to get started!
          </p>
        </div>
      </PixelCard>
    </div>
  );
};

export default EcoScanPage;