import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/authStore';
import { Mic } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosClient.post('auth/login/', { username, password });
      setAuth({ username }, res.data.access);
      
      try {
        const payload = JSON.parse(atob(res.data.access.split('.')[1]));
        if (payload.role === 'admin') {
          setError('Admins must log in via the Admin Portal (/admin/login).');
          useAuthStore.getState().logout();
          return;
        }
        navigate('/');
      } catch (e) {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.non_field_errors?.[0]) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="bg-white/10 p-4 rounded-2xl inline-block mb-6 backdrop-blur-md border border-white/20 shadow-2xl">
            <Mic size={48} className="text-blue-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            The intelligent voice layer for modern clinical practices.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Automate phone calls, dictate clinical notes, and focus on patient care while Voicify handles the rest.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#F8FAFC]">
        <div className="max-w-md w-full animate-fade-in">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign in
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-slate-500 text-sm">Don't have an account? </span>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
