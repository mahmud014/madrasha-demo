import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LayoutDashboard, Bell, Users, Settings, LogOut, Plus, Trash2, Eye, LogIn, Mail, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, setDoc, serverTimestamp, OperationType, handleFirestoreError, FirebaseUser } from '@/firebase';
import { useLanguage } from '@/LanguageContext';

export default function Admin() {
  const { t, language } = useLanguage();
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('notices');
  const [notices, setNotices] = React.useState<any[]>([]);
  const [admissions, setAdmissions] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && (u.email === 'anik955720@gmail.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const [results, setResults] = React.useState<any[]>([]);
  const [settings, setSettings] = React.useState<any>({
    madrasaNameBn: 'মাদ্রাসা ওয়েবসাইট',
    madrasaNameEn: 'Madrasa Website',
    phone: '+৮৮০ ১২৩৪ ৫৬৭৮৯০',
    email: 'info@madrasa.com',
    addressBn: 'ঢাকা, বাংলাদেশ',
    addressEn: 'Dhaka, Bangladesh'
  });

  React.useEffect(() => {
    if (!isAdmin) return;

    const qNotices = query(collection(db, 'notices'), orderBy('date', 'desc'));
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      setNotices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notices'));

    const qAdmissions = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
    const unsubAdmissions = onSnapshot(qAdmissions, (snapshot) => {
      setAdmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'admissions'));

    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    const qResults = query(collection(db, 'results'), orderBy('year', 'desc'));
    const unsubResults = onSnapshot(qResults, (snapshot) => {
      setResults(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'results'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data());
      }
    });

    return () => {
      unsubNotices();
      unsubAdmissions();
      unsubMessages();
      unsubResults();
      unsubSettings();
    };
  }, [isAdmin]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    try {
      await setDoc(doc(db, 'settings', 'general'), data);
      toast.success(t('admin.settingsSuccess'));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
      toast.error(t('admin.settingsError'));
    }
  };

  const handleAddResult = async () => {
    const studentName = prompt(t('admin.promptStudentName'));
    const roll = prompt(t('admin.promptRoll'));
    const gpa = prompt(t('admin.promptGpa'));
    const year = prompt(t('admin.promptYear'));
    const exam = prompt(t('admin.promptExam'));

    if (studentName && roll && gpa && year && exam) {
      try {
        await addDoc(collection(db, 'results'), {
          studentName,
          roll,
          gpa,
          year,
          exam,
          createdAt: serverTimestamp()
        });
        toast.success(t('admin.addSuccess'));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'results');
      }
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'results', id));
        toast.success(t('admin.deleteSuccess'));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `results/${id}`);
      }
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(t('admin.loginSuccess'));
    } catch (error) {
      toast.error(t('admin.loginError'));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.info(t('admin.logoutInfo'));
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'notices', id));
        toast.success(t('admin.deleteSuccess'));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `notices/${id}`);
      }
    }
  };

  const handleAddNotice = async () => {
    const title = prompt(t('admin.promptNoticeTitle'));
    const content = prompt(t('admin.promptNoticeContent'));
    if (title && content) {
      try {
        await addDoc(collection(db, 'notices'), {
          title,
          content,
          date: new Date().toISOString(),
          category: 'general'
        });
        toast.success(t('admin.addSuccess'));
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'notices');
      }
    }
  };

  if (loading) return <div className="py-20 text-center">{t('admin.loading')}</div>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl card-shadow border border-accent/50 w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary">{t('admin.loginTitle')}</h2>
            <p className="text-ink/50 text-sm">{t('admin.loginSubtitle')}</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>{t('admin.loginButton')}</span>
          </button>
          
          {!isAdmin && user && (
            <p className="text-red-500 text-center text-sm font-bold">
              {t('admin.noPermission')}
            </p>
          )}
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

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col md:flex-row">
      {/* Sidebar */}
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white text-primary shadow-lg' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('admin.logout')}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary">
              {activeTab === 'notices' ? t('admin.navNotices') : 
               activeTab === 'results' ? t('admin.navResults') :
               activeTab === 'admissions' ? t('admin.navAdmissions') : 
               activeTab === 'messages' ? t('admin.navMessages') : t('admin.navSettings')}
            </h2>
            {activeTab === 'notices' && (
              <button 
                onClick={handleAddNotice}
                className="bg-secondary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-secondary/20"
              >
                <Plus className="w-5 h-5" />
                <span>{t('admin.addNotice')}</span>
              </button>
            )}
            {activeTab === 'results' && (
              <button 
                onClick={handleAddResult}
                className="bg-secondary text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-secondary/20"
              >
                <Plus className="w-5 h-5" />
                <span>{t('admin.addResult')}</span>
              </button>
            )}
          </div>

          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.tableSender')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableSubject')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableDate')}</th>
                    <th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {messages.map((msg, i) => (
                    <tr key={msg.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-ink">{msg.name}</div>
                        <div className="text-xs text-ink/50">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4 text-ink/70 text-sm truncate max-w-[200px]">{msg.subject}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => alert(`${t('contact.formMessage')}: ${msg.message}`)}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if(confirm(t('admin.confirmDelete'))) {
                              await deleteDoc(doc(db, 'messages', msg.id));
                              toast.success(t('admin.deleteSuccess'));
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoMessages')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.tableNoticeTitle')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableDate')}</th>
                    <th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {notices.map((notice, i) => (
                    <tr key={notice.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{notice.title}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">
                        {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button 
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {notices.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoNotices')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.tableStudentName')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableDepartment')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tablePhone')}</th>
                    <th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {admissions.map((app, i) => (
                    <tr key={app.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{app.studentName}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{app.department}</td>
                      <td className="px-6 py-4 text-ink/50 text-sm">{app.phone}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {admissions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoAdmissions')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-3xl card-shadow border border-accent/50 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-primary">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('admin.tableStudentName')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableRoll')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableGpa')}</th>
                    <th className="px-6 py-4 font-bold">{t('admin.tableYear')}</th>
                    <th className="px-6 py-4 font-bold text-right">{t('admin.tableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {results.map((res: any) => (
                    <tr key={res.id} className="hover:bg-accent/10 transition-colors">
                      <td className="px-6 py-4 text-ink font-medium">{res.studentName}</td>
                      <td className="px-6 py-4 text-ink/70">{res.roll}</td>
                      <td className="px-6 py-4 text-ink/70">{res.gpa}</td>
                      <td className="px-6 py-4 text-ink/70">{res.year}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleDeleteResult(res.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-ink/30">{t('admin.tableNoResults')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl card-shadow border border-accent/50">
              <form onSubmit={saveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('admin.settingsMadrasaNameBn')}</label>
                    <input
                      name="madrasaNameBn"
                      defaultValue={settings.madrasaNameBn}
                      className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('admin.settingsMadrasaNameEn')}</label>
                    <input
                      name="madrasaNameEn"
                      defaultValue={settings.madrasaNameEn}
                      className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('admin.settingsPhone')}</label>
                    <input
                      name="phone"
                      defaultValue={settings.phone}
                      className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('admin.settingsEmail')}</label>
                    <input
                      name="email"
                      defaultValue={settings.email}
                      className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">{t('admin.settingsAddressBn')}</label>
                  <input
                    name="addressBn"
                    defaultValue={settings.addressBn}
                    className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">{t('admin.settingsAddressEn')}</label>
                  <input
                    name="addressEn"
                    defaultValue={settings.addressEn}
                    className="w-full px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">{t('admin.settingsHeroImageUrl')}</label>
                  <div className="flex gap-2">
                    <input
                      id="heroImageUrl"
                      name="heroImageUrl"
                      defaultValue={settings.heroImageUrl}
                      className="flex-1 px-4 py-3 rounded-xl border border-accent bg-accent/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                    <label className="cursor-pointer bg-accent hover:bg-accent/80 text-primary font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              toast.error('Image size must be less than 1MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              const input = document.getElementById('heroImageUrl') as HTMLInputElement;
                              if (input) {
                                input.value = base64;
                                toast.success('Image uploaded successfully. Click save to apply.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-ink/50 italic">You can paste an image URL or upload a file (max 1MB).</p>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20"
                >
                  {t('admin.settingsSave')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
