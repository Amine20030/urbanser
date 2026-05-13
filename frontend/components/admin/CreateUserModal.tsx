'use client';

import React, { useState } from 'react';

type Props = {
  onClose: () => void;
  onCreate: (data: any) => void;
};

export default function CreateUserModal({ onClose, onCreate }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [phone, setPhone] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onCreate({ firstName, lastName, email, password, role, phone });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-4">Créer un utilisateur</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Prénom</label>
            <input className="w-full border px-2 py-1" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Nom</label>
            <input className="w-full border px-2 py-1" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input type="email" className="w-full border px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Mot de passe</label>
            <input type="password" className="w-full border px-2 py-1" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Rôle</label>
            <select className="w-full border px-2 py-1" value={role} onChange={e => setRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="CITIZEN">CITIZEN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Téléphone</label>
            <input className="w-full border px-2 py-1" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1">Annuler</button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
