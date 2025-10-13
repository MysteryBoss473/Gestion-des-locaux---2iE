'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

interface BatimentFormData {
  site: string;
  designation: string;
}

export default function EditBatiment() {
  const params = useParams();
  const idBatiment = params.idBatiment as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BatimentFormData>({
    site: '',
    designation: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchBatiment = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/batiments/${idBatiment}`);
          if (!response.ok) {
            throw new Error('Bâtiment non trouvé');
          }
          const data = await response.json();
          setFormData({
            site: data.site,
            designation: data.designation,
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBatiment();
    }
  }, [idBatiment, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch(`http://localhost:5000/api/batiments/${idBatiment}`, {
        method: 'PUT',
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

  // Rendu du composant
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl font-semibold">
          Accès refusé
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">
            Modifier le bâtiment {params.idBatiment}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
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
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}