

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/context/AdminContext';

export default function LoginPage() {
  const { login, admin, loading, authChecked } = useAdminContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authChecked && admin) {
      router.replace('/admin/profile');
    }
  }, [admin, authChecked, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Only admin access');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authChecked) return null;

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Admin Login</h2>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="login-input"
          disabled={isSubmitting}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="login-input"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="login-button"
          disabled={isSubmitting || loading}
        >
          {(isSubmitting || loading) ? (
            <>
              <span className="spinner"></span> Authenticating...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}