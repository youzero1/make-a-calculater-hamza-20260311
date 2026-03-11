'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Calculation {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/calculations');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setCalculations(data.calculations);
    } catch (err) {
      setError('Failed to load calculation history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    try {
      setClearing(true);
      const response = await fetch('/api/calculations', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear history');
      setCalculations([]);
    } catch (err) {
      setError('Failed to clear history.');
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-950">
      <div className="w-full max-w-2xl mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-3xl font-bold">📋 History</h1>
            <p className="text-gray-400 text-sm mt-1">All past calculations</p>
          </div>
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 text-sm underline transition-colors"
          >
            ← Back to Calculator
          </Link>
        </div>

        {loading && (
          <div className="text-gray-400 text-center py-10">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            Loading history...
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-600 text-red-200 rounded-xl p-4 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && calculations.length === 0 && (
          <div className="text-gray-500 text-center py-16">
            <div className="text-6xl mb-4">🗒️</div>
            <p className="text-lg">No calculations yet.</p>
            <p className="text-sm mt-2">Go calculate something!</p>
          </div>
        )}

        {!loading && calculations.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">
                {calculations.length} calculation{calculations.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {clearing ? 'Clearing...' : '🗑️ Clear History'}
              </button>
            </div>

            <div className="space-y-3">
              {calculations.map((calc) => (
                <div
                  key={calc.id}
                  className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-gray-300 text-sm font-mono mb-1">
                        {calc.expression}
                      </div>
                      <div className="text-white text-xl font-bold font-mono">
                        = {calc.result}
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs sm:text-right shrink-0">
                      {formatDate(calc.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
