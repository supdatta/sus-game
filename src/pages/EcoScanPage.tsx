import React, { useState, useRef, useEffect } from "react";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Settings, CheckCircle, XCircle, Camera, ScanLine, BrainCircuit, Leaf, Recycle, ThumbsUp, ThumbsDown } from "lucide-react";
import shivanshImg from '../assets/Shivansh_Website_Wala.png';

// --- CHARACTER GUIDE COMPONENT ---
interface CharacterGuideProps {
  imageSrc: string;
  altText: string;
  message: string;
}
const CharacterGuide: React.FC<CharacterGuideProps> = ({ imageSrc, altText, message }) => (
  <div className="hidden lg:flex justify-center items-center gap-8 mt-12">
    <img src={imageSrc} alt={altText} className="h-80 w-auto object-contain" style={{ imageRendering: 'pixelated' }} />
    <div className="relative w-72">
      <PixelCard className="bg-card/90 backdrop-blur-sm">
        <p className="font-pixel text-xs text-foreground leading-relaxed">{message}</p>
      </PixelCard>
      <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-card"></div>
    </div>
  </div>
);

// --- NEW ECOSCAN LOGO COMPONENT (with darker brown color) ---
const EcoScanLogo = () => (
    <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="relative w-24 h-24 mb-4">
            <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
                {/* Magnifying Glass Handle - Made darker brown */}
                <path d="M26 28L20 22" stroke="#44392E" strokeWidth="2"/>
                <path d="M24 26L18 20" stroke="#44392E" strokeWidth="2"/>
                {/* Magnifying Glass Circle - Made darker brown */}
                <circle cx="14" cy="14" r="9" stroke="#44392E" strokeWidth="2" />
                {/* Leaf inside the glass (uses primary color, which is fine) */}
                <path d="M14 10V11H15V12H16V14H15V15H14V16H13V18H12V19H11V18H10V16H11V14H12V12H13V11H14Z" fill="hsl(var(--primary))" />
                <path d="M14 12H13V14H12V16H11V18H10" fill="hsl(var(--primary) / 0.5)" />
            </svg>
        </div>
        {/* Title text - Made darker brown */}
        <h1 className="font-pixel text-3xl md:text-4xl" style={{ color: '#44392E' }}>
            EcoScan
        </h1>
    </div>
);


