import { useState, useEffect } from 'react';
import { Palette, Power, Sparkles } from 'lucide-react';

interface ZenithSettings {
  zenModeEnabled?: boolean;
  activeTheme?: string;
}

function App() {
  const [enabled, setEnabled] = useState(true);
  const [activeTheme, setActiveTheme] = useState('catppuccin-mocha');

  useEffect(() => {
    chrome.storage.sync.get(['zenModeEnabled', 'activeTheme'], (result) => {
      const settings = result as ZenithSettings;
      if (typeof settings.zenModeEnabled === 'boolean') setEnabled(settings.zenModeEnabled);
      if (typeof settings.activeTheme === 'string') setActiveTheme(settings.activeTheme);
    });
  }, []);

  const toggleZenMode = () => {
    const newState = !enabled;
    setEnabled(newState);
    chrome.storage.sync.set({ zenModeEnabled: newState });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setActiveTheme(newTheme);
    chrome.storage.sync.set({ activeTheme: newTheme });
  };

  return (
    <div className="w-72 p-4 bg-zinc-900 text-zinc-100 font-sans border border-zinc-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-zinc-100">Zen</span>
          <span className="text-purple-400">ith</span>
        </h1>
        <button 
          onClick={toggleZenMode}
          className={`p-2 rounded-full transition-colors ${enabled ? 'bg-zinc-800 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}
        >
          <Power size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col bg-zinc-800/50 p-3 rounded-md gap-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-zinc-400" />
            <span className="text-sm font-medium">Active Theme</span>
          </div>
          
          <select 
            value={activeTheme} 
            onChange={handleThemeChange}
            className="w-full bg-zinc-900 border border-zinc-700 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-purple-500"
          >
            <optgroup label="Free Tier">
              <option value="catppuccin-mocha">Catppuccin Mocha</option>
              <option value="tokyo-night">Tokyo Night</option>
            </optgroup>
            <optgroup label="Premium Tier ✦">
              <option value="sakura-premium">Sakura Blossom (Animated)</option>
            </optgroup>
          </select>
        </div>
      </div>
      
      {activeTheme === 'sakura-premium' && (
        <div className="mt-4 p-2 bg-pink-500/10 border border-pink-500/20 rounded flex items-center gap-2 text-xs text-pink-300">
          <Sparkles size={14} />
          <span>Premium theme applied.</span>
        </div>
      )}
    </div>
  );
}

export default App;