'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('sessionToken', data.sessionToken || '');
        localStorage.setItem('fullName', data.fullName || '');

        if (data.sessionId) {
          localStorage.setItem('sessionId', data.sessionId);
        }

        router.push('/');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setErrorMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <form onSubmit={handleLogin} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {errorMessage && (
            <div style={styles.errorMessage}>{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              backgroundColor: isLoading ? '#a0a0a0' : '#0070f3',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* New text and link below the form */}
        <p style={styles.signupText}>
          Don’t have an account?{' '}
          <a href="/signup" style={styles.signupLink}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: '20px',
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    padding: '40px 30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  errorMessage: {
    marginBottom: '20px',
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  signupText: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
  signupLink: {
    color: '#0070f3',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
