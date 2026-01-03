// Day-in-the-Life YouTube videos for careers
export interface CareerVideo {
  videoId: string;
  title: string;
  channel: string;
}

export const careerVideos: Record<string, CareerVideo[]> = {
  'Software Engineer': [
    { videoId: 'Uo3cL4nrGOk', title: 'Day in the Life of a Software Engineer', channel: 'TechLead' },
    { videoId: 'rqX8PFcOpxA', title: 'A Day in My Life as a Software Engineer', channel: 'Joma Tech' },
  ],
  'Data Scientist': [
    { videoId: 'Ura_byPPqMo', title: 'Day in the Life of a Data Scientist', channel: 'Ken Jee' },
    { videoId: 'SE4P7IVCunE', title: 'What Does a Data Scientist Actually Do?', channel: 'Alex The Analyst' },
  ],
  'Machine Learning Engineer': [
    { videoId: 'X3paOmcrTjQ', title: 'Day in the Life of an ML Engineer', channel: 'Daniel Bourke' },
    { videoId: 'pHiMN_ez0sw', title: 'Machine Learning Engineer Day in the Life', channel: 'Nicholas Renotte' },
  ],
  'Product Manager': [
    { videoId: 'yUOC-Y0f5ZQ', title: 'Day in the Life of a Product Manager', channel: 'Exponent' },
    { videoId: 'xi3K2Wq1sSo', title: 'What Do Product Managers Do?', channel: 'Product School' },
  ],
  'UX Designer': [
    { videoId: 'wIuVvCuiJhU', title: 'Day in the Life of a UX Designer', channel: 'Femke Design' },
    { videoId: 'SRec90j6lTY', title: 'What Does a UX Designer Actually Do?', channel: 'Jesse Showalter' },
  ],
  'Game Developer': [
    { videoId: 'z06QR-tz1_o', title: 'Day in the Life of a Game Developer', channel: 'Jason Weimann' },
    { videoId: 'PMXf0e8n2Oc', title: 'What Game Developers Actually Do', channel: 'Brackeys' },
  ],
  'Cloud Architect': [
    { videoId: 'RtfCy5-yLqA', title: 'Day in the Life of a Cloud Architect', channel: 'TechWorld with Nana' },
    { videoId: 'JIbIYCM48to', title: 'What Does a Cloud Architect Do?', channel: 'Be A Better Dev' },
  ],
  'Cybersecurity Analyst': [
    { videoId: 'tXJuPJ1YONA', title: 'Day in the Life of a Cybersecurity Analyst', channel: 'Gerald Auger' },
    { videoId: 'vI79qT4lcfA', title: 'What Does a Security Analyst Do?', channel: 'NetworkChuck' },
  ],
  'Digital Marketer': [
    { videoId: '5B8p2P-_J3c', title: 'Day in the Life of a Digital Marketer', channel: 'Simplilearn' },
    { videoId: 'bixR-KIJKYM', title: 'What Does a Digital Marketer Do?', channel: 'Neil Patel' },
  ],
  'Financial Analyst': [
    { videoId: 'JZHCqoyH1WA', title: 'Day in the Life of a Financial Analyst', channel: 'Kenji Explains' },
    { videoId: 'qH-oGwHbJ_I', title: 'What Does a Financial Analyst Actually Do?', channel: 'The Plain Bagel' },
  ],
  'Nurse': [
    { videoId: 'dBHHnMMwrwM', title: 'Day in the Life of a Nurse', channel: 'Nurse Mendoza' },
    { videoId: 'JQ-EcFYHMQQ', title: 'What Nurses Really Do', channel: 'Nurse Blake' },
  ],
  'Physician': [
    { videoId: 'WNw9sLXVDJo', title: 'Day in the Life of a Doctor', channel: 'Doctor Mike' },
    { videoId: 'bN2tNLTQS8s', title: 'What Being a Doctor is Really Like', channel: 'Med School Insiders' },
  ],
  'Graphic Designer': [
    { videoId: 'IPT0CbblSJ4', title: 'Day in the Life of a Graphic Designer', channel: 'The Futur' },
    { videoId: 'UWM8_e3E0M4', title: 'What Graphic Designers Do', channel: 'Will Paterson' },
  ],
  'Lawyer': [
    { videoId: 'Ik4_p9Q7qN4', title: 'Day in the Life of a Lawyer', channel: 'LegalEagle' },
    { videoId: 'HmZqNLoIMBQ', title: 'What Lawyers Actually Do', channel: 'Mike Ross Law' },
  ],
  'Accountant': [
    { videoId: 'wc5Lx9VOE0s', title: 'Day in the Life of an Accountant', channel: 'Life of an Accountant' },
    { videoId: 'VRNAJlp_Bjw', title: 'What Accountants Really Do', channel: 'Accounting Stuff' },
  ],
  'Teacher': [
    { videoId: 'T78nq62aQgM', title: 'Day in the Life of a Teacher', channel: 'Real Rap With Reynolds' },
    { videoId: '3Nf8nlJQGBA', title: 'What Teaching is Really Like', channel: 'Teacher Toni' },
  ],
  'Architect': [
    { videoId: '8GxWB71_V-4', title: 'Day in the Life of an Architect', channel: '30X40 Design Workshop' },
    { videoId: 'dMqQPxLGH6g', title: 'What Architects Actually Do', channel: 'Archi Hacks' },
  ],
  'Robotics Engineer': [
    { videoId: 'WQ4vz4_GWfU', title: 'Day in the Life of a Robotics Engineer', channel: 'Boston Dynamics' },
    { videoId: 'zVkZN_ecRjI', title: 'What Robotics Engineers Do', channel: 'Real Engineering' },
  ],
  'VR Engineer': [
    { videoId: 'i3DbJwy0R6E', title: 'Day in the Life of a VR Developer', channel: 'Valem Tutorials' },
    { videoId: 'gY3P4MYfFEw', title: 'Working in Virtual Reality Development', channel: 'Justin P Barnett' },
  ],
  'Content Creator': [
    { videoId: 'VSaH8F-Vwbk', title: 'Day in the Life of a Content Creator', channel: 'Ali Abdaal' },
    { videoId: 'Tzl0ELY_TiM', title: 'What Full-Time YouTube is Like', channel: 'Peter McKinnon' },
  ],
  'Entrepreneur': [
    { videoId: 'Lp7E973zozc', title: 'Day in the Life of a Startup Founder', channel: 'Y Combinator' },
    { videoId: 'uvhF0bGtMm4', title: 'What Being an Entrepreneur is Really Like', channel: 'GaryVee' },
  ],
  'Electrician': [
    { videoId: 'R_-zPwUVKnA', title: 'Day in the Life of an Electrician', channel: 'Electrician U' },
    { videoId: 'CTlbTzh1tTc', title: 'What Electricians Actually Do', channel: 'Sparky Channel' },
  ],
  'Chef': [
    { videoId: 'LYMedhnwJVQ', title: 'Day in the Life of a Chef', channel: "Bon Appétit" },
    { videoId: 'oidnwPIeqsI', title: 'What Working in a Kitchen is Like', channel: 'Joshua Weissman' },
  ],
  'Quant Analyst': [
    { videoId: 'E3keLeMwfHY', title: 'Day in the Life of a Quant', channel: 'Dimitri Bianco' },
    { videoId: 'xTNwQbT6dbo', title: 'What Quants Actually Do', channel: 'QuantPy' },
  ],
  'Project Manager': [
    { videoId: 'lDfGpGXN4UE', title: 'Day in the Life of a Project Manager', channel: 'Adriana Girdler' },
    { videoId: 'QKZ1vOMnQjc', title: 'What Project Managers Do', channel: 'Mike Clayton' },
  ],
  'Systems Administrator': [
    { videoId: 'BN8jJyxvXXI', title: 'Day in the Life of a SysAdmin', channel: 'NetworkChuck' },
    { videoId: 'sP9Z1UmSTLg', title: 'What System Administrators Do', channel: 'Eli the Computer Guy' },
  ],
  'Hardware Engineer': [
    { videoId: '1O3iwpfH4Ow', title: 'Day in the Life of a Hardware Engineer', channel: 'Ben Eater' },
    { videoId: '3Vq1VxfQ7fg', title: 'What Hardware Engineers Do', channel: 'EEVblog' },
  ],
};

// Default videos for careers without specific mappings
export const defaultVideos: CareerVideo[] = [
  { videoId: 'Tt08KmFfIYQ', title: 'How to Find Your Dream Career', channel: 'TEDx Talks' },
  { videoId: 'H14bBuluwB8', title: 'Career Advice for Young People', channel: 'Simon Sinek' },
];

export const getVideosForCareer = (careerName: string): CareerVideo[] => {
  return careerVideos[careerName] || defaultVideos;
};
