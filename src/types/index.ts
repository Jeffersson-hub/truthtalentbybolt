export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience: number;
  skills: string[];
  location: string;
  education: string;
  fileName: string;
  uploadDate: Date;
  status: 'pending' | 'selected' | 'rejected';
  score?: number;
}

export interface FilterCriteria {
  position: string;
  skills: string[];
  minExperience: number;
  maxExperience: number;
  location: string;
  education: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}