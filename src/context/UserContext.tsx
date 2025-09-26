import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of our user data and the context
interface User {
  username: string;
  ecoPoints: number;
}

interface UserContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  addEcoPoints: (points: number) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component to wrap our app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('ecoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (username: string) => {
    // Check if the user already exists, if not, create a new one
    const storedUser = localStorage.getItem('ecoUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    } else {
        const newUser = { username, ecoPoints: 0 };
        localStorage.setItem('ecoUser', JSON.stringify(newUser));
        setUser(newUser);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('ecoUser');
    setUser(null);
  };

  // Function to add eco points
  const addEcoPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, ecoPoints: user.ecoPoints + points };
      setUser(updatedUser);
      localStorage.setItem('ecoUser', JSON.stringify(updatedUser));
      // Here you could trigger a notification
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, addEcoPoints }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};