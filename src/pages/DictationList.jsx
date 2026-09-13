import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Plus, FileText } from 'lucide-react';

export default function DictationList() {
  const { data: dictations, isLoading } = useQuery({
    queryKey: ['dictations'],
    queryFn: async () => {
      const res = await axiosClient.get('dictations/');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Dictations</h1>
        <Link 
          to="/dictation/new" 
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 font-medium"
        >
          <Plus size={18} />
          <span>New Dictation</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Template</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {dictations?.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {new Date(d.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {d.template_type || 'SOAP Note'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                    d.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/dictation/${d.id}`} className="text-blue-600 hover:text-blue-900 flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText size={16} />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
            {(!dictations || dictations.length === 0) && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  No dictations found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
