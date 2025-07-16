import React from 'react';
import { ArrowLeft, Users, TrendingUp, Clock, CheckCircle, XCircle, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { Candidate } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onBack }) => {
  const totalCandidates = candidates.length;
  const selectedCount = candidates.filter(c => c.status === 'selected').length;
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length;
  const pendingCount = candidates.filter(c => c.status === 'pending').length;

  // Statistiques par poste
  const positionStats = candidates.reduce((acc, candidate) => {
    acc[candidate.position] = (acc[candidate.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par localisation
  const locationStats = candidates.reduce((acc, candidate) => {
    acc[candidate.location] = (acc[candidate.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Candidats récents (derniers 7 jours)
  const recentCandidates = candidates.filter(c => {
    const daysDiff = (Date.now() - c.uploadDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  // Score moyen
  const averageScore = candidates.length > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length)
    : 0;

  const topPositions = Object.entries(positionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dashboard RecrutPro</h1>
                  <p className="text-sm text-gray-500">Analyse des performances de recrutement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total candidats</p>
                <p className="text-2xl font-bold text-gray-900">{totalCandidates}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+{recentCandidates} cette semaine</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Candidats retenus</p>
                <p className="text-2xl font-bold text-gray-900">{selectedCount}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{totalCandidates > 0 ? Math.round((selectedCount / totalCandidates) * 100) : 0}% du total</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{totalCandidates > 0 ? Math.round((pendingCount / totalCandidates) * 100) : 0}% du total</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Score moyen</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${averageScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Répartition par statut */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <PieChart className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Répartition par statut</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Retenus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{selectedCount}</span>
                  <span className="text-sm text-gray-500">
                    ({totalCandidates > 0 ? Math.round((selectedCount / totalCandidates) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Non retenus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{rejectedCount}</span>
                  <span className="text-sm text-gray-500">
                    ({totalCandidates > 0 ? Math.round((rejectedCount / totalCandidates) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">En attente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{pendingCount}</span>
                  <span className="text-sm text-gray-500">
                    ({totalCandidates > 0 ? Math.round((pendingCount / totalCandidates) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Graphique visuel simple */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="h-full flex">
                  {selectedCount > 0 && (
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${(selectedCount / totalCandidates) * 100}%` }}
                    ></div>
                  )}
                  {rejectedCount > 0 && (
                    <div 
                      className="bg-red-500 h-full"
                      style={{ width: `${(rejectedCount / totalCandidates) * 100}%` }}
                    ></div>
                  )}
                  {pendingCount > 0 && (
                    <div 
                      className="bg-yellow-500 h-full"
                      style={{ width: `${(pendingCount / totalCandidates) * 100}%` }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nouveaux candidats</p>
                    <p className="text-xs text-gray-500">Cette semaine</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600">+{recentCandidates}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Candidats validés</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">{selectedCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Candidats rejetés</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-red-600">{rejectedCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top postes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top postes recherchés</h2>
            
            {topPositions.length > 0 ? (
              <div className="space-y-4">
                {topPositions.map(([position, count], index) => (
                  <div key={position} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-900 font-medium">{position}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / totalCandidates) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>

          {/* Top localisations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top localisations</h2>
            
            {topLocations.length > 0 ? (
              <div className="space-y-4">
                {topLocations.map(([location, count], index) => (
                  <div key={location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-900 font-medium">{location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(count / totalCandidates) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;