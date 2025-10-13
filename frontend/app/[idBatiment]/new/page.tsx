'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

interface SalleFormData {
  idSalle: string;
  fonction: string;
  occupant: string;
  plafond: number;
  prises: number;
  pointsWifi: number;
  ventilateurs: number;
  climatiseurs: number;
}

interface Porte {
  nombre: number;
  typePorte: string;
}

interface Fenetre {
  nombre: number;
  typeFenetre: string;
}

interface Mur {
  surface: number;
  typeMur: string;
}

interface Sol {
  surface: number;
  typeSol: string;
}

interface Lampe {
  nombre: number;
  typeLampe: string;
}

export default function CreateSalle() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const idBatiment = params.idBatiment as string;

  const [salleData, setSalleData] = useState<SalleFormData>({
    idSalle: '',
    fonction: '',
    occupant: 'Aucun',
    plafond: 0,
    prises: 0,
    pointsWifi: 0,
    ventilateurs: 0,
    climatiseurs: 0,
  });

  const [portes, setPortes] = useState<Porte[]>([]);
  const [fenetres, setFenetres] = useState<Fenetre[]>([]);
  const [murs, setMurs] = useState<Mur[]>([]);
  const [sols, setSols] = useState<Sol[]>([]);
  const [lampes, setLampes] = useState<Lampe[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      const requestBody = {
        salle: {
          ...salleData,
          idBatiment
        },
        portes: portes.filter(p => p.typePorte.trim() !== ''),
        fenetres: fenetres.filter(f => f.typeFenetre.trim() !== ''),
        murs: murs.filter(m => m.typeMur.trim() !== ''),
        sols: sols.filter(s => s.typeSol.trim() !== ''),
        lampes: lampes.filter(l => l.typeLampe.trim() !== '')
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification non trouvé');
      }

      const response = await fetch('http://localhost:5000/api/salles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Redirection vers la page du bâtiment après succès
      router.push(`/${idBatiment}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleSalleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSalleData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleCancel = () => {
    router.back();
  };

  // Fonctions pour gérer les portes
  const addPorte = () => {
    setPortes([...portes, { nombre: 1, typePorte: '' }]);
  };

  const removePorte = (index: number) => {
    setPortes(portes.filter((_, i) => i !== index));
  };

  const updatePorte = (index: number, field: keyof Porte, value: string | number) => {
    const updatedPortes = [...portes];
    updatedPortes[index] = { ...updatedPortes[index], [field]: value };
    setPortes(updatedPortes);
  };

  // Fonctions pour gérer les fenêtres
  const addFenetre = () => {
    setFenetres([...fenetres, { nombre: 1, typeFenetre: '' }]);
  };

  const removeFenetre = (index: number) => {
    setFenetres(fenetres.filter((_, i) => i !== index));
  };

  const updateFenetre = (index: number, field: keyof Fenetre, value: string | number) => {
    const updatedFenetres = [...fenetres];
    updatedFenetres[index] = { ...updatedFenetres[index], [field]: value };
    setFenetres(updatedFenetres);
  };

  // Fonctions pour gérer les murs
  const addMur = () => {
    setMurs([...murs, { surface: 0, typeMur: '' }]);
  };

  const removeMur = (index: number) => {
    setMurs(murs.filter((_, i) => i !== index));
  };

  const updateMur = (index: number, field: keyof Mur, value: string | number) => {
    const updatedMurs = [...murs];
    updatedMurs[index] = { ...updatedMurs[index], [field]: value };
    setMurs(updatedMurs);
  };

  // Fonctions pour gérer les sols
  const addSol = () => {
    setSols([...sols, { surface: 0, typeSol: '' }]);
  };

  const removeSol = (index: number) => {
    setSols(sols.filter((_, i) => i !== index));
  };

  const updateSol = (index: number, field: keyof Sol, value: string | number) => {
    const updatedSols = [...sols];
    updatedSols[index] = { ...updatedSols[index], [field]: value };
    setSols(updatedSols);
  };

  // Fonctions pour gérer les lampes
  const addLampe = () => {
    setLampes([...lampes, { nombre: 1, typeLampe: '' }]);
  };

  const removeLampe = (index: number) => {
    setLampes(lampes.filter((_, i) => i !== index));
  };

  const updateLampe = (index: number, field: keyof Lampe, value: string | number) => {
    const updatedLampes = [...lampes];
    updatedLampes[index] = { ...updatedLampes[index], [field]: value };
    setLampes(updatedLampes);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Ajouter une nouvelle salle</h1>
          <p className="text-center text-gray-600 mt-2">Bâtiment: {idBatiment}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
          {/* Informations de base de la salle */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Informations générales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="idSalle" className="block text-sm font-medium text-gray-700 mb-1">
                  Identifiant de la salle *
                </label>
                <input
                  type="text"
                  id="idSalle"
                  name="idSalle"
                  required
                  maxLength={45}
                  value={salleData.idSalle}
                  onChange={handleSalleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Ex: S001 (max 45 caractères)"
                />
              </div>

              <div>
                <label htmlFor="fonction" className="block text-sm font-medium text-gray-700 mb-1">
                  Fonction *
                </label>
                <input
                  type="text"
                  id="fonction"
                  name="fonction"
                  required
                  maxLength={45}
                  value={salleData.fonction}
                  onChange={handleSalleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Bureau, Salle de réunion (max 45 caractères)"
                />
              </div>

              <div>
                <label htmlFor="occupant" className="block text-sm font-medium text-gray-700 mb-1">
                  Occupant
                </label>
                <input
                  type="text"
                  id="occupant"
                  name="occupant"
                  maxLength={45}
                  value={salleData.occupant}
                  onChange={handleSalleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Jean Dupont (max 45 caractères)"
                />
              </div>
            </div>
          </div>

          {/* Section BTP */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Section BTP</h2>
            
            {/* Surface du plafond */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Surface du plafond</h3>
              <div className="max-w-md">
                <label htmlFor="plafond" className="block text-sm font-medium text-gray-700 mb-1">
                  Surface (m²) *
                </label>
                <input
                  type="number"
                  id="plafond"
                  name="plafond"
                  required
                  min="0"
                  step="0.1"
                  value={salleData.plafond}
                  onChange={handleSalleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 25.5"
                />
              </div>
            </div>

            {/* Sols */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Sols</h3>
                <Button type="button" variant="ghost" onClick={addSol}>
                  + Ajouter un type de sol
                </Button>
              </div>
              
              {sols.map((sol, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={sol.surface}
                      onChange={(e) => updateSol(index, 'surface', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de sol
                    </label>
                    <input
                      type="text"
                      value={sol.typeSol}
                      onChange={(e) => updateSol(index, 'typeSol', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Carrelage, Parquet"
                    />
                  </div>
                  <div className="flex items-end">
                    {sols.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => removeSol(index)} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Murs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Murs</h3>
                <Button type="button" variant="ghost" onClick={addMur}>
                  + Ajouter un mur
                </Button>
              </div>
              
              {murs.map((mur, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={mur.surface}
                      onChange={(e) => updateMur(index, 'surface', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de mur
                    </label>
                    <input
                      type="text"
                      maxLength={45}
                      value={mur.typeMur}
                      onChange={(e) => updateMur(index, 'typeMur', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Béton, Cloison sèche (max 45 caractères)"
                    />
                  </div>
                  <div className="flex items-end">
                    {murs.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => removeMur(index)} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Portes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Portes</h3>
                <Button type="button" variant="ghost" onClick={addPorte}>
                  + Ajouter une porte
                </Button>
              </div>
              
              {portes.map((porte, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={porte.nombre}
                      onChange={(e) => updatePorte(index, 'nombre', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de porte
                    </label>
                    <input
                      type="text"
                      maxLength={45}
                      value={porte.typePorte}
                      onChange={(e) => updatePorte(index, 'typePorte', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Bois, Métallique (max 45 caractères)"
                    />
                  </div>
                  <div className="flex items-end">
                    {portes.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => removePorte(index)} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Fenêtres */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Fenêtres</h3>
                <Button type="button" variant="ghost" onClick={addFenetre}>
                  + Ajouter une fenêtre
                </Button>
              </div>
              
              {fenetres.map((fenetre, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={fenetre.nombre}
                      onChange={(e) => updateFenetre(index, 'nombre', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de fenêtre
                    </label>
                    <input
                      type="text"
                      maxLength={45}
                      value={fenetre.typeFenetre}
                      onChange={(e) => updateFenetre(index, 'typeFenetre', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Simple vitrage, Double vitrage (max 45 caractères)"
                    />
                  </div>
                  <div className="flex items-end">
                    {fenetres.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => removeFenetre(index)} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Équipements électroniques */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Équipements électroniques</h2>
            
            {/* Lampes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Lampes</h3>
                <Button type="button" variant="ghost" onClick={addLampe}>
                  + Ajouter un type de lampe
                </Button>
              </div>
              
              {lampes.map((lampe, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lampe.nombre}
                      onChange={(e) => updateLampe(index, 'nombre', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de lampe
                    </label>
                    <input
                      type="text"
                      maxLength={45}
                      value={lampe.typeLampe}
                      onChange={(e) => updateLampe(index, 'typeLampe', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: LED, Fluorescente (max 45 caractères)"
                    />
                  </div>
                  <div className="flex items-end">
                    {lampes.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => removeLampe(index)} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Autres équipements électroniques */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Autres équipements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="prises" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de prises
                  </label>
                  <input
                    type="number"
                    id="prises"
                    name="prises"
                    min="0"
                    value={salleData.prises}
                    onChange={handleSalleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="pointsWifi" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de points WiFi
                  </label>
                  <input
                    type="number"
                    id="pointsWifi"
                    name="pointsWifi"
                    min="0"
                    value={salleData.pointsWifi}
                    onChange={handleSalleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="ventilateurs" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de ventilateurs
                  </label>
                  <input
                    type="number"
                    id="ventilateurs"
                    name="ventilateurs"
                    min="0"
                    value={salleData.ventilateurs}
                    onChange={handleSalleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="climatiseurs" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de climatiseurs
                  </label>
                  <input
                    type="number"
                    id="climatiseurs"
                    name="climatiseurs"
                    min="0"
                    value={salleData.climatiseurs}
                    onChange={handleSalleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="submit">
              {showConfirmation ? 'Confirmer' : 'Créer la salle'}
            </Button>
          </div>
        </form>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmer la création</h3>
              <p className="text-gray-600 mb-6">
                Voulez-vous vraiment créer cette salle avec les informations saisies ?
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowConfirmation(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowConfirmation(false);
                    handleSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent);
                  }}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl font-semibold">
          Accès refusé
        </div>
      </div>
    );
  }
}