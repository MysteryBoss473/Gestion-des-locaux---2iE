'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

interface Batiment {
  idBatiment: string;
  site: string;
  designation: string;
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isActionButtonHovered, setIsActionButtonHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batiments, setBatiments] = useState<Batiment[]>([]);

  useEffect(() => {
    const fetchBatiments = async () => {
      try {
        setError(null);
        const response = await fetch('http://localhost:5000/api/batiments');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des bâtiments');
        }
        const data = await response.json();
        setBatiments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchBatiments();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredBatiments = searchQuery 
    ? batiments.filter((batiment: Batiment) =>
        batiment.idBatiment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batiment.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batiment.site.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : batiments;

  const { isAuthenticated, redirectToLogin } = useAuth();

  const handleAdd = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    router.push('/new');
  };

  const handleEdit = (idBatiment: string) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    router.push(`/${idBatiment}/edit`);
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  const handleDelete = async (idBatiment: string) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/batiments/${idBatiment}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setBatiments(batiments.filter(b => b.idBatiment !== idBatiment));
      setShowDeleteConfirmation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bâtiments</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Rechercher un bâtiment (Identifiant, site ou désignation)..." />
          </div>
          {isAuthenticated && (
            <Button onClick={handleAdd}>
              Ajouter un bâtiment
            </Button>
          )}
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            Chargement...
          </div>
        ) : filteredBatiments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Aucun bâtiment trouvé.
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
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Désignation
                  </th>
                  {isAuthenticated && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBatiments.map((batiment: Batiment) => (
                <tr 
                  key={batiment.idBatiment}
                  className={`hover:bg-gray-50 ${!isActionButtonHovered ? 'cursor-pointer' : ''}`}
                  onClick={() => !isActionButtonHovered && router.push(`/${batiment.idBatiment}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{batiment.idBatiment}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batiment.site}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{batiment.designation}</td>
                  {isAuthenticated && (
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <span 
                        onMouseEnter={() => setIsActionButtonHovered(true)}
                        onMouseLeave={() => setIsActionButtonHovered(false)}
                      >
                        <Button
                          variant="edit"
                          onClick={() => handleEdit(batiment.idBatiment)}
                        >
                          Modifier
                        </Button>
                      </span>
                      <span
                        onMouseEnter={() => setIsActionButtonHovered(true)}
                        onMouseLeave={() => setIsActionButtonHovered(false)}
                      >
                        <Button
                          variant="delete"
                          onClick={() => setShowDeleteConfirmation(batiment.idBatiment)}
                        >
                          Supprimer
                        </Button>
                      </span>
                    </td>
                  )}
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
                Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible.
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
    </main>
  );
}
