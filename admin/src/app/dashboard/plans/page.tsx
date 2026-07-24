"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
  id: number;
  name: string;
  price: string;
  max_proxies: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0.00');
  const [maxProxies, setMaxProxies] = useState('10');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch('http://localhost:8000/api/admin/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch plans');
      const data = await res.json();
      setPlans(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('http://localhost:8000/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, price: parseFloat(price), max_proxies: parseInt(maxProxies) })
      });
      
      if (res.ok) {
        setName('');
        setPrice('0.00');
        setMaxProxies('10');
        fetchPlans();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create plan');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this plan?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`http://localhost:8000/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPlans();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Subscription Plans</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Price ($)</th>
                <th className="px-6 py-4 font-semibold">Max Proxies</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-bold text-white">{plan.name}</td>
                  <td className="px-6 py-4 text-green-400">${plan.price}</td>
                  <td className="px-6 py-4">{plan.max_proxies}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-300 font-bold text-sm transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {plans.length === 0 && <div className="p-8 text-center text-gray-500">No plans created yet.</div>}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-fit">
          <h3 className="text-xl font-bold text-white mb-4">Create New Plan</h3>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Plan Name (e.g. Pro, Basic)</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Price ($ / month)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 outline-none focus:border-blue-500" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Max Proxies Allowed</label>
              <input type="number" value={maxProxies} onChange={e => setMaxProxies(e.target.value)} required className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 outline-none focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
              Create Plan
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
