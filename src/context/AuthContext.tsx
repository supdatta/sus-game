import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Defines the structure for a user object
interface User {
  username: string;
  ecoPoints: number;
}

// Defines the functions and data that the context will provide
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string, isSignUp?: boolean) => boolean;
  logout: () => void;
  addEcoPoints: (points: number, reason: string) => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | null>(null);

// This component will wrap the entire app, providing auth data to all children
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // On initial app load, check localStorage for a logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('ecoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, pass: string, isSignUp: boolean = false): boolean => {
    let userData: User | null = null;
    // Retrieve our simple user 'database' from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('ecoUsersDatabase') || '{}');

    // Handle the special admin login case
    if (username === 'admin@1234' && pass === '1234' && !isSignUp) {
        userData = storedUsers[username] || { username, ecoPoints: 0 };
    } else if (username === 'admin@1234') {
        toast({ variant: "destructive", title: "Admin Account", description: "This username is reserved and cannot be used for sign-up." });
        return false;
    } else { // Handle regular user login and sign-up
        if (isSignUp) {
            if (storedUsers[username]) {
                toast({ variant: "destructive", title: "User Already Exists", description: "Please log in with your credentials." });
                return false;
            }
            userData = { username, ecoPoints: 0 };
            storedUsers[username] = userData;
        } else {
            userData = storedUsers[username] || null;
            if (!userData) {
                 toast({ variant: "destructive", title: "Login Failed", description: "User not found. Please sign up first." });
                 return false;
            }
        }
    }
    
    // Save the updated user database and the current user's session
    localStorage.setItem('ecoUsersDatabase', JSON.stringify(storedUsers));
    localStorage.setItem('ecoUser', JSON.stringify(userData));
    setUser(userData);
    toast({ title: "Success!", description: `Welcome, ${username}!` });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('ecoUser');
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const addEcoPoints = (points: number, reason: string) => {
    if (user) {
      const updatedUser = { ...user, ecoPoints: (user.ecoPoints || 0) + points };
      setUser(updatedUser);
      // Update the user's session data
      localStorage.setItem('ecoUser', JSON.stringify(updatedUser));
      
      // Update the user's data in our 'database'
      const storedUsers = JSON.parse(localStorage.getItem('ecoUsersDatabase') || '{}');
      storedUsers[user.username] = updatedUser;
      localStorage.setItem('ecoUsersDatabase', JSON.stringify(storedUsers));

      // Broadcast an earn event for global UI (character banner etc.)
      if (points > 0 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ecoPointsEarned', { detail: { points, reason } }));
      }

      // Suppressed default toast to avoid duplicate notifications. PointsBanner will display the message.
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, addEcoPoints }}>
      {children}
    </AuthContext.Provider>
  );
};