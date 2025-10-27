'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

interface SalleDetails {
  salle: {
    idSalle: string;
    fonction: string;
    occupant: string;
    plafond: number;
    prises: number;
    pointsWifi: number;
    ventilateurs: number;
    climatiseurs: number;
  };
  portes: Array<{
    id: number;
    nombre: number;
    typePorte: string;
  }>;
  fenetres: Array<{
    id: number;
    nombre: number;
    typeFenetre: string;
  }>;
  murs: Array<{
    id: number;
    surface: number;
    typeMur: string;
  }>;
  sols: Array<{
    id: number;
    surface: number;
    typeSol: string;
  }>;
  lampes: Array<{
    id: number;
    nombre: number;
    typeLampe: string;
  }>;
}

export default function SallePage() {
  const router = useRouter();
  const params = useParams();
  const { idBatiment, idSalle } = params;
  const [salleDetails, setSalleDetails] = useState<SalleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchSalleDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/salles/${params.idSalle}`);
        if (!response.ok) {
          throw new Error('Salle non trouvée');
        }
        const data = await response.json();
        setSalleDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchSalleDetails();
  }, [params.idBatiment, params.idSalle]);

  const handleRetour = () => {
    router.push(`/${params.idBatiment}`);
  };

  const { isAuthenticated, redirectToLogin } = useAuth();

  const handleEdit = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    router.push(`/${idBatiment}/${idSalle}/edit`);
  };

  const handleDelete = async () => {
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

      // Redirection vers la page du bâtiment après la suppression
      router.push(`/${idBatiment}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setShowDeleteConfirmation(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <Button onClick={handleRetour} className="mt-4">Retour</Button>
      </div>
    );
  }

  if (!salleDetails) {
    return <div className="text-center py-8">Aucune donnée disponible</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <Button onClick={handleRetour} variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2">
            ← Retour
          </Button>
          <h1 className="text-3xl font-bold text-center">
            Détails de la salle {salleDetails.salle.idSalle}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          {/* Informations générales */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            <div className="space-y-6">
              {/* Fonction */}
              <div>
                <h3 className="text-lg font-medium mb-2">Fonction</h3>
                <p className="font-medium">{salleDetails.salle.fonction}</p>
              </div>

              {/* Occupant */}
              <div>
                <h3 className="text-lg font-medium mb-2">Occupant</h3>
                <p className="font-medium">{salleDetails.salle.occupant}</p>
              </div>
            </div>
          </div>

          {/* BTP */}
          <div>
            <h2 className="text-xl font-semibold mb-4">BTP</h2>
            <div className="space-y-6">
              {/* Surface du plafond */}
              <div>
                <h3 className="text-lg font-medium mb-2">Surface du plafond</h3>
                <p className="font-medium">{salleDetails.salle.plafond} m²</p>
              </div>

              {/* Sols */}
              <div>
                <h3 className="text-lg font-medium mb-2">Sols</h3>
                <div className="space-y-2">
                  {salleDetails.sols.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.typeSol}</span>
                      <span>{item.surface} m²</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Murs */}
              <div>
                <h3 className="text-lg font-medium mb-2">Murs</h3>
                <div className="space-y-2">
                  {salleDetails.murs.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.typeMur}</span>
                      <span>{item.surface} m²</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portes */}
              <div>
                <h3 className="text-lg font-medium mb-2">Portes</h3>
                <div className="space-y-2">
                  {salleDetails.portes.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.typePorte}</span>
                      <span>{item.nombre} unité{item.nombre > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fenêtres */}
              <div>
                <h3 className="text-lg font-medium mb-2">Fenêtres</h3>
                <div className="space-y-2">
                  {salleDetails.fenetres.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.typeFenetre}</span>
                      <span>{item.nombre} unité{item.nombre > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Équipements électroniques */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Équipements électroniques</h2>
            <div className="space-y-6">
              {/* Équipements avec nombres */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Prises</h3>
                  <p className="font-medium">{salleDetails.salle.prises}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Points Wifi</h3>
                  <p className="font-medium">{salleDetails.salle.pointsWifi}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Ventilateurs</h3>
                  <p className="font-medium">{salleDetails.salle.ventilateurs}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Climatiseurs</h3>
                  <p className="font-medium">{salleDetails.salle.climatiseurs}</p>
                </div>
              </div>

              {/* Lampes */}
              <div>
                <h3 className="text-lg font-medium mb-2">Lampes</h3>
                <div className="space-y-2">
                  {salleDetails.lampes.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                      <span>{item.typeLampe}</span>
                      <span>{item.nombre} unité{item.nombre > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="edit"
                onClick={handleEdit}
              >
                Modifier
              </Button>
              <Button
                variant="delete"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Supprimer
              </Button>
            </div>
          )}
        </div>

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="delete"
                  onClick={handleDelete}
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
