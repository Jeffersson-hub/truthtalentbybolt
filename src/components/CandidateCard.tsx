
import React from 'react';
import { Candidate } from '../types';

export interface CandidateCardProps {
  candidate: Candidate;
  onStatusChange?: (id: string, status: 'pending' | 'selected' | 'rejected') => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onStatusChange }) => {
  return (
    <div className="border p-4 rounded shadow-sm space-y-2">
      <h3 className="text-lg font-semibold">{candidate.name}</h3>
      <p>{candidate.email}</p>
      <p>{candidate.phone}</p>
      <p>Compétences: {candidate.skills.join(', ')}</p>
      <p>Status: {candidate.status}</p>
      {onStatusChange && (
        <div className="flex gap-2">
          <button onClick={() => onStatusChange(candidate.id, 'selected')} className="bg-green-500 text-white px-2 py-1 rounded">
            Sélectionner
          </button>
          <button onClick={() => onStatusChange(candidate.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded">
            Rejeter
          </button>
          <button onClick={() => onStatusChange(candidate.id, 'pending')} className="bg-gray-400 text-white px-2 py-1 rounded">
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
