import { useState, useEffect } from 'react';
import { Palette, Power } from 'lucide-react';

function App() {
  const [enabled, setEnabled] = useState(true);
  const [accent, setAccent] = useState('#8b5cf6');

  useEffect(() => {
    chrome.storage.sync.get(['zenModeEnabled', 'accentColor'], (result) => {
      if (result.zenModeEnabled !== undefined) setEnabled(Boolean(result.zenModeEnabled));
      if (result.accentColor !== undefined) setAccent(String(result.accentColor));
    });
  }, []);

  const toggleZenMode = () => {
    const newState = !enabled;
    setEnabled(newState);
    chrome.storage.sync.set({ zenModeEnabled: newState });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setAccent(newColor);
    chrome.storage.sync.set({ accentColor: newColor });
  };

  return (
    <div className="w-64 p-4 bg-zinc-900 text-zinc-100 font-sans border border-zinc-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-zinc-100">Zen</span>
          <span style={{ color: accent }}>ith</span>
        </h1>
        <button
          onClick={toggleZenMode}
          className={`p-2 rounded-full transition-colors ${enabled ? 'bg-zinc-800 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}
        >
          <Power size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-md">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-zinc-400" />
            <span className="text-sm font-medium">Accent Color</span>
          </div>
          <input
            type="color"
            value={accent}
            onChange={handleColorChange}
            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
          />
        </div>
      </div>
    </div>
  );
}

export default App;