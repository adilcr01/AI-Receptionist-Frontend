import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Users, Settings, Activity, ShieldCheck } from 'lucide-react';

export default function AdminLayout() {
  const adminLogout = useAuthStore((state) => state.adminLogout);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Dark Sidebar */}
      <div className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <ShieldCheck size={28} className="text-indigo-400 mr-3" />
          <span className="font-bold text-xl text-white tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</div>
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 'hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <Activity size={20} />
            <span>Dashboard</span>
          </NavLink>

          <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Management</div>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 'hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <Users size={20} />
            <span>Users</span>
          </NavLink>
          
          <NavLink 
            to="/admin/logs" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 'hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <Activity size={20} />
            <span>System Logs</span>
          </NavLink>

          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20' : 'hover:bg-slate-800 hover:text-slate-100'
              }`
            }
          >
            <Settings size={20} />
            <span>Global Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-slate-400 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-indigo-600/5 -z-10"></div>
        <div className="p-10 animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
