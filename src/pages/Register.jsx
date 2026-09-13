import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Mic, CheckCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axiosClient.post('auth/register/', { 
        username, 
        email, 
        password, 
        organization_name: organization || 'Default Org' 
      });
      setSuccess(true);
    } catch (err) {
      if (err.response?.data) {
        const errorMessages = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join(' | ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100 animate-fade-in">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Request Sent!</h2>
          <p className="text-slate-600 mt-4 leading-relaxed">
            Your account has been created. For security purposes, it requires <strong>Admin Verification</strong> before you can log in.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <Link to="/login" className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#F8FAFC]">
        <div className="max-w-md w-full animate-fade-in">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
            <p className="text-slate-500 mt-2">Join Voicify to modernize your practice</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="dr_smith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                <input
                  type="text"
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  placeholder="Clinic Name"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-slate-500 text-sm">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="bg-white/10 p-4 rounded-2xl inline-block mb-6 backdrop-blur-md border border-white/20 shadow-2xl">
            <Mic size={48} className="text-blue-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            Elevate your clinical workflow.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join thousands of providers who save 2 hours a day using our voice-first platform.
          </p>
        </div>
      </div>
    </div>
  );
}
