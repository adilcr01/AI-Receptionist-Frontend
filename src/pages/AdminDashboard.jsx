import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const role = useAuthStore((state) => state.role);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const res = await axiosClient.get('admin/users/');
      return res.data;
    },
    enabled: role === 'admin'
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, is_verified }) => {
      const res = await axiosClient.patch(`admin/users/${userId}/`, { is_verified });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin_users']);
    }
  });

  if (isLoading) return <div className="p-8 text-slate-400 font-medium">Loading users...</div>;

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-indigo-600/20 p-2.5 rounded-xl">
          <ShieldCheck size={28} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Console</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-800">{u.username}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{u.id.substring(0,8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize font-medium">
                  {u.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                    u.is_verified ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {u.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => updateMutation.mutate({ userId: u.id, is_verified: !u.is_verified })}
                      className={`flex items-center space-x-1.5 ml-auto px-4 py-2 rounded-xl text-white transition-all shadow-sm ${
                        u.is_verified ? 'bg-slate-800 hover:bg-slate-900' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                      }`}
                    >
                      {u.is_verified ? (
                        <><UserX size={16} /> <span>Revoke</span></>
                      ) : (
                        <><UserCheck size={16} /> <span>Verify</span></>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
