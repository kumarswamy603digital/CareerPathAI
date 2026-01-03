import { careers, CareerData } from '@/data/careerData';
import { careerDetails } from '@/data/careerDetails';

export interface SimilarCareer {
  name: string;
  matchScore: number;
  sharedInterests: string[];
  sharedPersonalities: string[];
}

export function getSimilarCareers(careerName: string, limit: number = 3): SimilarCareer[] {
  const currentCareer = careers.find(c => c.name === careerName);
  
  if (!currentCareer) return [];
  
  const similarities: SimilarCareer[] = careers
    .filter(c => c.name !== careerName)
    .map(career => {
      const sharedInterests = career.interests.filter(i => 
        currentCareer.interests.includes(i)
      );
      const sharedPersonalities = career.personalities.filter(p => 
        currentCareer.personalities.includes(p)
      );
      
      // Weight: interests count more than personalities
      const matchScore = (sharedInterests.length * 2) + sharedPersonalities.length;
      
      return {
        name: career.name,
        matchScore,
        sharedInterests,
        sharedPersonalities
      };
    })
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
  
  return similarities;
}

export function hasCareerDetails(name: string): boolean {
  return !!careerDetails[name];
}
