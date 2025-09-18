import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelCard } from "@/components/ui/pixel-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend authentication
    console.log(`${mode} attempt:`, formData);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <PixelCard className="border-0 shadow-none">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-pixel text-lg text-center text-foreground">
              {mode === "login" ? "Welcome Back!" : "Join the Quest!"}
            </DialogTitle>
            <DialogDescription className="font-pixel text-xs text-center text-muted-foreground">
              {mode === "login" 
                ? "Sign in to continue your environmental adventure" 
                : "Create your account to start saving the planet"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="font-pixel text-xs text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="font-pixel text-xs"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-pixel text-xs text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="font-pixel text-xs"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-pixel text-xs text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="font-pixel text-xs"
                required
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-pixel text-xs text-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="font-pixel text-xs"
                  required
                />
              </div>

            )}
            <div className="flex flex-col space-y-3 pt-4">
              <PixelButton type="submit" variant="primary" className="w-full">
                {mode === "login" ? "Sign In" : "Create Account"}
              </PixelButton>
              <PixelButton 

                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Need an account? Sign Up" : "Already have an account? Sign In"}
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </DialogContent>
    </Dialog>

  );

};
export { AuthModal };
