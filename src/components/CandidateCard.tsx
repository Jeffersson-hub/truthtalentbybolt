import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Star, GraduationCap, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onStatusChange: (candidateId: string, status: 'selected' | 'rejected') => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onStatusChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'selected':
        return 'Retenu';
      case 'rejected':
        return 'Non retenu';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-blue-600 font-medium">{candidate.position}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
          {getStatusText(candidate.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{candidate.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{candidate.location}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{candidate.experience} ans d'expérience</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <GraduationCap className="h-4 w-4" />
            <span>{candidate.education}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Reçu le {candidate.uploadDate.toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Compétences */}
      {candidate.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Compétences</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 6 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{candidate.skills.length - 6} autres
              </span>
            )}
          </div>
        </div>
      )}

      {/* Score de correspondance */}
      {candidate.score && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-700">Score de correspondance</span>
            <span className="font-medium text-gray-900">{candidate.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                candidate.score >= 80 ? 'bg-green-500' :
                candidate.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${candidate.score}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Actions */}
      {candidate.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onStatusChange(candidate.id, 'selected')}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <CheckCircle className="h-4 w-4" />
            <span>✓ Valider</span>
          </button>
          <button
            onClick={() => onStatusChange(candidate.id, 'rejected')}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <XCircle className="h-4 w-4" />
            <span>✗ Rejeter</span>
          </button>
        </div>
      )}

      {candidate.status === 'selected' && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Candidat validé ✓</span>
          </div>
          <button
            onClick={() => onStatusChange(candidate.id, 'pending')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Annuler la validation
          </button>
        </div>
      )}

      {candidate.status === 'rejected' && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-200">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">Candidat rejeté ✗</span>
          </div>
          <button
            onClick={() => onStatusChange(candidate.id, 'pending')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Reconsidérer
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;