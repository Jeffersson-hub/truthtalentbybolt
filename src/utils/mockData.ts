//src/utils/mockData.ts

//import { Candidate } from '../types';

export const generateMockCandidates = (files: File[]): Candidate[] => {
  // Noms français réalistes
  const frenchNames = [
    'Marie Dubois', 'Pierre Martin', 'Sophie Leroy', 'Jean Moreau', 'Camille Bernard',
    'Nicolas Petit', 'Julie Durand', 'Thomas Robert', 'Emma Bonnet', 'Alexandre Roux',
    'Léa Fournier', 'Maxime Girard', 'Chloé André', 'Antoine Mercier', 'Sarah Blanc',
    'Julien Garnier', 'Manon Faure', 'Romain Rousseau', 'Clara Vincent', 'Hugo Lambert',
    'Océane Morel', 'Lucas Fontaine', 'Inès Chevalier', 'Gabriel Gauthier', 'Jade Muller',
    'Théo Lefebvre', 'Lola Bertrand', 'Nathan Masson', 'Zoé Robin', 'Enzo Sanchez'
  ];

  // Emails correspondants
  const generateEmail = (name: string, index: number) => {
    const cleanName = name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/\s+/g, '.');
    
    const domains = ['gmail.com', 'outlook.fr', 'yahoo.fr', 'orange.fr', 'free.fr', 'hotmail.fr'];
    const domain = domains[index % domains.length];
    
    return `${cleanName}@${domain}`;
  };

  const mockSkills = [
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

  const mockPositions = [
    'Développeur Frontend', 'Développeur Backend', 'Développeur Full Stack', 'Développeur Mobile',
    'Data Scientist', 'Data Analyst', 'UX/UI Designer', 'Product Designer',
    'Chef de Projet', 'Product Manager', 'Architecte Solution', 'Architecte Logiciel',
    'DevOps Engineer', 'Ingénieur Cloud', 'Consultant IT', 'Business Analyst',
    'Testeur QA', 'Scrum Master', 'Tech Lead', 'CTO'
  ];

  const mockLocations = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille',
    'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble', 'Dijon', 'Angers', 'Nîmes',
    'Île-de-France', 'Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine',
    'Remote', 'Télétravail', 'Hybride'
  ];

  const mockEducation = [
    'Bac+2 (BTS/DUT)', 'Bac+3 (Licence)', 'Bac+5 (Master)', 'École d\'ingénieur', 'École de commerce',
    'Bac+8 (Doctorat)', 'Formation professionnelle', 'Certification professionnelle'
  ];

  return files.map((file, index) => {
    const candidateName = frenchNames[index % frenchNames.length];
    const randomSkillsCount = Math.floor(Math.random() * 8) + 3;
    const selectedSkills = mockSkills
      .sort(() => 0.5 - Math.random())
      .slice(0, randomSkillsCount);

    return {
      id: `candidate-${index}`,
      name: candidateName,
      email: generateEmail(candidateName, index),
      phone: `+33 6 ${String(Math.floor(Math.random() * 90000000) + 10000000).replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')}`,
      position: mockPositions[Math.floor(Math.random() * mockPositions.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      skills: selectedSkills,
      location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
      education: mockEducation[Math.floor(Math.random() * mockEducation.length)],
      fileName: file.name,
      uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      status: 'pending',
      score: Math.floor(Math.random() * 40) + 60 // Score entre 60 et 100
    };
  });
};