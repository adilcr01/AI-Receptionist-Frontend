import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { Users, UserCheck, UserX, Activity, Database, Server } from 'lucide-react';

export default function AdminOverview() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const res = await axiosClient.get('admin/users/');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-slate-400 font-medium">Loading statistics...</div>;

  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter(u => u.is_verified).length || 0;
  const pendingUsers = users?.filter(u => !u.is_verified).length || 0;
  const doctors = users?.filter(u => u.role === 'doctor').length || 0;
  const admins = users?.filter(u => u.role === 'admin').length || 0;

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-indigo-600/20 p-2.5 rounded-xl">
          <Activity size={28} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Platform Overview</h1>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
          <div className="bg-blue-50 p-4 rounded-full mr-5">
            <Users size={32} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-4xl font-extrabold text-slate-800">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
          <div className="bg-green-50 p-4 rounded-full mr-5">
            <UserCheck size={32} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Verified</p>
            <p className="text-4xl font-extrabold text-slate-800">{verifiedUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center">
          <div className="bg-yellow-50 p-4 rounded-full mr-5">
            <UserX size={32} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Pending Approval</p>
            <p className="text-4xl font-extrabold text-slate-800">{pendingUsers}</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Database size={20} className="text-indigo-500 mr-2" /> User Demographics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-600">Doctors</span>
              <span className="font-bold text-slate-900 text-lg">{doctors}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-600">Administrators</span>
              <span className="font-bold text-slate-900 text-lg">{admins}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Server size={20} className="text-indigo-500 mr-2" /> System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-700">API Gateway Online</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-700">Database Cluster Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
