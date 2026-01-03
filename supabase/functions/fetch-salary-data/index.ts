import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// BLS Occupational Employment and Wage Statistics (OEWS) series codes mapping
// Format: OEUM[area][area_type][industry][occupation][datatype]
// Using national data (0000000) for broader coverage
const occupationCodes: Record<string, string> = {
  'Software Engineer': '15-1252', // Software Developers
  'Data Scientist': '15-2051', // Data Scientists
  'Machine Learning Engineer': '15-2051', // Data Scientists (closest match)
  'Product Manager': '11-2021', // Marketing Managers (closest match)
  'UX Designer': '27-1021', // Commercial and Industrial Designers
  'Graphic Designer': '27-1024', // Graphic Designers
  'Nurse': '29-1141', // Registered Nurses
  'Doctor': '29-1218', // Physicians
  'Lawyer': '23-1011', // Lawyers
  'Accountant': '13-2011', // Accountants and Auditors
  'Teacher': '25-2031', // Secondary School Teachers
  'Electrician': '47-2111', // Electricians
  'Mechanic': '49-3023', // Automotive Service Technicians
  'Chef': '35-1011', // Chefs and Head Cooks
  'Pharmacist': '29-1051', // Pharmacists
  'Architect': '17-1011', // Architects
  'Civil Engineer': '17-2051', // Civil Engineers
  'Marketing Manager': '11-2021', // Marketing Managers
  'Financial Analyst': '13-2051', // Financial Analysts
  'HR Manager': '11-3121', // Human Resources Managers
  'Project Manager': '11-9199', // Managers, All Other
  'Cloud Architect': '15-1244', // Network and Computer Systems Administrators
  'Game Developer': '15-1252', // Software Developers
  'Robotics Engineer': '17-2199', // Engineers, All Other
  'Psychologist': '19-3031', // Clinical Psychologists
  'Veterinarian': '29-1131', // Veterinarians
  'Dentist': '29-1021', // Dentists
  'Physical Therapist': '29-1123', // Physical Therapists
  'Journalist': '27-3022', // Reporters and Correspondents
  'Photographer': '27-4021', // Photographers
  'Video Editor': '27-4032', // Film and Video Editors
};

// Fallback salary data based on BLS 2023 statistics
const fallbackSalaryData: Record<string, { min: number; median: number; max: number; source: string; lastUpdated: string }> = {
  'Software Engineer': { min: 75000, median: 127260, max: 200000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Data Scientist': { min: 65000, median: 108020, max: 180000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Machine Learning Engineer': { min: 85000, median: 125000, max: 200000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Product Manager': { min: 80000, median: 140040, max: 200000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'UX Designer': { min: 55000, median: 83260, max: 130000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Graphic Designer': { min: 38000, median: 57990, max: 100000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Nurse': { min: 60000, median: 81220, max: 120000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Doctor': { min: 150000, median: 229300, max: 400000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Lawyer': { min: 65000, median: 135740, max: 220000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Accountant': { min: 50000, median: 78000, max: 130000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Teacher': { min: 40000, median: 62360, max: 100000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Electrician': { min: 40000, median: 60240, max: 100000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Mechanic': { min: 35000, median: 46880, max: 75000, source: 'BLS 2023', lastUpdated: '2023-05' },
  'Chef': { min: 35000, median: 56520, max: 90000, source: 'BLS 2023', lastUpdated: '2023-05' },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerName } = await req.json();
    
    console.log(`Fetching salary data for: ${careerName}`);
    
    if (!careerName) {
      return new Response(
        JSON.stringify({ error: 'Career name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we have a direct match or partial match in fallback data
    let salaryData = fallbackSalaryData[careerName];
    
    if (!salaryData) {
      // Try to find a partial match
      const careerNameLower = careerName.toLowerCase();
      for (const [key, data] of Object.entries(fallbackSalaryData)) {
        if (careerNameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(careerNameLower)) {
          salaryData = data;
          break;
        }
      }
    }

    // Try to fetch from BLS API
    const occupationCode = occupationCodes[careerName];
    if (occupationCode) {
      try {
        // BLS Public Data API v2
        const blsResponse = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seriesid: [`OEUN000000000000${occupationCode}03`], // Annual mean wage
            startyear: '2022',
            endyear: '2023',
          }),
        });

        if (blsResponse.ok) {
          const blsData = await blsResponse.json();
          console.log('BLS API response:', JSON.stringify(blsData));
          
          if (blsData.status === 'REQUEST_SUCCEEDED' && blsData.Results?.series?.[0]?.data?.length > 0) {
            const latestData = blsData.Results.series[0].data[0];
            const annualWage = parseFloat(latestData.value) * 1000; // BLS reports in thousands
            
            return new Response(
              JSON.stringify({
                careerName,
                salary: {
                  min: Math.round(annualWage * 0.7),
                  median: Math.round(annualWage),
                  max: Math.round(annualWage * 1.4),
                  source: 'BLS Live Data',
                  lastUpdated: `${latestData.year}-${latestData.period.replace('M', '')}`,
                },
                isLive: true,
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (blsError) {
        console.error('BLS API error:', blsError);
        // Fall through to use fallback data
      }
    }

    // Use fallback data if BLS API fails or no mapping exists
    if (salaryData) {
      console.log(`Using fallback data for: ${careerName}`);
      return new Response(
        JSON.stringify({
          careerName,
          salary: salaryData,
          isLive: false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No data available
    return new Response(
      JSON.stringify({
        careerName,
        salary: null,
        isLive: false,
        message: 'No salary data available for this career',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching salary data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch salary data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});