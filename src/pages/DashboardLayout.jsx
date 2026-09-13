import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, FileAudio, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100">
      {/* Light Glassmorphic Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10">
        <div className="h-24 flex items-center px-8 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-600/20">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <div>
            <span className="block font-bold text-lg text-slate-800 tracking-tight leading-tight">Voicify</span>
            <span className="block text-xs font-semibold text-blue-600 uppercase tracking-wider">Clinical</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </NavLink>
          
          <NavLink 
            to="/dictation/new" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <FileAudio size={20} />
            <span>New Dictation</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-slate-500 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/30 blur-[100px] rounded-full -z-10 translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="p-10 animate-fade-in max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
