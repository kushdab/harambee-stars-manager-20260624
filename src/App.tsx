import React, { useState, useEffect } from 'react';
import { Landmark, Users, PlusCircle, Smartphone, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  target: number;
  raised: number;
  contributors: number;
}

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', title: 'Community Borehole Project', description: 'Drilling a solar-powered borehole for the local market.', target: 500000, raised: 125000, contributors: 45 },
    { id: '2', title: 'Education Scholarship Fund', description: 'Assisting vulnerable students with secondary school fees.', target: 200000, raised: 180000, contributors: 120 },
    { id: '3', title: 'Church Roof Renovation', description: 'Fixing leaks and painting the main sanctuary roof.', target: 150000, raised: 30000, contributors: 12 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    // Simulate M-Pesa STK Push API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (phone.length >= 10 && Number(amount) > 0) {
      setCampaigns(prev => prev.map(c => 
        c.id === selectedId ? { ...c, raised: c.raised + Number(amount), contributors: c.contributors + 1 } : c
      ));
      setStatus('success');
      setTimeout(() => { setIsModalOpen(false); setStatus('idle'); setPhone(''); setAmount(''); }, 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-mpesa-green text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Landmark size={32} />
            <h1 className="text-2xl font-bold tracking-tight">Harambee Stars Manager</h1>
          </div>
          <button className="bg-white text-mpesa-green px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition">
            <PlusCircle size={20} /> New Campaign
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{camp.title}</h3>
                <p className="text-gray-600 text-sm mb-4 h-12">{camp.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Raised: KES {camp.raised.toLocaleString()}</span>
                    <span>Target: {Math.round((camp.raised / camp.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-mpesa-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (camp.raised / camp.target) * 100)}%` }}></div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Users size={14} /> {camp.contributors} community members contributed
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedId(camp.id); setIsModalOpen(true); }}
                  className="w-full mt-6 bg-mpesa-green text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Contribute via M-Pesa
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Smartphone className="text-mpesa-green" /> M-Pesa Contribution
            </h2>
            
            {status === 'idle' ? (
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="text" placeholder="0712345678" className="w-full mt-1 p-3 border rounded-lg outline-mpesa-green" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
                  <input type="number" placeholder="1000" className="w-full mt-1 p-3 border rounded-lg outline-mpesa-green" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-mpesa-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition">
                  Send STK Push
                </button>
              </form>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                {status === 'processing' && <Loader2 className="animate-spin text-mpesa-green" size={48} />}
                {status === 'success' && <CheckCircle2 className="text-mpesa-green" size={48} />}
                {status === 'error' && <XCircle className="text-red-500" size={48} />}
                <p className="text-lg font-medium">
                  {status === 'processing' && 'Awaiting M-Pesa PIN...'}
                  {status === 'success' && 'Contribution Received!'}
                  {status === 'error' && 'Transaction Failed'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}