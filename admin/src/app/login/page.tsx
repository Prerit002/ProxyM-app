"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('admin_token', data.access_token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-bold mb-6">ProxyM Admin</h2>
        
        {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
