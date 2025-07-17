
'use client';

import { useState } from 'react';
import CVUpload from './components/CVUpload';
import CandidateCard from './components/CandidateCard';
import FilterPanel from './components/FilterPanel';
import { Candidate } from './types';
import { extractCVData } from './utils/extractCVData';
import { extractTextFromCV } from './utils/parseCV';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'profiles'>('upload');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);

  return (
    <main className="p-4">
      {currentPage === 'upload' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">TruthTalent</h1>
          <p className="text-lg text-gray-600">Téléversez des CV pour commencer le processus de recrutement</p>
          <CVUpload
          onFilesUploaded={async (files) => {
            const parsedCandidates: Candidate[] = await Promise.all(
              files.map(async (file, index) => {
                const buffer = await file.arrayBuffer();
                const text = await extractTextFromCV(Buffer.from(buffer));
                const parsed = extractCVData(text);

                return {
                  id: `candidate-${Date.now()}-${index}`,
                  name: file.name.split('.')[0],
                  email: parsed.email || '',
                  phone: parsed.phone || '',
                  position: 'À déterminer',
                  experience: parsed.experiences ? parseInt(parsed.experiences) || 0 : 0,
                  skills: parsed.skills || [],
                  location: 'Non précisée',
                  education: 'Non précisé',
                  fileName: file.name,
                  uploadDate: new Date(),
                  status: 'pending',
                  score: parsed.score || 0,
                };
              })
            );

            setCandidates(prev => [...prev, ...parsedCandidates]);
          }}
          onAnalyzeProfiles={() => setCurrentPage('profiles')}
        />
        </div>
      )}

      {currentPage === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterPanel
            candidates={candidates}
            onFilter={setFilteredCandidates}
            onBack={() => setCurrentPage('upload')}
          />
          <div className="col-span-3 space-y-4">
            {(filteredCandidates.length > 0 ? filteredCandidates : candidates).map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onStatusChange={(id, newStatus) => {
                  setCandidates(prev =>
                    prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
