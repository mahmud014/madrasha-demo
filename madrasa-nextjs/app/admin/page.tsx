'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Lock, Bell, Users, Settings, LogOut, Plus, Trash2, Eye, LogIn, Mail, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, setDoc, serverTimestamp, OperationType, handleFirestoreError, FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';

export default function Admin() {
  const { t, language } = useLanguage();
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('notices');
  const [notices, setNotices] = React.useState<any[]>([]);
  const [admissions, setAdmissions] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<any>({
    madrasaNameBn: 'মাদ্রাসা ওয়েবসাইট', madrasaNameEn: 'Madrasa Website',
    phone: '+৮৮০ ১২৩৪ ৫৬৭৮৯০', email: 'info@madrasa.com',
    addressBn: 'ঢাকা, বাংলাদেশ', addressEn: 'Dhaka, Bangladesh'
  });

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setIsAdmin(!!u); setLoading(false); });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (!isAdmin) return;
    const unsubs = [
      onSnapshot(query(collection(db, 'notices'), orderBy('date', 'desc')), (s) => setNotices(s.docs.map(d => ({ id: d.id, ...d.data() }))), (e) => handleFirestoreError(e, OperationType.LIST, 'notices')),
      onSnapshot(query(collection(db, 'admissions'), orderBy('createdAt', 'desc')), (s) => setAdmissions(s.docs.map(d => ({ id: d.id, ...d.data() }))), (e) => handleFirestoreError(e, OperationType.LIST, 'admissions')),
      onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))), (e) => handleFirestoreError(e, OperationType.LIST, 'messages')),
      onSnapshot(query(collection(db, 'results'), orderBy('year', 'desc')), (s) => setResults(s.docs.map(d => ({ id: d.id, ...d.data() }))), (e) => handleFirestoreError(e, OperationType.LIST, 'results')),
      onSnapshot(doc(db, 'settings', 'general'), (s) => { if (s.exists()) setSettings(s.data()); }),
    ];
    return () => unsubs.forEach(u => u());
  }, [isAdmin]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isSignUp) { await createUserWithEmailAndPassword(auth, email, password); toast.success('Account created'); }
      else { await signInWithEmailAndPassword(auth, email, password); toast.success(t('admin.loginSuccess')); }
    } catch (error: any) { setAuthError(error.message); toast.error(error.message); }
  };

  const handleGoogleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); toast.success(t('admin.loginSuccess')); }
    catch (error: any) { setAuthError(error.message); toast.error(t('admin.loginError')); }
  };

  const handleLogout = async () => { await signOut(auth); toast.info(t('admin.logoutInfo')); };

  const handleAddNotice = async () => {
    const title = prompt(t('admin.promptNoticeTitle'));
    const content = prompt(t('admin.promptNoticeContent'));
    if (title && content) {
      try { await addDoc(collection(db, 'notices'), { title, content, date: new Date().toISOString(), category: 'general' }); toast.success(t('admin.addSuccess')); }
      catch (err) { handleFirestoreError(err, OperationType.CREATE, 'notices'); }
    }
  };

  const handleAddResult = async () => {
    const studentName = prompt(t('admin.promptStudentName'));
    const roll = prompt(t('admin.promptRoll'));
    const gpa = prompt(t('admin.promptGpa'));
    const year = prompt(t('admin.promptYear'));
    const exam = prompt(t('admin.promptExam'));
    if (studentName && roll && gpa && year && exam) {
      try { await addDoc(collection(db, 'results'), { studentName, roll, gpa, year, exam, createdAt: serverTimestamp() }); toast.success(t('admin.addSuccess')); }
      catch (err) { handleFirestoreError(err, OperationType.CREATE, 'results'); }
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try { await deleteDoc(doc(db, collectionName, id)); toast.success(t('admin.deleteSuccess')); }
      catch (err) { handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`); }
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    try { await setDoc(doc(db, 'settings', 'general'), data); toast.success(t('admin.settingsSuccess')); }
    catch (err) { handleFirestoreError(err, OperationType.WRITE, 'settings/general'); toast.error(t('admin.settingsError')); }
  };

  if (loading) return <div className="py-20 text-center">{t('admin.loading')}</div>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto"><Lock className="w-8 h-8" /></div>
            <h2 className="text-2xl font-bold text-primary">{t('admin.loginTitle')}</h2>
            <p className="text-ink/50 text-sm">{t('admin.loginSubtitle')}</p>
          </div>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">{t('admin.loginEmail')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">{t('admin.loginPassword')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors">
              <LogIn className="w-5 h-5" /><span>{isSignUp ? 'Sign Up' : t('admin.loginSubmit')}</span>
            </button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-ink/30">{t('admin.loginOr')}</span></div>
          </div>
          <button onClick={handleGoogleLogin} className="w-full bg-white border border-accent text-ink font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-accent/10 transition-colors">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /><span>{t('admin.loginButton')}</span>
          </button>
          <div className="text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary text-sm font-medium hover:underline">
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
          {authError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-mono break-all">Error: {authError}</div>}
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'notices', name: t('admin.navNotices'), icon: Bell },
    { id: 'results', name: t('admin.navResults'), icon: ClipboardList },
    { id: 'admissions', name: t('admin.navAdmissions'), icon: Users },
    { id: 'messages', name: t('admin.navMessages'), icon: Mail },
    { id: 'settings', name: t('admin.navSettings'), icon: Settings },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-primary text-white p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="User" /> : 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight">{t('admin.sidebarTitle')}</span>
            <span className="text-[10px] text-white/50 truncate max-w-[120px]">{user.email}</span>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white text-primary shadow-lg' : 'text-white/70 hover:bg-white/10'}`}>
              <item.icon className="w-5 h-5" /><span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <LogOut className="w-5 h-5" /><span className="font-medium">{t('admin.logout')}</span>
        </button>
      </div>

      <div className="flex-1 p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary">{navItems.find(n => n.id === activeTab)?.name}</h2>
            {activeTab === 'notices' && (
              <button onClick={handleAddNotice} className="bg-secondary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-secondary/20">
                <Plus className="w-5 h-5" /><span>{t('admin.addNotice')}</span>
              </button>
            )}
            {activeTab === 'results' && (
              <button onClick={handleAddResult} className="bg-secondary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-secondary/20">
                <Plus className="w-5 h-5" /><span>{t('admin.addResult')}</span>
              </button>
            )}
          </div>

          {activeTab === 'notices' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr><th className="px-6 py-4 font-bold">{t('admin.tableNoticeTitle')}</th><th className="px-6 py-4 font-bold">{t('admin.tableDate')}</th><th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th></tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{notice.title}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('notices', notice.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {notices.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoNotices')}</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr><th className="px-6 py-4 font-bold">{t('admin.tableStudentName')}</th><th className="px-6 py-4 font-bold">{t('admin.tableRoll')}</th><th className="px-6 py-4 font-bold">{t('admin.tableGpa')}</th><th className="px-6 py-4 font-bold">{t('admin.tableYear')}</th><th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th></tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{res.studentName}</td>
                      <td className="px-6 py-4 text-ink/70">{res.roll}</td>
                      <td className="px-6 py-4 text-ink/70">{res.gpa}</td>
                      <td className="px-6 py-4 text-ink/70">{res.year}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => handleDelete('results', res.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {results.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoResults')}</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr><th className="px-6 py-4 font-bold">{t('admin.tableStudentName')}</th><th className="px-6 py-4 font-bold">{t('admin.tableDepartment')}</th><th className="px-6 py-4 font-bold">{t('admin.tablePhone')}</th><th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th></tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {admissions.map((app) => (
                    <tr key={app.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{app.studentName}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{app.department}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{app.phone}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('admissions', app.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {admissions.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoAdmissions')}</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr><th className="px-6 py-4 font-bold">{t('admin.tableSender')}</th><th className="px-6 py-4 font-bold">{t('admin.tableSubject')}</th><th className="px-6 py-4 font-bold">{t('admin.tableDate')}</th><th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th></tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4"><div className="font-medium text-ink">{msg.name}</div><div className="text-xs text-ink/50">{msg.email}</div></td>
                      <td className="px-6 py-4 text-ink/70 text-sm truncate max-w-[200px]">{msg.subject}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'N/A'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => alert(`Message: ${msg.message}`)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('messages', msg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoMessages')}</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50">
              <form onSubmit={saveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsMadrasaNameBn')}</label><input name="madrasaNameBn" defaultValue={settings.madrasaNameBn} className={inputClass} /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsMadrasaNameEn')}</label><input name="madrasaNameEn" defaultValue={settings.madrasaNameEn} className={inputClass} /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsPhone')}</label><input name="phone" defaultValue={settings.phone} className={inputClass} /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsEmail')}</label><input name="email" defaultValue={settings.email} className={inputClass} /></div>
                </div>
                <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsAddressBn')}</label><input name="addressBn" defaultValue={settings.addressBn} className={inputClass} /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-primary">{t('admin.settingsAddressEn')}</label><input name="addressEn" defaultValue={settings.addressEn} className={inputClass} /></div>
                <button type="submit" className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20">{t('admin.settingsSave')}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
