import { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { LEVELS } from './levels';
import { Trophy, ArrowRight, RotateCcw, Flag, Info, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'hole-in' | 'finished'>('start');
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [levelStrokes, setLevelStrokes] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const currentLevel = LEVELS[currentLevelIdx] || LEVELS[0];

  const handleHoleIn = (strokes: number) => {
    setLevelStrokes(strokes);
    setTotalStrokes(prev => prev + strokes);
    setScoreHistory(prev => [...prev, strokes]);
    setGameState('hole-in');
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#ffffff', '#fbbf24']
    });
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState('playing');
    } else {
      setGameState('finished');
    }
  };

  const resetLevel = () => {
    const temp = currentLevelIdx;
    setCurrentLevelIdx(-1);
    setTimeout(() => setCurrentLevelIdx(temp), 0);
  };

  const startGame = () => {
    setGameState('playing');
    setTotalStrokes(0);
    setScoreHistory([]);
    setCurrentLevelIdx(0);
  };

  const getScoreName = (strokes: number, par: number) => {
    const diff = strokes - par;
    if (strokes === 1) return 'Hole in One!';
    if (diff === -3) return 'Albatross';
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double Bogey';
    return 'Triple Bogey+';
  };

  return (
    <div className="min-h-screen bg-emerald-950 text-white font-sans">
      {/* Header */}
      <header className="bg-emerald-900/50 border-b border-emerald-800 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-full text-emerald-900">
              <Flag size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MINI GOLF PRO</h1>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex gap-6 items-center">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase opacity-60">Total Score</span>
                <span className="font-mono text-lg">{totalStrokes}</span>
              </div>
              <div className="h-8 w-px bg-emerald-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase opacity-60">Level</span>
                <span className="font-mono text-lg">{currentLevelIdx + 1} / {LEVELS.length}</span>
              </div>
            </div>
          )}

          <button 
            onClick={() => setGameState('start')}
            className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
          >
            <Home size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {gameState === 'start' && (
          <div className="text-center space-y-8 max-w-md bg-emerald-900/40 p-12 rounded-3xl border border-emerald-800 backdrop-blur-sm shadow-2xl">
            <div className="relative inline-block">
               <Trophy size={80} className="text-yellow-400 mx-auto" />
               <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">NEW</div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black">Ready to Tee Off?</h2>
              <p className="text-emerald-300">A challenging {LEVELS.length}-hole course awaits your mastery. Aim carefully, control your power, and hit the hole.</p>
            </div>
            <button 
              onClick={startGame}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-xl text-xl shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              START GAME <ArrowRight />
            </button>
            <div className="grid grid-cols-2 gap-4 pt-4 text-left text-sm opacity-80">
              <div className="flex gap-2">
                <div className="mt-1"><Info size={14} /></div>
                <p>Drag the ball back to aim and power up your shot.</p>
              </div>
              <div className="flex gap-2">
                <div className="mt-1"><Info size={14} /></div>
                <p>Avoid obstacles and use the walls to your advantage.</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentLevelIdx >= 0 && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                   Hole {currentLevel.id}: {currentLevel.name}
                </h2>
                <p className="text-emerald-400 text-sm">Par {currentLevel.par} • {currentLevelIdx + 1} of {LEVELS.length}</p>
              </div>
              <button 
                onClick={resetLevel}
                className="flex items-center gap-2 text-sm bg-emerald-800/50 hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-colors border border-emerald-700"
              >
                <RotateCcw size={16} /> Reset Hole
              </button>
            </div>

            <GameCanvas 
              key={currentLevelIdx}
              level={currentLevel} 
              onHoleIn={handleHoleIn}
              onStroke={() => {}}
            />
          </div>
        )}

        {gameState === 'hole-in' && (
          <div className="text-center space-y-8 max-w-md bg-emerald-900/60 p-12 rounded-3xl border-4 border-yellow-500 backdrop-blur-md shadow-2xl animate-in zoom-in duration-300">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-yellow-400 drop-shadow-lg">
                {getScoreName(levelStrokes, currentLevel.par)}
              </h2>
              <p className="text-2xl font-bold">You made it in {levelStrokes} shots!</p>
              <p className="text-emerald-300">Level Par: {currentLevel.par}</p>
            </div>
            
            <button 
              onClick={nextLevel}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-black py-4 rounded-xl text-xl shadow-lg shadow-yellow-900/50 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {currentLevelIdx < LEVELS.length - 1 ? 'NEXT HOLE' : 'FINAL RESULTS'} <ArrowRight />
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center space-y-8 max-w-2xl bg-emerald-900/40 p-12 rounded-3xl border border-emerald-800 backdrop-blur-sm shadow-2xl">
            <Trophy size={100} className="text-yellow-400 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-4xl font-black">Course Completed!</h2>
              <p className="text-emerald-300 text-xl">Total Score: <span className="text-white font-mono text-3xl font-bold">{totalStrokes}</span></p>
            </div>

            <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-800">
              <h3 className="text-sm uppercase tracking-widest opacity-60 mb-4">Scorecard</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {scoreHistory.map((score, i) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-emerald-900/50 rounded-xl border border-emerald-800">
                    <span className="text-[10px] opacity-60">Hole {i+1}</span>
                    <span className="text-xl font-bold">{score}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                      score <= LEVELS[i].par ? 'bg-emerald-500 text-emerald-950' : 'bg-red-500 text-white'
                    }`}>
                      {score === 1 ? 'HIO' : score - LEVELS[i].par > 0 ? `+${score - LEVELS[i].par}` : score - LEVELS[i].par === 0 ? 'E' : score - LEVELS[i].par}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-xl text-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              PLAY AGAIN <RotateCcw size={20} />
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-emerald-600 text-xs">
        <p>&copy; 2024 Mini Golf Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
