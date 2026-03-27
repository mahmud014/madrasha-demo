'use client';

import React from 'react';
import { db, doc, setDoc, onSnapshot } from '@/lib/firebase';

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<any>({
    madrasaNameEn: '',
    madrasaNameBn: '',
    phone: '',
    email: '',
    addressEn: '',
    addressBn: '',
  });

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data());
      }
    });

    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, 'settings', 'general'), settings);
    alert('Saved!');
  };

  return (
    <form onSubmit={save} className="space-y-4 max-w-xl">
      <input
        name="madrasaNameEn"
        value={settings.madrasaNameEn}
        onChange={handleChange}
        placeholder="Madrasa Name (EN)"
        className="w-full border p-3 rounded"
      />

      <input
        name="madrasaNameBn"
        value={settings.madrasaNameBn}
        onChange={handleChange}
        placeholder="Madrasa Name (BN)"
        className="w-full border p-3 rounded"
      />

      <input
        name="phone"
        value={settings.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border p-3 rounded"
      />

      <input
        name="email"
        value={settings.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-3 rounded"
      />

      <input
        name="addressEn"
        value={settings.addressEn}
        onChange={handleChange}
        placeholder="Address EN"
        className="w-full border p-3 rounded"
      />

      <input
        name="addressBn"
        value={settings.addressBn}
        onChange={handleChange}
        placeholder="Address BN"
        className="w-full border p-3 rounded"
      />

      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded"
      >
        Save Settings
      </button>
    </form>
  );
}