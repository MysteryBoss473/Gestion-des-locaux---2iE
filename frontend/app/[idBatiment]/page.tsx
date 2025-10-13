'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { useAuth } from '../../hooks/useAuth';

interface Salle {
  idSalle: string;
  fonction: string;
  occupant: string;
}

export default function BatimentPage() {
  const params = useParams();
  const idBatiment = params.idBatiment as string;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5000/api/salles/batiment/${idBatiment}`);
        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 404) {
            setSalles([]);
            if (data.message === 'Bâtiment non trouvé') {
              throw new Error('Ce bâtiment n\'existe pas');
            } else {
              // Si aucune salle n'est trouvée, ce n'est pas une erreur
              return;
            }
          }
          throw new Error(data.message || 'Erreur lors du chargement des salles');
        }
        
        setSalles(data.salles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setSalles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, [idBatiment]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRetour = () => {
    router.push('/');
  };

  const { isAuthenticated, redirectToLogin } = useAuth();

  const handleAdd = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    router.push(`/${idBatiment}/new`);
  };

  const handleEdit = (idSalle: string) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    router.push(`/${idBatiment}/${idSalle}/edit`);
  };

  const handleDelete = async (idSalle: string) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/salles/${idSalle}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setSalles(salles.filter(s => s.idSalle !== idSalle));
      setShowDeleteConfirmation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setShowDeleteConfirmation(null);
    }
  };

  const filteredSalles = searchQuery
    ? salles.filter((salle: Salle) =>
        salle.idSalle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salle.fonction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salle.occupant.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : salles;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <Button onClick={handleRetour} variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2">
            ← Retour
          </Button>
          <h1 className="text-3xl font-bold text-center">
            Salles du bâtiment {idBatiment}
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Rechercher une salle (Identifiant, fonction ou occupant)..." />
          </div>
          <Button onClick={handleAdd}>
            Ajouter une salle
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            Chargement...
          </div>
        ) : filteredSalles.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Aucune salle trouvée.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupant
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalles.map((salle: Salle) => (
                <tr 
                  key={salle.idSalle}
                  onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    // Ne pas naviguer si le clic est sur le conteneur des boutons
                    if (!(e.target as HTMLElement).closest('.actions-container')) {
                      router.push(`/${params.idBatiment}/${salle.idSalle}`);
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{salle.idSalle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{salle.fonction}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{salle.occupant || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2 actions-container">
                    <Button
                      variant="edit"
                      onClick={() => handleEdit(salle.idSalle)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="delete"
                      onClick={() => setShowDeleteConfirmation(salle.idSalle)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirmation !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirmation(null)}
                >
                  Annuler
                </Button>
                <Button
                  variant="delete"
                  onClick={() => handleDelete(showDeleteConfirmation)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}