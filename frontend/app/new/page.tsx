'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

interface BatimentFormData {
  idBatiment: string;
  site: string;
  designation: string;
}

export default function CreateBatiment() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BatimentFormData>({
    idBatiment: '',
    site: '',
    designation: '',
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl font-semibold">
          Accès refusé
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch('http://localhost:5000/api/batiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Redirection vers la page principale après succès
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Ajouter un nouveau bâtiment</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="idBatiment" className="block text-sm font-medium text-gray-700 mb-1">
                Identifiant
              </label>
              <input
                type="text"
                id="idBatiment"
                name="idBatiment"
                required
                maxLength={20}
                value={formData.idBatiment}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ex: BAT001 (max 20 caractères)"
              />
            </div>

            <div>
              <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <input
                type="text"
                id="site"
                name="site"
                required
                maxLength={20}
                value={formData.site}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ex: Site Principal (max 20 caractères)"
              />
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                Désignation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                required
                maxLength={100}
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ex: Bâtiment Administration (max 100 caractères)"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="ghost" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le bâtiment
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}