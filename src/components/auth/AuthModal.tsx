import React, { useState, useContext } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PixelButton } from "../ui/pixel-button";
import { AuthContext } from "@/context/AuthContext"; // Import the context
import { useToast } from "../ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  
  const authContext = useContext(AuthContext);
  const { toast } = useToast();

  if (!authContext) {
    // This should ideally not happen if the provider is set up correctly
    return null;
  }
  const { login } = authContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When in sign-up view, pass isSignUp = true so a new user is created in browser memory
    const success = login(email, password, !isLoginView);
    if (success) {
      onClose(); // Close modal on successful login or sign-up
    } else {
      toast({
        variant: "destructive",
        title: isLoginView ? "Login Failed" : "Sign Up Failed",
        description: isLoginView
          ? "Invalid credentials. Please try again."
          : "Could not create account. Try a different username.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-4 border-border shadow-pixel-lg">
        <DialogHeader>
          <DialogTitle className="font-pixel text-2xl">{isLoginView ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogDescription className="font-pixel text-sm">
            {isLoginView ? 'Enter your credentials to access your eco-journey.' : 'Create an account to start saving the world!'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-pixel">Email</Label>
              <Input id="email" type="email" placeholder="admin@123" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-pixel">Password</Label>
              <Input id="password" type="password" placeholder="12345" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <PixelButton type="submit" className="w-full" variant="primary">
            {isLoginView ? 'Login' : 'Create Account'}
          </PixelButton>
        </form>
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="w-full mt-2 font-pixel text-xs text-center text-muted-foreground hover:text-foreground"
        >
          {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </DialogContent>
    </Dialog>
  );
};
