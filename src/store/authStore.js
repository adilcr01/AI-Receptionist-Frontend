import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  // Doctor Auth State
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  
  // Admin Auth State
  adminToken: localStorage.getItem('adminToken') || null,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    
    let role = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
      if (role) localStorage.setItem('role', role);
    } catch (e) {
      console.error("Failed to parse JWT");
    }

    set({ user, token, role });
  },

  setAdminAuth: (token) => {
    localStorage.setItem('adminToken', token);
    set({ adminToken: token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, token: null, role: null });
  },

  adminLogout: () => {
    localStorage.removeItem('adminToken');
    set({ adminToken: null });
  }
}))
