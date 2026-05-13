'use client';

import React, { useEffect, useState } from 'react';
import { incidentsApi } from '@/lib/api';

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  async function loadIncidents() {
    setLoading(true);
    try {
      const res = await incidentsApi.getAll();
      setIncidents(res.data ? res.data.content || res.data : res.data || []);
    } catch (e) {
      console.error(e);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: number, newStatus: string) {
    try {
      await incidentsApi.changeStatus(id, newStatus);
      alert('Statut mis à jour!');
      loadIncidents();
    } catch (error: any) {
      alert('Erreur: ' + (error?.response?.data?.message || error?.message || ''));
    }
  }

  async function deleteIncident(id: number) {
    if (!confirm('Supprimer cet incident?')) return;
    try {
      await incidentsApi.delete(id);
      alert('Incident supprimé!');
      loadIncidents();
    } catch (error: any) {
      alert('Erreur: ' + (error?.response?.data?.message || error?.message || ''));
    }
  }

  if (loading) return <div>Chargement incidents...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion Incidents (Admin)</h1>

      <table className="w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Réf</th>
            <th className="p-2">Titre</th>
            <th className="p-2">Catégorie</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident: any) => (
            <tr key={incident.id} className="border-t">
              <td className="p-2">{incident.referenceCode || incident.reference || incident.id}</td>
              <td className="p-2">{incident.title || incident.description}</td>
              <td className="p-2">{incident.category?.name || '-'}</td>
              <td className="p-2">
                <select
                  value={incident.status}
                  onChange={(e) => changeStatus(incident.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="SIGNALE">🔴 Signalé</option>
                  <option value="EN_COURS">🟡 En cours</option>
                  <option value="RESOLU">🟢 Résolu</option>
                  <option value="FERME">⚫ Fermé</option>
                </select>
              </td>
              <td className="p-2">{incident.createdAt ? new Date(incident.createdAt).toLocaleString() : '-'}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteIncident(incident.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
