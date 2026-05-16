import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Book, Briefcase, Award, Settings, LogOut, Code, Calendar, CheckCircle, Clock, Users, X, Camera, Sparkles, ArrowRight, Flame, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('campusToken');
      const res = await axios.get('http://localhost:5005/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed text-white flex font-sans selection:bg-amber-500/30 relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')" }}>
      {/* Moderate Dark Blue Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md pointer-events-none z-0" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-72 bg-slate-800/60 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col shadow-xl z-10 relative"
      >
        <div className="flex items-center space-x-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <User className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">SmartCampus</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon={<User className="w-5 h-5"/>} label="Profile" active={location.pathname === '/dashboard'} />
          <NavItem to="/clubs" icon={<Briefcase className="w-5 h-5"/>} label="Clubs" active={location.pathname === '/clubs'} />
          <NavItem to="/events" icon={<Award className="w-5 h-5"/>} label="Events" active={location.pathname === '/events'} />
          <NavItem to="/leaderboard" icon={<Trophy className="w-5 h-5"/>} label="Leaderboard" active={location.pathname === '/leaderboard'} />
          <NavItem to="/bookings" icon={<Calendar className="w-5 h-5"/>} label="Book Auditoriums" active={location.pathname === '/bookings'} />
          {user?.role === 'SUPER_ADMIN' || user?.role === 'FACULTY' || user?.role === 'CLUB_ADMIN' ? (
            <div className="pt-6 pb-2">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Moderation</p>
              <NavItem to="/admin/bookings" icon={<CheckCircle className="w-5 h-5"/>} label="Manage Bookings" active={location.pathname === '/admin/bookings'} />
              <NavItem to="/admin/clubs" icon={<Users className="w-5 h-5"/>} label="Club Requests" active={location.pathname === '/admin/clubs'} />
              {user?.role === 'SUPER_ADMIN' && (
                <NavItem to="/admin/super" icon={<Settings className="w-5 h-5"/>} label="Super Admin" active={location.pathname === '/admin/super'} />
              )}
            </div>
          ) : null}
        </nav>

        <button onClick={logout} className="flex items-center space-x-3 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 p-3.5 rounded-xl transition-all shadow-sm w-full font-bold">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 relative z-10 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Welcome back, {user?.name} 👋</h1>
              <p className="text-slate-300 mt-2 text-lg font-bold drop-shadow-sm">Here is what's happening on campus today.</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="hidden md:flex bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-white border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </header>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mb-8 relative overflow-hidden shadow-xl"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 rounded-[1.5rem] bg-slate-700 border-4 border-slate-600 shadow-xl flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-white">{profile?.name || user?.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-slate-300 text-sm font-bold">
                    <span className="flex items-center space-x-1.5 bg-slate-900/50 px-4 py-2 rounded-xl shadow-sm border border-white/5">
                      <Book className="w-4 h-4 text-amber-500"/> <span>{profile?.department || 'Computer Science'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-slate-900/50 px-4 py-2 rounded-xl shadow-sm border border-white/5 uppercase">
                      <Award className="w-4 h-4 text-amber-500"/> <span>{user?.role}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl shadow-sm border border-amber-500/20">
                      <Flame className="w-4 h-4"/> <span className="font-black">{profile?.points || 0} PTS</span>
                    </span>
                  </div>
                  <p className="mt-5 text-sm md:text-base max-w-2xl leading-relaxed text-slate-300 font-medium">
                    {profile?.bio || "Passionate engineering student looking to collaborate on open-source projects and join technical clubs."}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="mt-8 flex flex-wrap gap-2 relative z-10">
              {(profile?.skills ? profile.skills.split(',') : ['React.js', 'Node.js', 'PostgreSQL', 'Framer Motion', 'Tailwind CSS']).map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/5 shadow-sm rounded-xl text-xs font-bold flex items-center space-x-1.5 text-slate-300">
                  <Code className="w-3.5 h-3.5 text-amber-500" />
                  <span>{skill.trim()}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {user?.role !== 'FACULTY' && user?.role !== 'SUPER_ADMIN' ? (
            <>
              {/* AI Recommendations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                <div className="flex items-center mb-6 relative z-10">
                  <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-amber-500 mr-4 shadow-md border border-white/5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Recommendations</h2>
                    <p className="text-sm text-slate-300 font-bold mt-0.5">Personalized suggestions based on your profile skills</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all flex justify-between items-center group cursor-pointer">
                    <div>
                      <h4 className="font-extrabold text-lg text-white group-hover:text-amber-500 transition-colors">Byte Club</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">98% Match • Technical Club</p>
                    </div>
                    <Link to="/clubs" className="text-white bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">View</Link>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-sm hover:shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all flex justify-between items-center group cursor-pointer">
                    <div>
                      <h4 className="font-extrabold text-lg text-white group-hover:text-amber-500 transition-colors">National Tech Symposium</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">Event • Next Week</p>
                    </div>
                    <Link to="/events" className="text-white bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">View</Link>
                  </div>
                </div>
              </motion.div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <BentoCard title="Joined Clubs" count={profile?.clubMemberships?.filter(m => m.status === 'APPROVED')?.length || 0} icon={<Briefcase className="w-7 h-7"/>} />
                <BentoCard title="Active Bookings" count={profile?.bookings?.length || 0} icon={<Calendar className="w-7 h-7"/>} />
                <BentoCard title="Upcoming Events" count={profile?.eventRegistrations?.length || 0} icon={<Award className="w-7 h-7"/>} />
              </div>

              {/* My Bookings Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-extrabold flex items-center text-white">
                    <Calendar className="w-6 h-6 mr-3 text-amber-500" /> My Booking Requests
                  </h2>
                  <Link to="/bookings" className="text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    + New Booking
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {profile?.bookings?.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-amber-500/30 hover:bg-slate-800 transition-all group">
                      <div className="flex items-center space-x-5">
                        <div className="w-12 h-12 rounded-[1rem] bg-slate-800 border border-white/5 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{booking.auditorium.name}</h4>
                          <p className="text-xs text-slate-400 font-bold mt-1">{new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${
                        booking.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        booking.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
                {(!profile?.bookings || profile.bookings.length === 0) && (
                  <div className="p-10 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-[2rem]">
                    <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-300 text-base font-bold mb-4">You haven't made any booking requests yet.</p>
                    {user?.role === 'CLUB_ADMIN' || user?.role === 'FACULTY' ? (
                      <Link to="/bookings" className="inline-flex text-sm font-extrabold text-amber-500 hover:text-amber-400 items-center">
                        Book an Auditorium Now <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    ) : (
                      <p className="text-sm font-bold text-slate-400">Only Club Admins can book auditoriums.</p>
                    )}
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between h-64 group hover:bg-slate-800 transition-all">
                <div>
                  <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Review Bookings</h3>
                  <p className="text-slate-400 font-bold mt-2 text-sm">Manage auditorium and space requests securely.</p>
                </div>
                <Link to="/admin/bookings" className="bg-white hover:bg-slate-100 text-slate-900 self-start px-6 py-3 rounded-xl font-extrabold transition-all shadow-md text-sm flex items-center">
                  Go to Bookings <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between h-64 group hover:bg-slate-800 transition-all">
                <div>
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Club Requests</h3>
                  <p className="text-slate-400 font-bold mt-2 text-sm">Approve or deny pending student club memberships.</p>
                </div>
                <Link to="/admin/clubs" className="bg-white hover:bg-slate-100 text-slate-900 self-start px-6 py-3 rounded-xl font-extrabold transition-all shadow-md text-sm flex items-center">
                  Manage Clubs <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <EditProfileModal 
            profile={profile} 
            onClose={() => setIsEditing(false)} 
            onSave={() => { setIsEditing(false); fetchProfile(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditProfileModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    department: profile?.department || '',
    bio: profile?.bio || '',
    skills: profile?.skills || '',
    avatar: profile?.avatar || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('campusToken');
      await axios.put('http://localhost:5005/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave();
    } catch (error) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-800 rounded-[2rem] border border-white/10 p-8 w-full max-w-lg shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-slate-700 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-white">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-[1rem] bg-slate-900 border border-white/10 overflow-hidden relative group">
              {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Avatar URL</label>
            <input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
              <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm h-24 resize-none font-medium outline-none" placeholder="Tell us about yourself..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Skills (Comma Separated)</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 text-white text-sm font-medium outline-none" placeholder="React, Node.js, Design" />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-white hover:bg-slate-200 text-slate-900 rounded-xl py-3.5 text-sm font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 mt-4">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} className={`flex items-center space-x-4 p-3.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function BentoCard({ title, count, icon }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group cursor-pointer shadow-xl transition-all"
    >
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="w-12 h-12 bg-slate-700 rounded-2xl text-slate-300 border border-white/5 flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-4xl font-black mb-2 relative z-10 text-white">{count}</h3>
      <p className="text-slate-300 font-bold relative z-10">{title}</p>
    </motion.div>
  );
}
