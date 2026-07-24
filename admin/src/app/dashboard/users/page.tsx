"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_blocked: boolean;
  proxies_count: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch('http://localhost:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleBlock = async (user: User) => {
    if (user.is_admin) return alert('Cannot block an admin');
    
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${user.id}/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to block user');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">User Management</h2>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Proxies</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.name}
                    {user.is_admin && <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Admin</span>}
                  </div>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.proxies_count}</td>
                <td className="px-6 py-4">
                  {user.is_blocked ? (
                    <span className="text-red-400">Blocked</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {!user.is_admin && (
                    <button
                      onClick={() => toggleBlock(user)}
                      className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
                        user.is_blocked 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {user.is_blocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
