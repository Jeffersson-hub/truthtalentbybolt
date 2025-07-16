export function extractCVData(text: string) {
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || "";
  const phone = text.match(/(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}/)?.[0] || "";
  const experience = text.match(/(\d{1,2})\s?(ans|mois)\s?(d'?expérience)?/i)?.[0] || "";

  const skillsList = ["React", "Node.js", "JavaScript", "Python", "SQL", "Docker"];
  const skills = skillsList.filter(s => text.toLowerCase().includes(s.toLowerCase())); // ✅ array

  const softSkillsList = ["autonome", "rigoureux", "curieux", "adaptable", "communicatif"];
  const softSkills = softSkillsList.filter(s => text.toLowerCase().includes(s.toLowerCase()));

  return {
    email,
    phone,
    experiences: experience,
    skills, // ✅ string[]
    softSkills, // ✅ string[]
    score: skills.length * 10,
  };
}
