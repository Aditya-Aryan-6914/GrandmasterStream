import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, PieceColor } from '../types';
import { Send, User, MessageCircle, Video, Mic, VideoOff, MicOff, Tv } from 'lucide-react';

interface StreamSidebarProps {
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  moveHistory: string[];
  viewerCount: number;
}

const StreamSidebar: React.FC<StreamSidebarProps> = ({ chatMessages, onSendMessage, moveHistory, viewerCount }) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'moves'>('chat');

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const toggleCamera = async () => {
    if (cameraEnabled) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // Audio false to prevent echo in this demo
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } catch (err) {
        console.error("Camera access denied", err);
        alert("Could not access camera. Please check permissions.");
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-chess-panel border-l border-gray-800 w-full lg:w-96 flex-shrink-0">
      {/* Streamer Camera Area */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-gray-700 group">
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${cameraEnabled ? 'opacity-100' : 'opacity-0'}`} 
        />
        {!cameraEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <User size={48} className="mb-2 opacity-50" />
                <span className="text-sm font-medium">Streamer Offline</span>
            </div>
        )}
        
        {/* Stream Overlay Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={toggleCamera} 
                className={`p-2 rounded-full ${cameraEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-lg`}
                title="Toggle Camera"
            >
                {cameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button 
                onClick={() => setMicEnabled(!micEnabled)} 
                className={`p-2 rounded-full ${micEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'} text-white shadow-lg`}
                title="Toggle Mic"
            >
                {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
        </div>

        {/* Live Badge */}
        <div className="absolute top-3 left-3 flex items-center bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm">
            <span className="animate-pulse mr-1.5 w-2 h-2 rounded-full bg-white"></span>
            LIVE
        </div>
        
        {/* Viewer Count */}
        <div className="absolute top-3 right-3 flex items-center bg-black/60 backdrop-blur px-2 py-0.5 rounded text-xs font-medium text-white shadow-sm">
            <User size={12} className="mr-1" />
            {viewerCount.toLocaleString()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-chess-accent border-b-2 border-chess-accent' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Stream Chat
        </button>
        <button 
          onClick={() => setActiveTab('moves')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'moves' ? 'text-chess-accent border-b-2 border-chess-accent' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Moves & Analysis
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm break-words leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="font-bold mr-2" style={{ color: msg.color || '#a3d160' }}>{msg.user}:</span>
                  <span className="text-gray-300">{msg.text}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Say something..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-chess-accent placeholder-gray-500"
              />
              <button type="submit" className="bg-chess-accent hover:bg-chess-accentHover text-white p-2 rounded transition-colors">
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-0">
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-800 text-gray-400 sticky top-0">
                     <tr>
                         <th className="px-4 py-2 font-medium">#</th>
                         <th className="px-4 py-2 font-medium">White</th>
                         <th className="px-4 py-2 font-medium">Black</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                         <tr key={i} className="hover:bg-gray-800/50">
                             <td className="px-4 py-2 text-gray-500 w-12">{i + 1}.</td>
                             <td className="px-4 py-2 font-medium text-white">{moveHistory[i * 2]}</td>
                             <td className="px-4 py-2 font-medium text-white">{moveHistory[i * 2 + 1] || ''}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             {moveHistory.length === 0 && (
                 <div className="p-8 text-center text-gray-500 italic">
                     Game hasn't started yet.
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamSidebar;