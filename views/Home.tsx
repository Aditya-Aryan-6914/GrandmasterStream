import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Users, Cpu, Tv, ArrowRight, Sword, LogOut, Menu, X } from 'lucide-react';
import Modal from '../components/Modal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCreateRoom = () => {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setShowCreateModal(true);
  };

  const enterRoom = (code: string) => {
    navigate(`/room/${code}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#302e2b] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#262421] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Sword className="text-chess-accent" size={32} />
          <span className="text-xl font-bold tracking-tight">GrandmasterStream</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-white transition">
            Play
          </button>
          <button onClick={() => navigate('/#learn')} className="hover:text-white transition">
            Learn
          </button>
          <button onClick={() => navigate('/#about')} className="hover:text-white transition">
            About
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-400 hover:text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-chess-accent hover:bg-chess-accentHover px-4 py-2 rounded text-sm font-medium transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#262421] border-b border-gray-800 p-4 space-y-3">
          <button className="block w-full text-left text-gray-400 hover:text-white py-2">
            Play
          </button>
          <button className="block w-full text-left text-gray-400 hover:text-white py-2">
            Learn
          </button>
          <button className="block w-full text-left text-gray-400 hover:text-white py-2">
            About
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition mt-2"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left text-gray-400 hover:text-white py-2"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="block w-full text-left bg-chess-accent hover:bg-chess-accentHover px-4 py-2 rounded text-sm font-medium transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Graphic (Desktop) */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-[#262421] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Play Chess Online <br />
              <span className="text-chess-accent">with Friends & AI</span>
            </h1>
            <p className="text-gray-400 mb-8">Stream your games live and analyze with AI commentary</p>
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
            {!user && (
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-400 mb-3">Sign up to play online chess games</p>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-chess-accent hover:bg-chess-accentHover text-white font-semibold py-2 rounded-lg transition"
                >
                  Create Free Account
                </button>
              </div>
            )}

            {/* Main Action Card */}
            <button
              onClick={handleCreateRoom}
              disabled={!user}
              className="w-full group bg-chess-accent hover:bg-chess-accentHover disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-xl shadow-lg flex items-center transition-all transform hover:-translate-y-1"
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
                disabled={!user}
                className="bg-[#454341] hover:bg-[#555351] disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-xl flex flex-col items-center text-center transition"
              >
                <Users className="mb-2 text-gray-300" size={28} />
                <span className="font-bold">Join Room</span>
              </button>

              <button disabled className="bg-[#454341] p-4 rounded-xl flex flex-col items-center text-center opacity-50 cursor-not-allowed">
                <Cpu className="mb-2 text-gray-300" size={28} />
                <span className="font-bold text-sm">vs Computer</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-gray-400 font-bold mb-4 flex items-center">
                <Tv size={18} className="mr-2" />
                Featured Streams
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer transition">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chess-accent to-chess-dark"></div>
                      <div>
                        <div className="font-bold text-sm">Grandmaster #{i}</div>
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

      {/* Features Section */}
      <section className="bg-[#262421] border-t border-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-chess-accent/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="text-chess-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiplayer</h3>
              <p className="text-gray-400">Play with friends or online opponents in real-time games</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chess-accent/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Sword className="text-chess-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-gray-400">Get live AI commentary and move analysis during games</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chess-accent/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Tv className="text-chess-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Streaming</h3>
              <p className="text-gray-400">Stream your games and share with the chess community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 GrandmasterStream. All rights reserved.</p>
        </div>
      </footer>

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
            onClick={() => {
              enterRoom(generatedCode);
              setShowCreateModal(false);
            }}
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
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-chess-accent focus:border-transparent outline-none text-center text-lg tracking-widest font-mono"
            />
          </div>
          <button
            onClick={() => {
              if (joinCode.length === 6) {
                enterRoom(joinCode);
                setShowJoinModal(false);
                setJoinCode('');
              }
            }}
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