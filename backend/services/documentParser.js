const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { parseOfficeAsync } = require('officeparser');
const logger = require('../utils/logger');

async function parseCVFile(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await parseOfficeAsync(buffer);
  return result.text;
}

class DocumentParser {
  async parseDocument(buffer, fileName, mimeType) {
    try {
      logger.info(`📄 Parsing du document: ${fileName} (${mimeType})`);
      
      let textContent = '';
      
      switch (mimeType) {
        case 'application/pdf':
          textContent = await this.parsePDF(buffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          textContent = await this.parseDocx(buffer);
          break;
        case 'application/msword':
          textContent = buffer.toString('utf8');
          break;
        default:
          throw new Error(`Type de fichier non supporté: ${mimeType}`);
      }

      const cleanedText = this.cleanExtractedText(textContent);
      logger.info(`✅ Document parsé avec succès: ${cleanedText.length} caractères extraits`);
      return cleanedText;
      
    } catch (error) {
      logger.error(`❌ Erreur lors du parsing de ${fileName}:`, error);
      throw new Error(`Impossible de lire le fichier ${fileName}: ${error.message}`);
    }
  }

  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      logger.error('Erreur parsing PDF:', error);
      throw new Error('Erreur lors de la lecture du fichier PDF');
    }
  }

  async parseDocx(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      logger.error('Erreur parsing DOCX:', error);
      throw new Error('Erreur lors de la lecture du fichier Word');
    }
  }

  cleanExtractedText(text) {
    if (!text) return '';
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50000);
  }

  extractBasicInfo(text) {
    return {
      emails: this.extractEmails(text),
      phones: this.extractPhones(text),
      urls: this.extractUrls(text)
    };
  }

  extractEmails(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
  }

  extractPhones(text) {
    const phoneRegex = /(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/g;
    return text.match(phoneRegex) || [];
  }

  extractUrls(text) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  }
}

module.exports = {
  parseCVFile,
  parser: new DocumentParser()
};