const EcoScanPage: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);
  const [useGeminiApi, setUseGeminiApi] = useState(false);
  const [useServerGeminiKey, setUseServerGeminiKey] = useState(false);
  const [useVisionLlm, setUseVisionLlm] = useState(true);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scannedItemsCount, setScannedItemsCount] = useState(0);
  const [highestSustainabilityScore, setHighestSustainabilityScore] = useState(0);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setCapturedImage(null);
      setResults(null);
      setError(null);
    } catch (err) {
      setError("Camera access denied. Please allow permissions and try again.");
    }
  };
  const stopCamera = () => { if (stream) stream.getTracks().forEach(track => track.stop()); setStream(null); };
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };
  const analyzeImage = async () => {
    if (!capturedImage) { setError("Please capture an image first."); return; }
    setLoading(true);
    setError(null);
    setResults(null);
    let apiUrl = '';
    const formData = new FormData();
    try {
      const base64Data = capturedImage.split(",")[1];
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) { bytes[i] = binaryData.charCodeAt(i); }
      const blob = new Blob([bytes], { type: "image/jpeg" });
      formData.append("image", blob, "captured_image.jpg");
      if (useVisionLlm) apiUrl = `https://game-ecoscan.onrender.com/analyze`;
      else if (useServerGeminiKey) apiUrl = `https://game-ecoscan.onrender.com/analyze-server-key`;
      else if (useGeminiApi) {
        apiUrl = `https://game-ecoscan.onrender.com/analyze-gemini`;
        if (!geminiApiKey) { setError("Please enter a Gemini API Key in the settings."); setLoading(false); return; }
        formData.append("api_key", geminiApiKey);
      } else { setError("Please select an API option in the settings."); setLoading(false); return; }
      const response = await fetch(apiUrl, { method: "POST", body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown API error" }));
        throw new Error(errorData.error || response.statusText);
      }
      const data = await response.json();
      setResults(data);
      setScannedItemsCount(prev => prev + 1);
      const currentScore = parseInt(data.environmental_score);
      setHighestSustainabilityScore(prev => Math.max(prev, currentScore));
    } catch (err: any) {
      setError(`Analysis failed: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };
  const reset = () => { stopCamera(); setCapturedImage(null); setResults(null); setError(null); setLoading(false); };
  useEffect(() => { return () => stopCamera(); }, []);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-primary border-primary";
    if (score >= 40) return "bg-yellow-500 border-yellow-300";
    return "bg-destructive border-destructive";
  };

  const ObjectiveItem: React.FC<{ text: string; completed: boolean }> = ({ text, completed }) => (
    <li className={`flex items-center p-2 border-2 ${completed ? 'border-primary bg-primary/10' : 'border-border bg-muted/50'}`}>
      {completed ? <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />}
      <span className={`font-pixel text-xs ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>{text}</span>
    </li>
  );

  return (
    <>
      <style>{`
        @keyframes scan-line-anim { 0% { top: 0%; } 100% { top: 100%; } }
        .scan-line { animation: scan-line-anim 3s linear infinite; }
        @keyframes corner-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .scanner-corner { animation: corner-pulse 2s infinite; }
      `}</style>
      <div className="min-h-screen bg-background p-4 lg:p-8" style={{backgroundColor: "#F0D8C2"}}>
        <div className="container mx-auto max-w-6xl">
          <EcoScanLogo />
          
          <PixelCard className="w-full p-4 md:p-6 relative">
             <div className="absolute top-4 right-4 z-20">
               <Sheet>
                 <SheetTrigger asChild>
                   <PixelButton variant="secondary" size="sm" className="p-2">
                     <Settings className="h-4 w-4" />
                   </PixelButton>
                 </SheetTrigger>
                 <SheetContent side="right" className="w-full sm:max-w-xs p-4 bg-muted border-l-4 border-border shadow-pixel-sm">
                   <SheetHeader>
                     <SheetTitle className="font-pixel text-foreground mb-2">API Settings</SheetTitle>
                     <SheetDescription className="text-muted-foreground">Configure your API preferences.</SheetDescription>
                   </SheetHeader>
                   <div className="flex flex-col space-y-4 mt-4">
                     <div className="flex items-center justify-between"><Label htmlFor="vision-llm-mode" className="font-pixel text-muted-foreground cursor-pointer">Use Vision LLM</Label><Switch id="vision-llm-mode" checked={useVisionLlm} onCheckedChange={(c) => { setUseVisionLlm(c); if(c) { setUseGeminiApi(false); setUseServerGeminiKey(false); } }} /></div>
                     <div className="flex items-center justify-between"><Label htmlFor="gemini-api-mode" className="font-pixel text-muted-foreground cursor-pointer">Use Gemini API (Client Key)</Label><Switch id="gemini-api-mode" checked={useGeminiApi} onCheckedChange={(c) => { setUseGeminiApi(c); if(c) { setUseVisionLlm(false); setUseServerGeminiKey(false); } }} /></div>
                     {useGeminiApi && (<input id="gemini-api-key" type="text" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} placeholder="Enter Gemini API Key" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />)}
                     <div className="flex items-center justify-between"><Label htmlFor="server-gemini-key-mode" className="font-pixel text-muted-foreground cursor-pointer">Use Gemini API (Server Key)</Label><Switch id="server-gemini-key-mode" checked={useServerGeminiKey} onCheckedChange={(c) => { setUseServerGeminiKey(c); if(c) { setUseVisionLlm(false); setUseGeminiApi(false); } }} /></div>
                   </div>
                 </SheetContent>
               </Sheet>
             </div>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* --- LEFT COLUMN: SCANNER --- */}
              <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] bg-black border-2 border-border overflow-hidden">
                      {capturedImage ? (<img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />) : (<video ref={videoRef} autoPlay className="w-full h-full object-contain"></video>)}
                      <canvas ref={canvasRef} className="hidden"></canvas>
                      <div className="absolute inset-0 pointer-events-none">
                          <div className="scanner-corner absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                          <div className="scanner-corner absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                          <div className="scanner-corner absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                          <div className="scanner-corner absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                          {stream && <div className="scan-line absolute left-0 w-full h-1 bg-primary/50 shadow-[0_0_10px_theme(colors.primary)]"></div>}
                      </div>
                  </div>
                  <div className="w-full p-4 text-center space-y-2">
                      {!stream && !capturedImage && <PixelButton onClick={startCamera} size="lg" variant="primary" className="w-full flex items-center justify-center gap-2"><Camera/>Start Camera</PixelButton>}
                      {stream && <PixelButton onClick={captureImage} variant="secondary" size="lg" className="w-full flex items-center justify-center gap-2"><ScanLine/>Capture</PixelButton>}
                      {capturedImage && !results && (<div className="flex gap-2"><PixelButton onClick={analyzeImage} disabled={loading} size="lg" className="w-full flex items-center justify-center gap-2"><BrainCircuit/>Analyze</PixelButton><PixelButton onClick={reset} variant="outline" size="lg" className="w-full">Scan Again</PixelButton></div>)}
                      {results && <PixelButton onClick={reset} variant="outline" size="lg" className="w-full">Scan New Item</PixelButton>}
                      {loading && <Progress value={100} className="mt-4" />}
                      {error && <p className="font-pixel text-xs text-destructive mt-2">{error}</p>}
                  </div>
              </div>
              
              {/* --- RIGHT COLUMN: OBJECTIVES & RESULTS --- */}
              <div className="h-full">
                {results ? (
                  <div className="space-y-4">
                      <PixelCard className="text-center p-4">
                          <div className={`w-24 h-24 mx-auto flex items-center justify-center text-white text-3xl font-pixel border-4 ${getScoreColor(results.environmental_score)}`}>{results.environmental_score}</div>
                          <h2 className="font-pixel text-2xl mt-4 text-foreground">{results.object_name}</h2>
                          <p className="font-pixel text-xs text-muted-foreground mt-1">{results.score_description}</p>
                      </PixelCard>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PixelCard><h3 className="font-pixel text-base text-green-600 mb-2 flex items-center gap-2"><Leaf size={16}/>Sustainable Qualities</h3><ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">{results.sustainable_qualities?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}</ul></PixelCard>
                        <PixelCard><h3 className="font-pixel text-base text-blue-600 mb-2 flex items-center gap-2"><Recycle size={16}/>Better Alternatives</h3><ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">{results.better_alternatives?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}</ul></PixelCard>
                        <PixelCard><h3 className="font-pixel text-base text-green-600 mb-2 flex items-center gap-2"><ThumbsUp size={16}/>Pros</h3><ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">{results.pros?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}</ul></PixelCard>
                        <PixelCard><h3 className="font-pixel text-base text-red-600 mb-2 flex items-center gap-2"><ThumbsDown size={16}/>Cons</h3><ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">{results.cons?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}</ul></PixelCard>
                      </div>
                  </div>
                ) : (
                  <PixelCard className="h-full">
                    <h2 className="font-pixel text-xl text-foreground mb-4 text-center">Objectives</h2>
                    <ul className="space-y-2">
                      <ObjectiveItem text={`Scan an item with sustainability 80+ (Highest: ${highestSustainabilityScore})`} completed={highestSustainabilityScore >= 80} />
                      <ObjectiveItem text={`Scan an item with sustainability 90+ (Highest: ${highestSustainabilityScore})`} completed={highestSustainabilityScore >= 90} />
                      <ObjectiveItem text={`Scan ${scannedItemsCount}/3 items`} completed={scannedItemsCount >= 3} />
                    </ul>
                  </PixelCard>
                )}
              </div>
            </div>
          </PixelCard>
          
          <CharacterGuide
            imageSrc={shivanshImg}
            altText="Shivansh Character"
            message="Point your camera at an object to learn its eco-score! Complete the objectives to earn bonus points. I just scanned this bottle!!"
          />
        </div>
      </div>
    </>
  );
};

export default EcoScanPage;