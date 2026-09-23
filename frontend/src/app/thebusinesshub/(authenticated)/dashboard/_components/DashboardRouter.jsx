'use client'

import { useEffect, useState } from 'react';
import SubAdminDashboard from './SubAdminDashboard';

export default function DashboardRouter({ adminView, blogs, casestudies }) {
  const [role, setRole] = useState(null); // null = hydrating

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
      setRole(stored?.role || 'admin');
    } catch {
      setRole('admin');
    }
  }, []);

  // Avoid flash: wait until role is read from localStorage
  if (role === null) return null;

  if (role === 'sub-admin') return <SubAdminDashboard blogs={blogs} casestudies={casestudies} />;

  return adminView;
}
