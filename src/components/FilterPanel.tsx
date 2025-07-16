import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Star, GraduationCap, Filter, Plus, X } from 'lucide-react';
import { FilterCriteria, Candidate } from '../types';

interface FilterPanelProps {
  onFilterChange: (filters: FilterCriteria) => void;
  candidateCount: number;
  candidates: Candidate[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, candidateCount, candidates }) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    position: '',
    skills: [],
    minExperience: 0,
    maxExperience: 20,
    location: '',
    education: ''
  });

  const [customPosition, setCustomPosition] = useState('');
  const [showCustomPosition, setShowCustomPosition] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [customPositions, setCustomPositions] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);

  // Extraire les données uniques des CV téléversés
  const extractedPositions = [...new Set(candidates.map(c => c.position))].filter(Boolean);
  const extractedSkills = [...new Set(candidates.flatMap(c => c.skills))].filter(Boolean);
  const extractedLocations = [...new Set(candidates.map(c => c.location))].filter(Boolean);
  const extractedEducations = [...new Set(candidates.map(c => c.education))].filter(Boolean);

  // Compétences prédéfinies pour les suggestions
  const predefinedSkills = [
    // Langages de programmation
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'C++', 'Swift', 'Kotlin',
    // Frontend
    'React', 'Vue.js', 'Angular', 'Svelte', 'HTML/CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap',
    // Backend
    'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails',
    // Bases de données
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Elasticsearch', 'Cassandra',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible',
    // Outils & Méthodologies
    'Git', 'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'REST API', 'GraphQL', 'Microservices',
    // Data & IA
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'R', 'Tableau', 'Power BI',
    // Mobile
    'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
    // Design
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Principle'
  ];

  // Localisations prédéfinies
  const predefinedLocations = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille',
    'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne',
    'Île-de-France', 'Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine',
    'Hauts-de-France', 'Grand Est', 'Pays de la Loire', 'Bretagne', 'Normandie',
    'Remote', 'Télétravail', 'Hybride', 'France entière', 'International'
  ];

  const educationLevels = [
    'Bac', 'Bac+1', 'Bac+2 (BTS/DUT)', 'Bac+3 (Licence)', 'Bac+4', 'Bac+5 (Master)', 'Bac+6', 'Bac+8 (Doctorat)',
    'École d\'ingénieur', 'École de commerce', 'Formation professionnelle', 'Autodidacte', 'Certification professionnelle'
  ];

  // Combiner les données extraites avec les données prédéfinies et personnalisées
  const allPositions = [...new Set([...extractedPositions, ...customPositions])].sort();
  const allSkills = [...new Set([...extractedSkills, ...predefinedSkills, ...customSkills])].sort();
  const allLocations = [...new Set([...extractedLocations, ...predefinedLocations])].sort();
  const allEducations = [...new Set([...extractedEducations, ...educationLevels])].sort();

  // Charger les données personnalisées depuis le localStorage
  useEffect(() => {
    const savedPositions = localStorage.getItem('customPositions');
    const savedSkills = localStorage.getItem('customSkills');
    
    if (savedPositions) {
      setCustomPositions(JSON.parse(savedPositions));
    }
    if (savedSkills) {
      setCustomSkills(JSON.parse(savedSkills));
    }
  }, []);

  // Sauvegarder les données personnalisées dans le localStorage
  const saveCustomData = (type: 'positions' | 'skills', data: string[]) => {
    if (type === 'positions') {
      localStorage.setItem('customPositions', JSON.stringify(data));
    } else {
      localStorage.setItem('customSkills', JSON.stringify(data));
    }
  };

  // Gérer les suggestions de compétences
  const handleSkillInputChange = (value: string) => {
    setCustomSkill(value);
    
    if (value.length > 0) {
      const suggestions = allSkills
        .filter(skill => 
          skill.toLowerCase().includes(value.toLowerCase()) && 
          !filters.skills.includes(skill)
        )
        .slice(0, 8);
      setSkillSuggestions(suggestions);
    } else {
      setSkillSuggestions([]);
    }
  };

  const updateFilters = (newFilters: Partial<FilterCriteria>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handlePositionChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomPosition(true);
      updateFilters({ position: '' });
    } else {
      setShowCustomPosition(false);
      setCustomPosition('');
      updateFilters({ position: value });
    }
  };

  const handleCustomPositionSubmit = () => {
    if (customPosition.trim() && !allPositions.includes(customPosition.trim())) {
      const newCustomPositions = [...customPositions, customPosition.trim()];
      setCustomPositions(newCustomPositions);
      saveCustomData('positions', newCustomPositions);
    }
    
    if (customPosition.trim()) {
      updateFilters({ position: customPosition.trim() });
      setShowCustomPosition(false);
      setCustomPosition('');
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      updateFilters({
        skills: [...filters.skills, skill]
      });
    }
    setCustomSkill('');
    setSkillSuggestions([]);
    setShowCustomSkill(false);
  };

  const handleCustomSkillSubmit = () => {
    if (customSkill.trim()) {
      // Ajouter à la liste des compétences personnalisées si elle n'existe pas
      if (!allSkills.includes(customSkill.trim())) {
        const newCustomSkills = [...customSkills, customSkill.trim()];
        setCustomSkills(newCustomSkills);
        saveCustomData('skills', newCustomSkills);
      }
      
      // Ajouter aux filtres
      addSkill(customSkill.trim());
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFilters({
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const clearFilters = () => {
    const emptyFilters: FilterCriteria = {
      position: '',
      skills: [],
      minExperience: 0,
      maxExperience: 20,
      location: '',
      education: ''
    };
    setFilters(emptyFilters);
    setCustomPosition('');
    setCustomSkill('');
    setShowCustomPosition(false);
    setShowCustomSkill(false);
    setSkillSuggestions([]);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        <div className="text-sm text-gray-500">
          {candidateCount} candidat{candidateCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {/* Position */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="h-4 w-4" />
            <span>Poste recherché</span>
          </label>
          
          {!showCustomPosition ? (
            <select
              value={filters.position}
              onChange={(e) => handlePositionChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Tous les postes</option>
              {extractedPositions.length > 0 && (
                <optgroup label="📋 Postes des CV téléversés">
                  {extractedPositions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </optgroup>
              )}
              {customPositions.length > 0 && (
                <optgroup label="✏️ Postes personnalisés">
                  {customPositions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </optgroup>
              )}
              <option value="custom">➕ Ajouter un poste personnalisé</option>
            </select>
          ) : (
            <div className="flex space-x-2">
              <input
                type="text"
                value={customPosition}
                onChange={(e) => setCustomPosition(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomPositionSubmit();
                  }
                }}
                placeholder="Saisir le poste recherché..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus
              />
              <button
                onClick={handleCustomPositionSubmit}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setShowCustomPosition(false);
                  setCustomPosition('');
                }}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Compétences */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Star className="h-4 w-4" />
            <span>Compétences requises</span>
          </label>
          
          {!showCustomSkill ? (
            <select
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomSkill(true);
                } else if (e.target.value) {
                  addSkill(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-2"
            >
              <option value="">Sélectionner une compétence...</option>
              {extractedSkills.length > 0 && (
                <optgroup label="🎯 Compétences des CV téléversés">
                  {extractedSkills
                    .filter(skill => !filters.skills.includes(skill))
                    .map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                </optgroup>
              )}
              {predefinedSkills
                .filter(skill => !filters.skills.includes(skill) && !extractedSkills.includes(skill))
                .length > 0 && (
                <optgroup label="💼 Compétences courantes">
                  {predefinedSkills
                    .filter(skill => !filters.skills.includes(skill) && !extractedSkills.includes(skill))
                    .slice(0, 20)
                    .map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                </optgroup>
              )}
              <option value="custom">➕ Ajouter une compétence personnalisée</option>
            </select>
          ) : (
            <div className="relative mb-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomSkillSubmit();
                    }
                  }}
                  placeholder="Saisir une compétence..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                />
                <button
                  onClick={handleCustomSkillSubmit}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setShowCustomSkill(false);
                    setCustomSkill('');
                    setSkillSuggestions([]);
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Suggestions */}
              {skillSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {skillSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => addSkill(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Expérience */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Années d'expérience
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 w-12">Min:</span>
              <input
                type="range"
                min="0"
                max="20"
                value={filters.minExperience}
                onChange={(e) => updateFilters({ minExperience: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 w-8 text-center">
                {filters.minExperience}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 w-12">Max:</span>
              <input
                type="range"
                min="0"
                max="20"
                value={filters.maxExperience}
                onChange={(e) => updateFilters({ maxExperience: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 w-8 text-center">
                {filters.maxExperience}
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center">
              {filters.minExperience === filters.maxExperience 
                ? `Exactement ${filters.minExperience} an${filters.minExperience > 1 ? 's' : ''}`
                : `Entre ${filters.minExperience} et ${filters.maxExperience} ans`
              }
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Localisation</span>
          </label>
          <select
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Toutes les localisations</option>
            {extractedLocations.length > 0 && (
              <optgroup label="📍 Localisations des CV téléversés">
                {extractedLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="🏙️ Grandes villes">
              {predefinedLocations.slice(0, 20)
                .filter(location => !extractedLocations.includes(location))
                .map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
            </optgroup>
            <optgroup label="🗺️ Régions">
              {predefinedLocations.slice(20, 30)
                .filter(location => !extractedLocations.includes(location))
                .map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
            </optgroup>
            <optgroup label="💻 Travail à distance">
              {predefinedLocations.slice(30)
                .filter(location => !extractedLocations.includes(location))
                .map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Formation */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="h-4 w-4" />
            <span>Niveau d'études minimum</span>
          </label>
          <select
            value={filters.education}
            onChange={(e) => updateFilters({ education: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Tous les niveaux</option>
            {extractedEducations.length > 0 && (
              <optgroup label="🎓 Formations des CV téléversés">
                {extractedEducations.map(education => (
                  <option key={education} value={education}>{education}</option>
                ))}
              </optgroup>
            )}
            {educationLevels
              .filter(level => !extractedEducations.includes(level))
              .length > 0 && (
              <optgroup label="📚 Niveaux standards">
                {educationLevels
                  .filter(level => !extractedEducations.includes(level))
                  .map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="w-full py-2 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Effacer tous les filtres
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;