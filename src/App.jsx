import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import AdminLayout from './pages/AdminLayout';
import DictationList from './pages/DictationList';
import DictationSession from './pages/DictationSession';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const adminToken = useAuthStore((state) => state.adminToken);
  if (!adminToken) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DictationList />} />
            <Route path="dictation/new" element={<DictationSession />} />
            <Route path="dictation/:id" element={<DictationSession />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="logs" element={<div className="p-8 text-slate-500">System Logs Interface Coming Soon...</div>} />
            <Route path="settings" element={<div className="p-8 text-slate-500">Global Settings Coming Soon...</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
