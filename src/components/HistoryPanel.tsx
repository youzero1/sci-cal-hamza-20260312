'use client';

import { HistoryEntry } from './Calculator';

interface HistoryPanelProps {
  history: HistoryEntry[];
  loading: boolean;
  onClear: () => void;
  onSelect: (result: string) => void;
  onRefresh: () => void;
}

export default function HistoryPanel({
  history,
  loading,
  onClear,
  onSelect,
  onRefresh,
}: HistoryPanelProps) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl w-80 overflow-hidden flex flex-col max-h-[520px]">
      <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-700">
        <span className="text-slate-300 text-sm font-semibold tracking-wide uppercase">
          History
        </span>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="text-slate-400 hover:text-white text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1.5 rounded-lg transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-red-400 text-xs bg-slate-700 hover:bg-red-900/30 px-2 py-1.5 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-400 text-sm">Loading...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <div className="text-slate-500 text-3xl">📋</div>
            <div className="text-slate-500 text-sm">No calculations yet</div>
          </div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => onSelect(entry.result)}
                  className="w-full text-right px-4 py-3 hover:bg-slate-700 transition-colors group"
                >
                  <div className="text-slate-400 text-xs truncate group-hover:text-slate-300">
                    {entry.expression}
                  </div>
                  <div className="text-white text-lg font-medium truncate">
                    {entry.result}
                  </div>
                  <div className="text-slate-600 text-xs">
                    {new Date(entry.createdAt).toLocaleString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
