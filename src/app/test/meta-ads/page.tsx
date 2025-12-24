'use client';

import { useState, useEffect } from 'react';
import { getClients } from '@/app/actions/clients/getClients';
import { getMetaAdsTestData } from './test-action';

export default function MetaAdsTestPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

    useEffect(() => {
        async function fetchClients() {
            const result = await getClients();
            if (result.success && result.clients) {
                setClients(result.clients);
            }
        }
        fetchClients();
    }, []);

    const handleFetch = async (campaignId?: string) => {
        if (!selectedClientId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getMetaAdsTestData(selectedClientId, campaignId || '');
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
            <h1 className="text-3xl font-bold mb-8">Meta Ads Debugger</h1>

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
                        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Fetching...' : 'Fetch All Data'}
                    </button>
                </div>

                {data && (
                    <div className="bg-[#252525] p-6 rounded-xl border border-gray-800">
                        <label className="block text-sm font-medium mb-2">Select Campaign (Filter Test)</label>
                        <select
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 mb-4"
                            value={selectedCampaignId}
                            onChange={(e) => {
                                setSelectedCampaignId(e.target.value);
                                handleFetch(e.target.value);
                            }}
                        >
                            <option value="">Cumulative (No Filter)</option>
                            {data.campaigns?.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400">
                            Selection ID: <span className="font-mono">{selectedCampaignId || 'None'}</span>
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
                    {/* High-level Processed Metrics */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                            Processed Summary Metrics
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#252525] border border-blue-500/20 p-5 rounded-xl text-center shadow-lg">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Spend</p>
                                <p className="text-3xl font-black font-mono text-blue-400">
                                    {data.metrics.currency || 'USD'} {data.metrics.spend.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-[#252525] border border-gray-800 p-5 rounded-xl text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Impressions</p>
                                <p className="text-3xl font-black font-mono">
                                    {data.metrics.impressions.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-[#252525] border border-gray-800 p-5 rounded-xl text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Clicks</p>
                                <p className="text-3xl font-black font-mono">
                                    {data.metrics.clicks.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-[#252525] border border-gray-800 p-5 rounded-xl text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">CTR</p>
                                <p className="text-3xl font-black font-mono">
                                    {data.metrics.ctr.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Campaign Table */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Campaign Performance Inventory
                            </h2>
                            <span className="text-xs font-mono text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                {data.campaigns?.length || 0} Entities
                            </span>
                        </div>

                        <div className="bg-[#252525] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-[#1a1a1a] border-b border-gray-700">
                                        <tr>
                                            <th className="p-5 text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[300px]">Campaign Identity</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[140px]">Direct Spend</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Impressions</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Clicks</th>
                                            <th className="p-5 text-right text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[100px]">CTR</th>
                                            <th className="p-5 text-gray-400 uppercase text-[10px] tracking-widest font-black min-w-[120px]">Market Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {data.campaigns?.map((c: any) => (
                                            <tr
                                                key={c.id}
                                                className={`
                                                    cursor-pointer transition-all duration-200
                                                    ${selectedCampaignId === c.id ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-white/5'}
                                                `}
                                                onClick={() => {
                                                    setSelectedCampaignId(c.id);
                                                    handleFetch(c.id);
                                                }}
                                            >
                                                <td className="p-5">
                                                    <div className="font-bold text-white text-base leading-tight">{c.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono mt-1 tracking-wider">{c.id}</div>
                                                </td>
                                                <td className="p-5 text-right font-mono text-blue-400 text-base">
                                                    {data.metrics.currency || 'USD'} {c.metrics.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {c.metrics.impressions.toLocaleString()}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {c.metrics.clicks.toLocaleString()}
                                                </td>
                                                <td className="p-5 text-right text-gray-300 font-mono">
                                                    {c.metrics.ctr.toFixed(2)}%
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-2.5 py-1 rounded text-[9px] uppercase font-black tracking-tighter ${c.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700/50'
                                                        }`}>
                                                        {c.status}
                                                    </span>
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
                                Processed Summary Payload
                            </h2>
                            <pre className="bg-[#0f0f0f] p-6 rounded-2xl border border-gray-800 overflow-auto max-h-[500px] text-[11px] font-mono text-blue-300/40 leading-relaxed shadow-inner">
                                {JSON.stringify(data.metrics, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-gray-600 uppercase tracking-[0.3em] mb-4 text-right">
                                Raw API Request Payload
                            </h2>
                            <pre className="bg-[#0f0f0f] p-6 rounded-2xl border border-gray-800 overflow-auto max-h-[500px] text-[11px] font-mono text-blue-300/40 leading-relaxed shadow-inner">
                                {JSON.stringify(data.apiResponse || [], null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
