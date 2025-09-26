import React, { useState, useRef, useEffect, useContext } from "react";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Settings, CheckCircle, XCircle, Camera, ScanLine, BrainCircuit, Leaf, Recycle, ThumbsUp, ThumbsDown } from "lucide-react";
import ShivanshWebsiteWala from '../assets/Shivansh_Website_Wala.png';
import { AuthContext } from "@/context/AuthContext"; // Correctly import AuthContext

// --- Loading Component ---
const LoadingScanner = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[50vh]">
        <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .loader-leaf { animation: spin 2s linear infinite; }
        `}</style>
        <Leaf className="h-16 w-16 text-primary loader-leaf mb-4" />
        <h2 className="font-pixel text-xl text-foreground">Initializing EcoScanner...</h2>
        <p className="font-pixel text-sm text-muted-foreground mt-2">Getting the camera ready for analysis!</p>
    </div>
);

// --- EcoScan Logo Component ---
const EcoScanLogo = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-4">
            <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
                <path d="M26 28L20 22" stroke="#44392E" strokeWidth="2"/><path d="M24 26L18 20" stroke="#44392E" strokeWidth="2"/><circle cx="14" cy="14" r="9" stroke="#44392E" strokeWidth="2" /><path d="M14 10V11H15V12H16V14H15V15H14V16H13V18H12V19H11V18H10V16H11V14H12V12H13V11H14Z" fill="hsl(var(--primary))" /><path d="M14 12H13V14H12V16H11V18H10" fill="hsl(var(--primary) / 0.5)" />
            </svg>
        </div>
        <h1 className="font-pixel text-3xl md:text-4xl" style={{ color: '#44392E' }}>EcoScan</h1>
    </div>
);

const EcoScanPage: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [isInitializing, setIsInitializing] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scannedItemsCount, setScannedItemsCount] = useState(0);
    const [highestSustainabilityScore, setHighestSustainabilityScore] = useState(0);
    const [recentScans, setRecentScans] = useState<any[]>([]);
    
    // Settings: LLM mode and Gemini API key
    type LLMModes = 'vision' | 'gemini_server' | 'gemini_user';
    const [llmMode, setLlmMode] = useState<LLMModes>('vision');
    const [geminiKey, setGeminiKey] = useState<string>('');
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
    }, []);
    
    // Load saved settings
    useEffect(() => {
    try {
    const savedMode = (localStorage.getItem('ecoScanLLMMode') as LLMModes) || 'vision';
    const savedKey = localStorage.getItem('ecoScanGeminiKey') || '';
    setLlmMode(savedMode);
    setGeminiKey(savedKey);
    } catch {}
    }, []);

    // Load recent scans history (last 10)
    useEffect(() => {
      try {
        const saved = JSON.parse(localStorage.getItem('ecoScan:history') || '[]');
        if (Array.isArray(saved)) setRecentScans(saved);
      } catch {}
    }, []);

    if (!authContext) return <LoadingScanner />; // Should not happen with correct setup
    const { user, addEcoPoints } = authContext;

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setCapturedImage(null); setResults(null); setError(null);
        } catch (err) { setError("Camera access denied. Please allow permissions and try again."); }
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
    setLoading(true); setError(null); setResults(null);
    const formData = new FormData();
    try {
    const blob = await (await fetch(capturedImage)).blob();
    formData.append("image", blob, "captured_image.jpg");
    
    const base64Data = capturedImage.split(',')[1];
    let data: any = null;
    
    if (llmMode === 'gemini_user') {
      if (!geminiKey) throw new Error('Gemini API key not set. Open Settings and add your API key.');
      formData.append("api_key", geminiKey);
      const response = await fetch('https://game-ecoscan.onrender.com/analyze-gemini', { method: 'POST', body: formData });
      if (!response.ok) throw new Error((await response.json()).error || 'Analysis failed');
      data = await response.json();
    } else {
      const endpoint = llmMode === 'gemini_server'
        ? 'https://game-ecoscan.onrender.com/analyze-server-key'
        : 'https://game-ecoscan.onrender.com/analyze';
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      if (!response.ok) throw new Error((await response.json()).error || 'Analysis failed');
      data = await response.json();
    }
    
    setResults(data);
    try { localStorage.setItem('ecoScan:lastScan', JSON.stringify({ data, at: Date.now() })); } catch {}
    // Update recent history (front insert, cap 10)
    try {
      const entry = {
        object_name: data.object_name,
        environmental_score: Number(data.environmental_score ?? 0),
        score_description: data.score_description,
        at: Date.now()
      };
      const updated = [entry, ...recentScans].slice(0, 10);
      setRecentScans(updated);
      localStorage.setItem('ecoScan:history', JSON.stringify(updated));
    } catch {}
    setScannedItemsCount(prev => prev + 1);

    // Each completed EcoScan mission grants 10 eco points
    addEcoPoints(10, "EcoScan mission completed");

    if (data.environmental_score) {
      const currentScore = parseInt(data.environmental_score);
      setHighestSustainabilityScore(prev => Math.max(prev, currentScore));
    }
    } catch (err: any) { setError(`Analysis failed: ${err.message}.`);
    } finally { setLoading(false); }
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
    
    if (isInitializing) {
        return <LoadingScanner />;
    }

    return (
        <>
            <style>{`@keyframes scan-line-anim{0%{top:0%}100%{top:100%}}.scan-line{animation:scan-line-anim 3s linear infinite}@keyframes corner-pulse{0%,100%{opacity:.5}50%{opacity:1}}.scanner-corner{animation:corner-pulse 2s infinite}`}</style>
            <div className="min-h-screen p-4 lg:p-8" style={{backgroundColor: "#F0D8C2"}}>
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-start mb-8 gap-4">
                        <div className="flex items-center gap-3">
                          <EcoScanLogo />
                                                  </div>
                        <div className="flex items-center gap-3">
                          {user && (
                              <PixelCard className="p-3 text-center">
                                  <p className="font-pixel text-sm text-muted-foreground">Your</p>
                                  <p className="font-pixel text-xl text-foreground">{user.ecoPoints}</p>
                                  <p className="font-pixel text-sm text-muted-foreground">Eco Points</p>
                              </PixelCard>
                          )}
                          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
                            <SheetTrigger asChild>
                              <PixelButton
                                variant="primary"
                                size="sm"
                                className="p-2 border-4 border-border shadow-pixel flex items-center justify-center"
                                aria-label="Settings"
                              >
                                <Settings className="h-4 w-4" />
                              </PixelButton>
                            </SheetTrigger>
                            <SheetContent className="bg-card border-4 border-border">
                              <SheetHeader>
                                <SheetTitle className="font-pixel">Scanner Settings</SheetTitle>
                                <SheetDescription className="font-pixel text-xs">
                                  Choose the backend and optionally set your Gemini API key (for user-side processing).
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-4 space-y-4">
                                <div>
                                  <label className="font-pixel text-xs block mb-2">Model Backend</label>
                                  <select
                                    className="w-full border-2 border-border bg-background p-2 font-pixel text-xs"
                                    value={llmMode}
                                    onChange={(e) => setLlmMode(e.target.value as LLMModes)}
                                  >
                                    <option value="vision">Vision LLM (Default)</option>
                                    <option value="gemini_server">Gemini (Server Side)</option>
                                    <option value="gemini_user">Gemini (User API Key)</option>
                                  </select>
                                </div>
                                {llmMode === 'gemini_user' && (
                                  <div>
                                    <label className="font-pixel text-xs block mb-2">Gemini API Key</label>
                                    <input
                                      type="password"
                                      value={geminiKey}
                                      placeholder="Enter your Gemini API key"
                                      onChange={(e) => setGeminiKey(e.target.value)}
                                      className="w-full border-2 border-border bg-background p-2 font-pixel text-xs"
                                    />
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <button
                                    className="border-2 border-border px-3 py-2 bg-muted font-pixel text-xs"
                                    onClick={() => {
                                      setLlmMode('vision');
                                      setGeminiKey('');
                                      localStorage.removeItem('ecoScanLLMMode');
                                      localStorage.removeItem('ecoScanGeminiKey');
                                      setSettingsOpen(false);
                                    }}
                                  >Reset</button>
                                  <button
                                    className="border-2 border-border px-3 py-2 bg-primary text-primary-foreground font-pixel text-xs"
                                    onClick={() => {
                                      localStorage.setItem('ecoScanLLMMode', llmMode);
                                      if (llmMode === 'gemini_user') {
                                        localStorage.setItem('ecoScanGeminiKey', geminiKey);
                                      } else {
                                        localStorage.removeItem('ecoScanGeminiKey');
                                      }
                                      setSettingsOpen(false);
                                    }}
                                  >Save</button>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                    </div>
                    
                    <PixelCard className="w-full p-4 md:p-6 relative">
                        <div className="grid lg:grid-cols-2 gap-6 items-start">
                            <div className="flex flex-col items-center">
                                <div className="relative w-full aspect-[4/3] bg-black border-2 border-border overflow-hidden">
                                    {capturedImage ? (<img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />) : (<video ref={videoRef} autoPlay className="w-full h-full object-contain"></video>)}
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="scanner-corner absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-primary"></div><div className="scanner-corner absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-primary"></div><div className="scanner-corner absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-primary"></div><div className="scanner-corner absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
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
                            
                            <div className="h-full">
                                {results ? (
                                    <div className="space-y-4">
                                        <PixelCard className="text-center p-4"><div className={`w-24 h-24 mx-auto flex items-center justify-center text-white text-3xl font-pixel border-4 ${getScoreColor(results.environmental_score)}`}>{results.environmental_score}</div><h2 className="font-pixel text-2xl mt-4 text-foreground">{results.object_name}</h2><p className="font-pixel text-xs text-muted-foreground mt-1">{results.score_description}</p></PixelCard>
                                                                            </div>
                                ) : ( <PixelCard className="h-full p-4"><h2 className="font-pixel text-xl text-foreground mb-4 text-center">Objectives</h2><ul className="space-y-2"><ObjectiveItem text={`Scan an item with sustainability 80+ (Highest: ${highestSustainabilityScore})`} completed={highestSustainabilityScore >= 80} /><ObjectiveItem text={`Scan an item with sustainability 90+ (Highest: ${highestSustainabilityScore})`} completed={highestSustainabilityScore >= 90} /><ObjectiveItem text={`Scan ${scannedItemsCount}/3 items`} completed={scannedItemsCount >= 3} /></ul></PixelCard> )}
                            </div>
                        </div>
                    </PixelCard>
                    
                    {results && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-none border-2 p-4 bg-green-500/5 border-green-500/30">
                          <h3 className="font-pixel text-base text-green-600 mb-2 flex items-center gap-2"><Leaf size={16}/>Sustainable Qualities</h3>
                          <ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">
                            {results.sustainable_qualities?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}
                          </ul>
                        </div>
                        <div className="rounded-none border-2 p-4 bg-blue-500/5 border-blue-500/30">
                          <h3 className="font-pixel text-base text-blue-600 mb-2 flex items-center gap-2"><Recycle size={16}/>Better Alternatives</h3>
                          <ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">
                            {results.better_alternatives?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}
                          </ul>
                        </div>
                        <div className="rounded-none border-2 p-4 bg-emerald-500/5 border-emerald-500/30">
                          <h3 className="font-pixel text-base text-emerald-600 mb-2 flex items-center gap-2"><ThumbsUp size={16}/>Pros</h3>
                          <ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">
                            {results.pros?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}
                          </ul>
                        </div>
                        <div className="rounded-none border-2 p-4 bg-red-500/5 border-red-500/30">
                          <h3 className="font-pixel text-base text-red-600 mb-2 flex items-center gap-2"><ThumbsDown size={16}/>Cons</h3>
                          <ul className="list-disc pl-5 font-pixel text-xs text-muted-foreground space-y-1">
                            {results.cons?.map((item: string, i: number) => <li key={i}>{item}</li>) || <li>N/A</li>}
                          </ul>
                        </div>
                      </div>
                    )}

                    {recentScans.length > 0 && (
                      <div className="mt-6">
                        <PixelCard className="p-4">
                          <h3 className="font-pixel text-lg text-foreground mb-3">Recent Scans (last 10)</h3>
                          <ul className="divide-y divide-border">
                            {recentScans.map((item, idx) => (
                              <li key={idx} className="py-2 flex items-start gap-3">
                                <div className={`w-10 h-10 flex items-center justify-center text-white text-sm font-pixel border-2 ${getScoreColor(item.environmental_score)}`}>
                                  {item.environmental_score}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-pixel text-sm text-foreground truncate">{item.object_name || 'Unknown item'}</p>
                                  <p className="font-pixel text-[10px] text-muted-foreground truncate">{item.score_description || '—'}</p>
                                </div>
                                <div className="font-pixel text-[10px] text-muted-foreground whitespace-nowrap">{new Date(item.at).toLocaleTimeString()}</div>
                              </li>
                            ))}
                          </ul>
                        </PixelCard>
                      </div>
                    )}
                    
                    {/* Character and Dialogue */}
                    <div className="flex items-end justify-center gap-4 mt-8">
                      <div className="flex flex-col items-center">
                        <img src={ShivanshWebsiteWala} alt="Shivansh Website Wala" className="w-80 h-80 md:w-70 md:h-70 pixelated" />
                                              </div>
                      <div className="relative p-4 rounded-lg shadow-lg max-w-xs font-pixel text-sm speech-bubble-left-pointer">
                        <p>"Point your camera at an object to learn its eco-score! Complete the objectives to earn bonus points. I just scanned this bottle!!"</p>
                      </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EcoScanPage;
