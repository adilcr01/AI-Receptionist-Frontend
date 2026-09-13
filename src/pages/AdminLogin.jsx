import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAdminAuth = useAuthStore((state) => state.setAdminAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosClient.post('auth/login/', { username, password });
      
      const payload = JSON.parse(atob(res.data.access.split('.')[1]));
      if (payload.role !== 'admin') {
        setError('This account does not have administrative privileges.');
        return;
      }

      setAdminAuth(res.data.access);
      navigate('/admin');
    } catch (err) {
      if (err.response?.data?.non_field_errors?.[0]) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans">
      <div className="w-full flex items-center justify-center p-8">
        <div className="max-w-md w-full animate-fade-in bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
              <ShieldCheck size={48} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
            <p className="text-slate-400 mt-2">Secure access for administrators</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all focus:ring-offset-slate-900"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
