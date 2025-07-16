import React from 'react';
import { Upload, Users, BarChart3, FileText, TrendingUp, Briefcase } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'upload' | 'profiles' | 'dashboard') => void;
  candidateCount: number;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, candidateCount }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RecrutPro</h1>
                <p className="text-sm text-gray-500">Système de gestion des candidatures</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur RecrutPro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre solution complète pour gérer efficacement vos processus de recrutement. 
            Téléversez, filtrez et sélectionnez les meilleurs candidats en quelques clics.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{candidateCount}</h3>
            <p className="text-gray-600">Candidats enregistrés</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Taux de satisfaction</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Recrutements réussis</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Téléversement CV */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Téléverser des CV
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Importez facilement vos CV en formats PDF, DOC ou DOCX. 
              Notre système analyse automatiquement les profils et extrait les informations clés.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Formats supportés: PDF, DOC, DOCX</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Analyse automatique des compétences</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Extraction des données de contact</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Commencer le téléversement
            </button>
          </div>

          {/* Gestion des profils */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Gérer les profils
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              {candidateCount > 0 
                ? `Consultez et gérez vos ${candidateCount} candidats enregistrés. Filtrez par compétences, expérience et localisation.`
                : "Aucun candidat enregistré pour le moment. Commencez par téléverser des CV pour accéder à cette fonctionnalité."
              }
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Filtrage avancé par critères</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Score de correspondance automatique</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Actions de validation en un clic</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('profiles')}
              disabled={candidateCount === 0}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                candidateCount > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {candidateCount > 0 ? 'Accéder aux profils' : 'Aucun profil disponible'}
            </button>
          </div>

          {/* Dashboard */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Dashboard
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Visualisez vos statistiques de recrutement, suivez les performances 
              et analysez les tendances de vos processus de sélection.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Statistiques en temps réel</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Graphiques de performance</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span>Rapports détaillés</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Voir le dashboard
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Pourquoi choisir RecrutPro ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Import facile</h3>
              <p className="text-sm text-gray-600">Glissez-déposez vos CV en quelques secondes</p>
            </div>
            
            <div className="p-4">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA intégrée</h3>
              <p className="text-sm text-gray-600">Analyse automatique et scoring intelligent</p>
            </div>
            
            <div className="p-4">
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">Travaillez en équipe sur vos recrutements</p>
            </div>
            
            <div className="p-4">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Suivez vos performances de recrutement</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;