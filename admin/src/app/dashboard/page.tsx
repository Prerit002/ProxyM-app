"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8000/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token');
          router.push('/login');
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => setError(err.message));
  }, [router]);

  if (error) return <div className="text-red-500">Error loading stats: {error}</div>;
  if (!stats) return <div className="text-gray-400">Loading statistics...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Global Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Total Users</div>
          <div className="text-4xl text-white font-bold">{stats.total_users}</div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Total Proxies</div>
          <div className="text-4xl text-blue-400 font-bold">{stats.total_proxies}</div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Working Proxies</div>
          <div className="text-4xl text-green-400 font-bold">{stats.working_proxies}</div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="text-gray-400 mb-2">Dead Proxies</div>
          <div className="text-4xl text-red-400 font-bold">{stats.dead_proxies}</div>
        </div>
      </div>
    </div>
  );
}
