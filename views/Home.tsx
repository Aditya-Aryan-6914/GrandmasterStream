import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Cpu, Tv, ArrowRight, Sword } from 'lucide-react';
import Modal from '../components/Modal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleCreateRoom = () => {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShowCreateModal(true);
  };

  const enterRoom = (code: string) => {
      navigate(`/room/${code}`);
  };

  return (
    <div className="min-h-screen bg-[#302e2b] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#262421] border-b border-gray-800">
        <div className="flex items-center space-x-2">
            <Sword className="text-chess-accent" size={32} />
            <span className="text-xl font-bold tracking-tight">GrandmasterStream</span>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition">Play</a>
            <a href="#" className="hover:text-white transition">Puzzles</a>
            <a href="#" className="hover:text-white transition">Learn</a>
            <a href="#" className="hover:text-white transition">Watch</a>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition">
            Log In
        </button>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Graphic (Desktop) */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-[#262421] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 max-w-lg">
                <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                    Play Chess Online <br/>
                    <span className="text-chess-accent">on the #1 Site!</span>
                </h1>
                <div className="flex space-x-8 mt-12">
                    <div className="text-center">
                        <span className="block text-3xl font-bold">14,302</span>
                        <span className="text-gray-500 text-sm">Games Today</span>
                    </div>
                     <div className="text-center">
                        <span className="block text-3xl font-bold">1,204</span>
                        <span className="text-gray-500 text-sm">Playing Now</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[#302e2b]">
            <div className="w-full max-w-md space-y-6">
                
                {/* Main Action Card */}
                <button 
                    onClick={handleCreateRoom}
                    className="w-full group bg-chess-accent hover:bg-chess-accentHover text-white p-4 rounded-xl shadow-lg flex items-center transition-all transform hover:-translate-y-1"
                >
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                        <Play size={32} fill="currentColor" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="text-2xl font-bold">Create Room</div>
                        <div className="text-chess-light/80 text-sm">Start a match & invite a friend</div>
                    </div>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Secondary Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setShowJoinModal(true)}
                        className="bg-[#454341] hover:bg-[#555351] p-4 rounded-xl flex flex-col items-center text-center transition"
                     >
                        <Users className="mb-2 text-gray-300" size={28} />
                        <span className="font-bold">Join Room</span>
                    </button>
                    
                     <button className="bg-[#454341] hover:bg-[#555351] p-4 rounded-xl flex flex-col items-center text-center transition">
                        <Cpu className="mb-2 text-gray-300" size={28} />
                        <span className="font-bold">Play Computer</span>
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <h3 className="text-gray-400 font-bold mb-4 flex items-center">
                        <Tv size={18} className="mr-2" />
                        Top Streamers
                    </h3>
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer transition">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                                    <div>
                                        <div className="font-bold text-sm">GM_HikaruClone</div>
                                        <div className="text-xs text-gray-500">Blitz • 2400+</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-red-500 text-xs font-bold">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                                    LIVE
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Room Created!"
      >
        <div className="text-center space-y-6">
            <p className="text-gray-400">Share this code with your friend to start the game.</p>
            <div className="bg-black/30 p-4 rounded-lg border-2 border-chess-accent border-dashed">
                <span className="text-4xl font-mono font-bold tracking-widest text-white">{generatedCode}</span>
            </div>
            <button 
                onClick={() => enterRoom(generatedCode)}
                className="w-full bg-chess-accent hover:bg-chess-accentHover text-white font-bold py-3 rounded-lg transition"
            >
                Enter Room
            </button>
        </div>
      </Modal>

      <Modal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)}
        title="Join a Room"
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Access Code</label>
                <input 
                    type="text" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-chess-accent focus:border-transparent outline-none text-center text-lg tracking-widest font-mono"
                />
            </div>
            <button 
                onClick={() => enterRoom(joinCode)}
                disabled={joinCode.length !== 6}
                className="w-full bg-chess-accent hover:bg-chess-accentHover disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
            >
                Join Game
            </button>
        </div>
      </Modal>

    </div>
  );
};

export default Home;