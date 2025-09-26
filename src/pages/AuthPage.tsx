import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { PixelCard } from '../components/ui/pixel-card';
import { PixelButton } from '../components/ui/pixel-button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin@123' && password === '12345') {
      login(username);
      navigate('/sus-game/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <PixelCard className="w-full max-w-sm p-6">
        <h2 className="font-pixel text-2xl text-center mb-4">Login</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@123"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345"
            />
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <PixelButton onClick={handleLogin} className="w-full">
            Login
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default AuthPage;