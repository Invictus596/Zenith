import { useState, useEffect } from 'react';
import { Palette, Power, Sparkles, Check } from 'lucide-react';

interface ZenithSettings {
  zenModeEnabled?: boolean;
  activeTheme?: string;
}

function App() {
  const [enabled, setEnabled] = useState(true);
  const [draftTheme, setDraftTheme] = useState('catppuccin-mocha');
  const [currentTheme, setCurrentTheme] = useState('catppuccin-mocha');

  useEffect(() => {
    chrome.storage.sync.get(['zenModeEnabled', 'activeTheme'], (result) => {
      const settings = result as ZenithSettings;
      if (typeof settings.zenModeEnabled === 'boolean') setEnabled(settings.zenModeEnabled);
      if (typeof settings.activeTheme === 'string') {
        setCurrentTheme(settings.activeTheme);
        setDraftTheme(settings.activeTheme);
      }
    });
  }, []);

  const toggleZenMode = () => {
    const newState = !enabled;
    setEnabled(newState);
    chrome.storage.sync.set({ zenModeEnabled: newState });
  };

  const handleThemeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDraftTheme(e.target.value);
  };

  const applyTheme = () => {
    setCurrentTheme(draftTheme);
    chrome.storage.sync.set({ activeTheme: draftTheme });
  };

  return (
    <div className="w-96 p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 font-sans border border-zinc-700/40 shadow-2xl shadow-black/50 rounded-[2rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter leading-none">
            <span className="text-zinc-100">Zen</span>
            <span className="text-fuchsia-400">ith</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium tracking-widest uppercase">Material 3 Expressive</p>
        </div>
        <button
          onClick={toggleZenMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${enabled ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-purple-900/40' : 'bg-zinc-800 text-zinc-400 shadow-zinc-900/40'}`}
          aria-label={enabled ? 'Disable Zen Mode' : 'Enable Zen Mode'}
        >
          <Power size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Theme Card - Elevated M3 Card */}
      <div className={`rounded-3xl p-6 bg-gradient-to-tr from-zinc-800/70 to-zinc-900/70 border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-md transition-colors duration-500 ${draftTheme === 'sakura-premium' ? 'ring-1 ring-fuchsia-400/30' : ''}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/20 shadow-inner">
            <Palette size={22} className="text-purple-300" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-zinc-50">Active Theme</h2>
            <p className="text-[11px] text-zinc-400">Draft state — apply to save</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <select
            value={draftTheme}
            onChange={handleThemeSelect}
            className="w-full bg-zinc-950/60 border border-zinc-600/40 text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent transition-all duration-300 text-zinc-100 appearance-none cursor-pointer hover:bg-zinc-950/80 shadow-inner"
          >
            <optgroup label="Free Tier" className="bg-zinc-900 text-zinc-200 font-semibold">
              <option value="catppuccin-mocha">Catppuccin Mocha</option>
              <option value="tokyo-night">Tokyo Night</option>
            </optgroup>
            <optgroup label="Premium Tier ✦" className="bg-zinc-900 text-fuchsia-300 font-semibold">
              <option value="sakura-premium">Sakura Blossom (Animated)</option>
            </optgroup>
          </select>

          <button
            onClick={applyTheme}
            disabled={draftTheme === currentTheme}
            className={`w-full py-3.5 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-300 shadow-xl shadow-purple-900/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-default flex items-center justify-center gap-2 ${draftTheme === currentTheme ? 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/40' : 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:brightness-110'}`}
          >
            {draftTheme === currentTheme ? (
              <>
                <Check size={18} /> Theme Applied
              </>
            ) : (
              'Apply Theme'
            )}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <span className={`inline-block w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${enabled ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-zinc-600 shadow-zinc-600/50'}`}></span>
          <span>{enabled ? 'Zen Mode Active' : 'Zen Mode Disabled'}</span>
        </div>
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">v0.1.0</span>
      </div>

      {/* Premium Badge */}
      {currentTheme === 'sakura-premium' && (
        <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-fuchsia-500/15 to-rose-400/15 border border-fuchsia-400/25 flex items-center gap-3 shadow-inner shadow-fuchsia-900/10 animate-pulse">
          <Sparkles size={18} className="text-fuchsia-300" />
          <div>
            <p className="text-xs font-extrabold text-fuchsia-200 tracking-wide">Premium Active</p>
            <p className="text-[10px] text-fuchsia-300/70">Animated overlay enabled on target sites</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
