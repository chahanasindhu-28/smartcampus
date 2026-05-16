import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowLeft, Briefcase, Check, Camera } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

export default function ClubDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState('');

  useEffect(() => {
    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const res = await axios.get(`http://localhost:5005/api/clubs/${id}`);
      setClub(res.data);
      // Check if current user is already a member or pending
      if (user) {
        const membership = res.data.members.find(m => m.userId === user.id);
        if (membership) setJoinStatus(membership.status);
      }
    } catch (error) {
      console.error("Failed to fetch club", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setJoinStatus('loading');
      const token = localStorage.getItem('campusToken');
      // We will create this backend endpoint next
      await axios.post(`http://localhost:5005/api/clubs/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinStatus('PENDING');
    } catch (error) {
      alert('Failed to send join request');
      setJoinStatus('');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!club) return <div className="min-h-screen bg-[#FAFAFA] text-slate-800 flex items-center justify-center font-bold text-xl">Club not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 overflow-x-hidden font-sans">
      {/* Banner */}
      <div className="h-80 w-full relative">
        <img src={club.banner || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000"} className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/20 to-transparent" />
        <Link to="/clubs" className="absolute top-8 left-8 text-slate-800 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-white shadow-sm hover:scale-105 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-8 relative -mt-32 z-10 pb-20">
        <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-12">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border-4 border-[#FAFAFA] shadow-lg overflow-hidden flex-shrink-0">
            {club.logo ? (
              <img src={club.logo} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-5xl text-primary">
                {club.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-slate-900">{club.name}</h1>
            <p className="text-primary font-bold flex items-center text-sm md:text-base">
              <Users className="w-5 h-5 mr-2" /> {club.members?.filter(m => m.status === 'APPROVED').length || 0} Members
            </p>
          </div>
          
          {joinStatus === 'APPROVED' ? (
            <button disabled className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-8 py-3.5 rounded-xl font-bold flex items-center shadow-sm">
              <Check className="w-5 h-5 mr-2" /> Member
            </button>
          ) : joinStatus === 'PENDING' ? (
            <button disabled className="bg-amber-50 text-amber-600 border border-amber-200 px-8 py-3.5 rounded-xl font-bold flex items-center shadow-sm">
              Request Pending...
            </button>
          ) : (
            <button 
              onClick={handleJoin}
              disabled={joinStatus === 'loading'}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {joinStatus === 'loading' ? 'Sending...' : 'Join Club'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">About Us</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                {club.description}
              </p>
            </section>

            {/* Events */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-800">
                <Calendar className="w-6 h-6 mr-3 text-primary" /> Upcoming Events
              </h2>
              {club.events?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {club.events.map(event => (
                    <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                      <h4 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{event.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-1 mb-4 line-clamp-2">{event.description}</p>
                      <div className="text-xs font-bold text-primary bg-primary/10 inline-block px-3 py-1.5 rounded-lg border border-primary/20">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium text-sm">No upcoming events scheduled.</p>
                </div>
              )}
            </section>

            {/* Event Gallery */}
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
              <h2 className="text-2xl font-extrabold mb-6 flex items-center text-slate-900 relative z-10">
                <Camera className="w-6 h-6 mr-3 text-primary" /> Event Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 relative z-10">
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm">
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 1" />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm">
                  <img src="https://images.unsplash.com/photo-1511578314322-379a950e1391?q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 2" />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm hidden md:block">
                  <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 3" />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm md:col-span-2">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery 4" />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden group cursor-pointer shadow-sm">
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <span className="text-white font-extrabold text-sm">+12 More</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Faculty Coordinator */}
            {club.facultyCoordinator && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Faculty Coordinator</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
                    {club.facultyCoordinator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{club.facultyCoordinator.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{club.facultyCoordinator.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Openings */}
            <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-4 relative z-10 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> We're Hiring!
              </h3>
              {club.openings?.length > 0 ? (
                <div className="space-y-3 relative z-10">
                  {club.openings.map(opening => (
                    <div key={opening.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-sm text-slate-800">{opening.title}</h4>
                      <button className="text-xs mt-2 text-primary font-bold hover:underline">Apply Now &rarr;</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium relative z-10">No open positions currently.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
