'use client';

import React, { useEffect, useState } from 'react';
import { adminUsersApi } from '@/lib/api';
import CreateUserModal from '@/components/admin/CreateUserModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await adminUsersApi.getAll();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function createUser(formData: any) {
    try {
      await adminUsersApi.create(formData);
      alert('Utilisateur créé!');
      setShowCreate(false);
      loadUsers();
    } catch (e: any) {
      alert('Erreur: ' + (e?.response?.data?.message || e.message || ''));
    }
  }

  async function deleteUser(id: number) {
    if (!confirm('Supprimer cet utilisateur?')) return;
    try {
      await adminUsersApi.delete(id);
      alert('Utilisateur supprimé!');
      loadUsers();
    } catch (e: any) {
      alert('Erreur: ' + (e?.response?.data?.message || e.message || ''));
    }
  }

  if (loading) return <div>Chargement utilisateurs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion Utilisateurs (Admin)</h1>
        <button onClick={() => setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded">+ Ajouter Utilisateur</button>
      </div>

      <table className="w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Nom</th>
            <th className="p-2">Rôle</th>
            <th className="p-2">Téléphone</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.firstName} {u.lastName}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.phone || '-'}</td>
              <td className="p-2">{u.active ? 'Actif' : 'Inactif'}</td>
              <td className="p-2">
                <button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreate && (
        <CreateUserModal onClose={() => setShowCreate(false)} onCreate={createUser} />
      )}
    </div>
  );
}
