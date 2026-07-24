"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Proxy {
  id: number;
  ip_address: string;
  port: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
}

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch('http://localhost:8000/api/admin/proxies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch proxies');
      const data = await res.json();
      setProxies(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePurge = async () => {
    if (!confirm('Are you sure you want to delete ALL dead proxies across the platform?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('http://localhost:8000/api/admin/proxies/purge-dead', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully purged ${data.deleted_count} dead proxies!`);
        fetchProxies();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to purge proxies');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Global Proxy Diagnostics</h2>
        <button 
          onClick={handlePurge}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow-lg transition-colors"
        >
          Purge DEAD Proxies
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">IP Address</th>
              <th className="px-6 py-4 font-semibold">Port</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {proxies.map((proxy) => (
              <tr key={proxy.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-mono">{proxy.ip_address}</td>
                <td className="px-6 py-4 font-mono">{proxy.port}</td>
                <td className="px-6 py-4">
                  <div className="text-white">{proxy.user?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{proxy.user?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded font-bold ${
                    proxy.status === 'WORKING' ? 'bg-green-500/20 text-green-400' :
                    proxy.status === 'DEAD' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {proxy.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {proxies.length === 0 && (
          <div className="p-8 text-center text-gray-500">No proxies tracked yet.</div>
        )}
      </div>
    </div>
  );
}
