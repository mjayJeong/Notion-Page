'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const [fieldErrors, setFieldErrors] = useState({ email: '', username: '' });
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password);

  const handleAuth = async () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({ email: '', username: '' });

    if (!email || !password || (!isLogin && !username) || (!isLogin && !confirmPassword)) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isLogin && !validatePassword(password)) {
      setError('Password must include at least one uppercase letter and one special character');
      return;
    }

    const action = isLogin ? 'login' : 'signup';
    const body = isLogin
      ? { email, password, action }
      : { email, password, username, action };

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error.includes('Email')) {
          setFieldErrors((prev) => ({ ...prev, email: errorData.error }));
        } else if (errorData.error.includes('Username')) {
          setFieldErrors((prev) => ({ ...prev, username: errorData.error }));
        } else {
          setError(errorData.error);
        }
        return;
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        router.push('/notes');
      } else {
        setIsLogin(true);
        setSuccess('Sign up successful! Please log in.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
      }
    } catch (err) {
      console.error('Something went wrong:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null); 
    setFieldErrors({ email: '', username: '' });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <img src="/notion.png" alt="Notion Icon" className="mr-2" width={30} height={30} />
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {success && <div className="text-green-500 mb-4">{success}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded w-full py-2 px-3 mb-1"
            />
            {fieldErrors.username && <div className="text-red-500 mb-3">{fieldErrors.username}</div>}
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full py-2 px-3 mb-1"
        />
        {fieldErrors.email && <div className="text-red-500 mb-3">{fieldErrors.email}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full py-2 px-3 mb-3"
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 mb-3"
          />
        )}
        <button
          onClick={handleAuth}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full mb-3"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="text-center">
          {isLogin ? 'Need an account?' : 'Already have an account?'}
          <button
            onClick={handleToggleAuth}
            className="text-blue-500 ml-2"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
