'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface SearchResult {
  idSalle: string;
  fonction: string;
  idBatiment: string;
  occupant: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('search');
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      try {
        console.log('Recherche de:', query);
        const response = await fetch(`http://localhost:5000/api/salles/search?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Aucun résultat trouvé');
            setResults([]);
            return;
          }
          throw new Error(data.message || 'Erreur lors de la recherche');
        }
        
        // Traitement des résultats
        const salles = data.sallesAvecDetails || [];
        console.log('Résultats trouvés:', salles);
        setResults(salles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Recherche</h1>
          <p className="text-gray-600">Utilisez la barre de recherche pour trouver une salle.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Résultats de recherche pour "{query}"
          </h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Recherche en cours...' : 
             error ? 'Une erreur est survenue' :
             `${results.length} résultat${results.length !== 1 ? 's' : ''} trouvé${results.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            Chargement...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Aucun résultat trouvé pour cette recherche.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bâtiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupant
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr 
                      key={`${result.idBatiment}-${result.idSalle}`}
                      onClick={() => router.push(`/${result.idBatiment}/${result.idSalle}`)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.idSalle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.idBatiment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.fonction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.occupant}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
