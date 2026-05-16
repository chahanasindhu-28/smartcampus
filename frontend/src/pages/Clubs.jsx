import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Code, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Clubs() {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/clubs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-white">Loading Clubs...</div>;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-12">
          <Link to="/dashboard" className="text-slate-300 hover:text-white font-bold mb-4 inline-flex items-center transition-colors text-sm bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">Campus Clubs</h1>
              <p className="text-slate-300 text-lg font-bold drop-shadow-sm">Join communities, build projects, and expand your network.</p>
            </div>
            
            {user?.role === 'SUPER_ADMIN' && (
              <div className="mt-6 md:mt-0">
                <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-extrabold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center">
                  + Create Club
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/clubs/${club.id}`}
                className="bg-slate-800/60 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full"
              >
                <div className="h-40 relative bg-slate-900 overflow-hidden border-b border-white/10">
                  <img 
                    src={club.banner ? club.banner : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200"} 
                    onError={(e) => e.target.src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                    alt={`${club.name} banner`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                </div>
                
                <div className="p-8 relative flex-1 flex flex-col z-10">
                  <div className="absolute -top-12 left-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-white/10 p-1 shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-md">
                      {club.logo ? (
                        <img src={club.logo} className="w-full h-full object-cover rounded-xl" alt="Logo" />
                      ) : (
                        <Code className="w-10 h-10 text-amber-500" />
                      )}
                    </div>
                  </div>

                  <div className="mt-10 flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-extrabold text-white line-clamp-1">{club.name}</h3>
                  </div>
                  
                  <p className="text-slate-400 text-sm font-bold mb-8 line-clamp-2 leading-relaxed">{club.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/10">
                    <div className="flex items-center text-xs font-bold text-slate-300 bg-slate-900/50 border border-white/5 px-4 py-2 rounded-xl shadow-sm">
                      <Users className="w-4 h-4 mr-2 text-amber-500" />
                      {club._count?.members || 0} Members
                    </div>
                    
                    <span className="text-sm font-extrabold text-white group-hover:text-amber-500 transition-colors flex items-center">
                      Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
