import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveSalaryData {
  min: number;
  median: number;
  max: number;
  source: string;
  lastUpdated: string;
}

interface UseLiveSalaryDataResult {
  salary: LiveSalaryData | null;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
}

export function useLiveSalaryData(careerName: string | null): UseLiveSalaryDataResult {
  const [salary, setSalary] = useState<LiveSalaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!careerName) {
      setSalary(null);
      setIsLive(false);
      setError(null);
      return;
    }

    const fetchSalaryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('fetch-salary-data', {
          body: { careerName },
        });

        if (fnError) {
          console.error('Error fetching salary data:', fnError);
          setError('Failed to fetch live salary data');
          setSalary(null);
          setIsLive(false);
          return;
        }

        if (data?.salary) {
          setSalary(data.salary);
          setIsLive(data.isLive || false);
        } else {
          setSalary(null);
          setIsLive(false);
        }
      } catch (err) {
        console.error('Error fetching salary data:', err);
        setError('Failed to fetch live salary data');
        setSalary(null);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalaryData();
  }, [careerName]);

  return { salary, isLoading, isLive, error };
}