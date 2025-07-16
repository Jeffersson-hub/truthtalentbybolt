import { Candidate, FilterCriteria } from '../types';

export const filterCandidates = (candidates: Candidate[], filters: FilterCriteria): Candidate[] => {
  return candidates.filter(candidate => {
    // Filtre par poste
    if (filters.position && candidate.position !== filters.position) {
      return false;
    }

    // Filtre par compétences (au moins une compétence doit correspondre)
    if (filters.skills.length > 0) {
      const hasMatchingSkill = filters.skills.some(skill =>
        candidate.skills.some(candidateSkill =>
          candidateSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) {
        return false;
      }
    }

    // Filtre par expérience
    if (candidate.experience < filters.minExperience || candidate.experience > filters.maxExperience) {
      return false;
    }

    // Filtre par localisation
    if (filters.location && candidate.location !== filters.location) {
      return false;
    }

    // Filtre par formation
    if (filters.education && candidate.education !== filters.education) {
      return false;
    }

    return true;
  });
};

export const calculateMatchScore = (candidate: Candidate, filters: FilterCriteria): number => {
  let score = 0;
  let totalCriteria = 0;

  // Score pour le poste (20%)
  if (filters.position) {
    totalCriteria += 20;
    if (candidate.position === filters.position) {
      score += 20;
    }
  }

  // Score pour les compétences (40%)
  if (filters.skills.length > 0) {
    totalCriteria += 40;
    const matchingSkills = filters.skills.filter(skill =>
      candidate.skills.some(candidateSkill =>
        candidateSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    score += (matchingSkills.length / filters.skills.length) * 40;
  }

  // Score pour l'expérience (20%)
  if (filters.minExperience > 0 || filters.maxExperience < 20) {
    totalCriteria += 20;
    const experienceRange = filters.maxExperience - filters.minExperience;
    const candidateExperienceNormalized = Math.min(
      Math.max(candidate.experience - filters.minExperience, 0),
      experienceRange
    );
    score += (candidateExperienceNormalized / experienceRange) * 20;
  }

  // Score pour la localisation (10%)
  if (filters.location) {
    totalCriteria += 10;
    if (candidate.location === filters.location) {
      score += 10;
    }
  }

  // Score pour la formation (10%)
  if (filters.education) {
    totalCriteria += 10;
    if (candidate.education === filters.education) {
      score += 10;
    }
  }

  return totalCriteria > 0 ? Math.round((score / totalCriteria) * 100) : 100;
};