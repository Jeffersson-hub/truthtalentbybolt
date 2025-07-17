
'use client';

import React, { useState } from 'react';
import { Candidate } from '../types';

export interface FilterPanelProps {
  candidates: Candidate[];
  onFilter: (filtered: Candidate[]) => void;
  onBack: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ candidates, onFilter, onBack }) => {
  const [skill, setSkill] = useState('');
  const [minExperience, setMinExperience] = useState(0);

  const applyFilters = () => {
    const filtered = candidates.filter(c =>
      (!skill || c.skills.includes(skill)) &&
      c.experience >= minExperience
    );
    onFilter(filtered);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Filtrer les profils</h2>
      <input
        type="text"
        placeholder="Compétence"
        value={skill}
        onChange={e => setSkill(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Expérience min"
        value={minExperience}
        onChange={e => setMinExperience(Number(e.target.value))}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        Appliquer
      </button>
      <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded">
        Retour
      </button>
    </div>
  );
};

export default FilterPanel;
