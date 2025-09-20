import React, { useState, useRef, useEffect } from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, CheckCircle, XCircle } from "lucide-react";

const EcoScanPage: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);
  const [useGeminiApi, setUseGeminiApi] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // New state for objectives
  const [scannedItemsCount, setScannedItemsCount] = useState(0);
  const [highestSustainabilityScore, setHighestSustainabilityScore] = useState(0);
  const [objectiveScan3Items, setObjectiveScan3Items] = useState(false);
  const [objectiveScan80Plus, setObjectiveScan80Plus] = useState(false);
  const [objectiveScan90Plus, setObjectiveScan90Plus] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCapturedImage(null);
      setResults(null);
      setError(null);
    } catch (err) {
      setError(
        "Camera access denied. Please allow camera permissions and try again."
      );
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) {
      setError("Please capture an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const base64Data = capturedImage.split(",")[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");

      const apiUrl = useGeminiApi
        ? `https://game-ecoscan.onrender.com/analyze-gemini`
        : `https://game-ecoscan.onrender.com/analyze`;

      if (useGeminiApi) {
        if (!geminiApiKey) {
          setError("Please enter a Gemini API Key.");
          setLoading(false);
          return;
        }
        formData.append("api_key", geminiApiKey);
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown API error", details: response.statusText }));
        console.error("API Error Response:", errorData);
        throw new Error(
          `API request failed: ${errorData.error || response.statusText}. Details: ${errorData.details || 'N/A'}`
        );
      }

      const data = await response.json();
      setResults(data);

      // Update objectives based on analysis results
      setScannedItemsCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 3) setObjectiveScan3Items(true);
        return newCount;
      });
      const currentScore = parseInt(data.environmental_score);
      setHighestSustainabilityScore((prevScore) => {
        const newScore = Math.max(prevScore, currentScore);
        if (newScore >= 80) setObjectiveScan80Plus(true);
        if (newScore >= 90) setObjectiveScan90Plus(true);
        return newScore;
      });

    } catch (err: any) {
      console.error("Analysis caught error:", err);
      setError(`Analysis failed: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    stopCamera();
    setCapturedImage(null);
    setResults(null);
    setError(null);
    setLoading(false);
    // Do NOT reset objectives here, as they should persist across scans
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-lime-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const ObjectiveItem: React.FC<{ text: string; completed: boolean }> = ({ text, completed }) => (
    <li className={`flex items-center mb-2 p-2 rounded-md border-2 ${completed ? 'border-green-500 bg-green-50/20' : 'border-red-500 bg-red-50/20'} shadow-pixel-sm`} style={{imageRendering: 'pixelated'}}>
      {completed ? <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />}
      <span className={`font-pixel text-sm ${completed ? 'text-green-700' : 'text-red-700'}`}>{text}</span>
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-pixel text-2xl md:text-4xl text-foreground mb-6 text-center">
        🌱 EcoScan
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto justify-center">
        {/* Main Scanner Panel */}
        <PixelCard className="relative overflow-hidden flex-grow">
          <div className="flex flex-col items-center justify-center p-6 bg-muted border-4 border-border shadow-pixel-sm">
            {/* Scanner and Menu Button */}
            <div className="relative w-full max-w-2xl aspect-[4/3] mb-6">
              {/* Eco-scanner image box with retro pixel-art styling - adjusted for image aspect ratio */}
              <div className="w-full h-full border-4 border-green-600 bg-amber-50/80 relative overflow-hidden" style={{imageRendering: 'pixelated'}}>
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
                
                {/* Camera/Captured Image Display */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {capturedImage ? (
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <video ref={videoRef} autoPlay className="max-w-full max-h-full object-contain"></video>
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {/* Eco image overlay with pixel art styling */}
                    {!capturedImage && ( // Only show overlay if no image is captured
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
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Button for Gemini API Toggle (now a Sheet) */}
              <div className="absolute top-2 right-2 z-10">
                <Sheet>
                  <SheetTrigger asChild>
                    <PixelButton variant="secondary" size="sm" className="p-2">
                      <Settings className="h-4 w-4" />
                    </PixelButton>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-xs p-4 bg-muted border-l-4 border-border shadow-pixel-sm">
                    <SheetHeader>
                      <SheetTitle className="font-pixel text-foreground mb-2">API Settings</SheetTitle>
                      <SheetDescription className="text-muted-foreground">
                        Configure your API preferences.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="gemini-api-mode" className="font-pixel text-muted-foreground cursor-pointer">Use Gemini API</Label>
                        <Switch
                          id="gemini-api-mode"
                          checked={useGeminiApi}
                          onCheckedChange={setUseGeminiApi}
                        />
                      </div>
                      {useGeminiApi && (
                        <div className="w-full">
                          <Label htmlFor="gemini-api-key" className="sr-only">Gemini API Key</Label>
                          <input
                            id="gemini-api-key"
                            type="text"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            placeholder="Enter Gemini API Key"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Controls */}
            <div className="controls text-center space-x-2 mb-4">
              {!stream && !capturedImage && (
                <PixelButton onClick={startCamera} size="lg" variant="secondary" className="relative overflow-hidden group">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 mr-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{imageRendering: 'pixelated'}}>
                      <rect x="2" y="4" width="12" height="8" fill="currentColor" />
                      <rect x="4" y="2" width="8" height="2" fill="currentColor" />
                      <rect x="7" y="6" width="2" height="2" fill="#fff" />
                      <rect x="5" y="6" width="2" height="2" fill="#fff" />
                      <rect x="9" y="6" width="2" height="2" fill="#fff" />
                    </svg>
                  </div>
                  <span className="ml-6">START CAMERA</span>
                </PixelButton>
              )}
              {stream && (
                <PixelButton onClick={captureImage} variant="secondary">
                  📸 Capture
                </PixelButton>
              )}
              {capturedImage && !results && (
                <>
                  <PixelButton onClick={analyzeImage} disabled={loading}>
                    🔍 Analyze
                  </PixelButton>
                  <PixelButton onClick={reset} variant="secondary">
                    🔄 Scan Again
                  </PixelButton>
                </>
              )}
              {results && (
                <PixelButton onClick={reset} variant="secondary">
                  🔄 Scan Again
                </PixelButton>
              )}
            </div>

            {loading && (
              <div className="text-center">
                <div className="spinner mx-auto">
                  <Progress value={100} />
                </div>
                <p>Analyzing your object for environmental impact...</p>
              </div>
            )}

            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          </div>
        </PixelCard>

        {/* Objectives Panel */}
        <PixelCard className="flex-none w-full lg:w-80 p-6 bg-muted border-4 border-border shadow-pixel-sm">
          <h2 className="font-pixel text-xl text-foreground mb-4 text-center">Objectives</h2>
          <ul className="space-y-3">
            <ObjectiveItem text="Scan an item with sustainability 80+" completed={highestSustainabilityScore >= 80} />
            <ObjectiveItem text="Scan an item with sustainability 90+" completed={highestSustainabilityScore >= 90} />
            <ObjectiveItem text="Scan 3 items" completed={scannedItemsCount >= 3} />
          </ul>
          <p className="text-muted-foreground font-pixel text-sm mt-4 text-center">
            Scanned: {scannedItemsCount} items
          </p>
        </PixelCard>
      </div>

      {results && (
        <div className="results mt-8">
          <PixelCard className="mb-6 p-6 text-center bg-amber-50/80 border-4 border-border shadow-pixel-sm">
            <div
              className={`score-circle w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold ${getScoreColor(
                results.environmental_score
              )} border-4 border-border shadow-pixel-sm`}
              style={{imageRendering: 'pixelated'}}
            >
              {results.environmental_score}
            </div>
            <h2 className="font-pixel text-2xl mt-4 text-foreground">
              {results.object_name}
            </h2>
            <p className="text-muted-foreground">
              {results.score_description}
            </p>
          </PixelCard>

          <div className="grid md:grid-cols-2 gap-6">
            <PixelCard className="p-6 border-l-4 border-green-600 shadow-pixel-sm bg-blue-50/80 border-4 border-border">
              <h3 className="font-pixel text-xl text-foreground mb-4">♻️ Sustainable Qualities</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {results.sustainable_qualities?.map((item: string, index: number) => (
                  <li key={index} className="mb-2">{item}</li>
                )) || <li>No data available.</li>}
              </ul>
            </PixelCard>
            <PixelCard className="p-6 border-l-4 border-blue-600 shadow-pixel-sm bg-orange-50/80 border-4 border-border">
              <h3 className="font-pixel text-xl text-foreground mb-4">🌿 Better Alternatives</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {results.better_alternatives?.map((item: string, index: number) => (
                  <li key={index} className="mb-2">{item}</li>
                )) || <li>No data available.</li>}
              </ul>
            </PixelCard>
            <PixelCard className="p-6 border-l-4 border-green-600 shadow-pixel-sm bg-green-50/80 border-4 border-border">
              <h3 className="font-pixel text-xl text-foreground mb-4">✅ Pros</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {results.pros?.map((item: string, index: number) => (
                  <li key={index} className="mb-2">{item}</li>
                )) || <li>No data available.</li>}
              </ul>
            </PixelCard>
            <PixelCard className="p-6 border-l-4 border-red-600 shadow-pixel-sm bg-red-100/80 border-4 border-border">
              <h3 className="font-pixel text-xl text-foreground mb-4">❌ Cons</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {results.cons?.map((item: string, index: number) => (
                  <li key={index} className="mb-2">{item}</li>
                )) || <li>No data available.</li>}
              </ul>
            </PixelCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoScanPage;
