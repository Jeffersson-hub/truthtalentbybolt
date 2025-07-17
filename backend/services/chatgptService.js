const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatGPTService {
  
  async analyzeCVContent(textContent, fileName) {
    try {
      logger.info(`🤖 Analyse ChatGPT du CV: ${fileName}`);
      
      const prompt = `
Analyse ce CV et extrait les informations suivantes au format JSON strict :

{
  "name": "Nom complet du candidat",
  "email": "adresse email",
  "phone": "numéro de téléphone (format français si possible)",
  "position": "poste/titre recherché ou actuel",
  "experience": nombre_années_experience,
  "skills": ["compétence1", "compétence2", "compétence3"],
  "location": "ville ou région",
  "education": "niveau d'études le plus élevé",
  "summary": "résumé professionnel en 2-3 phrases"
}

Règles importantes :
- Si une information n'est pas trouvée, utilise null
- Pour experience: nombre entier d'années (0 si débutant)
- Pour skills: maximum 15 compétences les plus pertinentes
- Pour position: le poste recherché en priorité, sinon le poste actuel
- Pour location: ville en priorité, sinon région/département
- Pour education: format français (Bac+2, Bac+5, Master, etc.)

Contenu du CV à analyser :
${textContent}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un expert RH spécialisé dans l'analyse de CV français. Tu extrais uniquement les informations demandées au format JSON strict, sans commentaires additionnels."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      });

      const analysisText = response.choices[0].message.content.trim();
      
      // Nettoyage et parsing du JSON
      let cleanedJson = analysisText;
      if (cleanedJson.includes('```json')) {
        cleanedJson = cleanedJson.split('```json')[1].split('```')[0];
      } else if (cleanedJson.includes('```')) {
        cleanedJson = cleanedJson.split('```')[1];
      }
      
      const extractedData = JSON.parse(cleanedJson.trim());
      
      // Validation et nettoyage des données
      const validatedData = this.validateExtractedData(extractedData);
      
      logger.info(`✅ CV analysé avec succès: ${validatedData.name || 'Nom non trouvé'}`);
      return validatedData;
      
    } catch (error) {
      logger.error(`❌ Erreur lors de l'analyse ChatGPT du CV ${fileName}:`, error);
      
      // Retour de données par défaut en cas d'erreur
      return {
        name: null,
        email: null,
        phone: null,
        position: null,
        experience: 0,
        skills: [],
        location: null,
        education: null,
        summary: null,
        error: "Erreur lors de l'analyse automatique"
      };
    }
  }

  validateExtractedData(data) {
    return {
      name: this.cleanString(data.name),
      email: this.validateEmail(data.email),
      phone: this.cleanPhone(data.phone),
      position: this.cleanString(data.position),
      experience: this.validateExperience(data.experience),
      skills: this.validateSkills(data.skills),
      location: this.cleanString(data.location),
      education: this.cleanString(data.education),
      summary: this.cleanString(data.summary)
    };
  }

  cleanString(str) {
    if (!str || str === 'null' || str === 'undefined') return null;
    return str.toString().trim().substring(0, 255);
  }

  validateEmail(email) {
    if (!email || email === 'null') return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? email.toLowerCase() : null;
  }

  cleanPhone(phone) {
    if (!phone || phone === 'null') return null;
    // Nettoyage du numéro de téléphone français
    const cleaned = phone.toString().replace(/[^\d+]/g, '');
    if (cleaned.length >= 10) {
      return cleaned.substring(0, 15);
    }
    return null;
  }

  validateExperience(exp) {
    const experience = parseInt(exp);
    return isNaN(experience) ? 0 : Math.max(0, Math.min(50, experience));
  }

  validateSkills(skills) {
    if (!Array.isArray(skills)) return [];
    return skills
      .filter(skill => skill && skill !== 'null')
      .map(skill => skill.toString().trim())
      .filter(skill => skill.length > 0)
      .slice(0, 15); // Maximum 15 compétences
  }

  async enhanceJobDescription(position, skills) {
    try {
      const prompt = `
Améliore cette description de poste en suggérant des compétences complémentaires pertinentes :

Poste : ${position}
Compétences actuelles : ${skills.join(', ')}

Réponds au format JSON :
{
  "suggestedSkills": ["compétence1", "compétence2"],
  "jobCategory": "catégorie du poste",
  "seniorityLevel": "junior/middle/senior"
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un expert RH qui suggère des compétences pertinentes pour des postes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content.trim());
      
    } catch (error) {
      logger.error('Erreur lors de l\'amélioration de la description:', error);
      return {
        suggestedSkills: [],
        jobCategory: 'Non défini',
        seniorityLevel: 'Non défini'
      };
    }
  }
}

module.exports = new ChatGPTService();