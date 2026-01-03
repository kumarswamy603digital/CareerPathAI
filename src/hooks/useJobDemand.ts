import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface JobDemandData {
  currentOpenings: number;
  monthlyGrowth: number;
  topHiringCompanies: string[];
  hotLocations: string[];
  demandLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  avgTimeToHire: string;
  lastUpdated: string;
}

interface UseJobDemandResult {
  demand: JobDemandData | null;
  isLoading: boolean;
  error: string | null;
}

export function useJobDemand(careerName: string | null): UseJobDemandResult {
  const [demand, setDemand] = useState<JobDemandData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!careerName) {
      setDemand(null);
      setError(null);
      return;
    }

    const fetchDemandData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('fetch-job-demand', {
          body: { careerName },
        });

        if (fnError) {
          console.error('Error fetching job demand:', fnError);
          setError('Failed to fetch job market data');
          setDemand(null);
          return;
        }

        if (data?.demand) {
          setDemand(data.demand);
        } else {
          setDemand(null);
        }
      } catch (err) {
        console.error('Error fetching job demand:', err);
        setError('Failed to fetch job market data');
        setDemand(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemandData();
  }, [careerName]);

  return { demand, isLoading, error };
}