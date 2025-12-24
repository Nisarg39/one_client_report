'use client';

import { useState, useEffect } from 'react';
import { getClients } from '@/app/actions/clients/getClients';
import { getGoogleAnalyticsTestData } from './test-action';

export default function GoogleAnalyticsTestPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

    useEffect(() => {
        async function fetchClients() {
            const result = await getClients();
            if (result.success && result.clients) {
                setClients(result.clients);
            }
        }
        fetchClients();
    }, []);

    const handleFetch = async (propertyId?: string) => {
        if (!selectedClientId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getGoogleAnalyticsTestData(selectedClientId, propertyId || '');
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
                setData(null);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-[#1a1a1a] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8">Google Analytics Debugger</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#252525] p-6 rounded-xl border border-gray-800">
                    <label className="block text-sm font-medium mb-2">Select Client</label>
                    <select
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 mb-4"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                        <option value="">Select a client...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => handleFetch()}
                        disabled={!selectedClientId || loading}
                        className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Fetching...' : 'Fetch All Data'}
                    </button>
                </div>

                {data && (
                    <div className="bg-[#252525] p-6 rounded-xl border border-gray-800">
                        <label className="block text-sm font-medium mb-2">Select Property (Filter Test)</label>
                        <select
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 mb-4"
                            value={selectedPropertyId}
                            onChange={(e) => {
                                setSelectedPropertyId(e.target.value);
                                handleFetch(e.target.value);
                            }}
                        >
                            <option value="">All Properties (Cumulative)</option>
                            {data.properties?.map((p: any) => (
                                <option key={p.propertyId} value={p.propertyId}>{p.propertyName}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400">
                            Selection ID: <span className="font-mono">{selectedPropertyId || 'None'}</span>
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-500 p-4 rounded mb-8">
                    {error}
                </div>
            )}

            {data && (
                <div className="space-y-10">
                    {/* High-level Property Inventory */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Property Performance Inventory
                            </h2>
                            <span className="text-xs font-mono text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                {data.properties?.length || 0} Entities
                            </span>
                        </div>

                        <div className="bg-[#252525] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-[#1a1a1a] border-b border-gray-700">
                                        <tr>
                                            <th className="p-5 text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[300px]">Property Identity</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Sessions</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Users</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">New Users</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Pageviews</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[100px]">Bounce Rate</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Engagement</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {data.properties?.map((p: any) => (
                                            <tr
                                                key={p.propertyId}
                                                className={`
                                                    cursor-pointer transition-all duration-200
                                                    ${selectedPropertyId === p.propertyId ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-white/5'}
                                                `}
                                                onClick={() => {
                                                    setSelectedPropertyId(p.propertyId);
                                                    handleFetch(p.propertyId);
                                                }}
                                            >
                                                <td className="p-5">
                                                    <div className="font-bold text-white text-base leading-tight">{p.propertyName}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono mt-1 tracking-wider">{p.propertyId}</div>
                                                </td>
                                                <td className="p-5 text-right font-mono text-blue-400 text-base">
                                                    {p.metrics?.sessions?.toLocaleString() || 0}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {p.metrics?.users?.toLocaleString() || 0}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {p.metrics?.newUsers?.toLocaleString() || 0}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {p.metrics?.pageviews?.toLocaleString() || 0}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {(p.metrics?.bounceRate * 100 || 0).toFixed(1)}%
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono text-blue-300/60">
                                                    {(p.metrics?.engagementRate * 100 || 0).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Debug JSON Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 border-t border-gray-800">
                        <div>
                            <h2 className="text-sm font-black text-gray-600 uppercase tracking-[0.3em] mb-4">
                                Processed Interface Schema
                            </h2>
                            <pre className="bg-[#0f0f0f] p-6 rounded-2xl border border-gray-800 overflow-auto max-h-[500px] text-[11px] font-mono text-blue-300/40 leading-relaxed shadow-inner">
                                {JSON.stringify(data.properties?.find((p: any) => p.propertyId === (selectedPropertyId || data.selectedPropertyId)) || data, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-gray-600 uppercase tracking-[0.3em] mb-4 text-right">
                                Raw Data Context
                            </h2>
                            <pre className="bg-[#0f0f0f] p-6 rounded-2xl border border-gray-800 overflow-auto max-h-[500px] text-[11px] font-mono text-gray-300/40 leading-relaxed shadow-inner">
                                {JSON.stringify(data.apiResponse || [], null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
