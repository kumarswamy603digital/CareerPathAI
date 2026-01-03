export const personalities = [
  "The Analyst",
  "The Creator",
  "The Doer",
  "The Visionary",
  "The Helper",
  "The Organizer",
  "The Performer",
  "The Explorer",
  "The Negotiator"
] as const;

export const interests = [
  "Math", "Physics", "Chemistry", "Engineering", "Data Analysis", "Coding",
  "Robotics", "Machine Learning", "Space", "Quantum Mechanics", "Drawing",
  "Painting", "Graphic Design", "UI/UX", "Animation", "Film Making",
  "Photography", "Fashion", "Architecture", "Writing", "Blogging",
  "Journalism", "Copywriting", "Public Speaking", "Languages", "Poetry",
  "Editing", "Entrepreneurship", "Investing", "Marketing", "Sales", "Crypto",
  "Startups", "Economics", "Leadership", "Psychology", "Counseling",
  "Teaching", "Volunteering", "Coaching", "Childcare", "Nursing",
  "Software Development", "Cloud Computing", "Cybersecurity", "DevOps",
  "Web3", "Game Development", "Hiking", "Animals", "Gardening",
  "Environmentalism", "Farming", "Marine Biology", "Conservation", "DIY",
  "Woodworking", "Mechanics", "Electronics", "Automotive Repair", "Aerospace",
  "Industrial Design", "Acting", "Dancing", "Music", "Podcasting", "Streaming",
  "Social Media", "Comedy", "Working Out", "Sports", "Martial Arts",
  "Physical Therapy", "Nutrition", "Biohacking", "Planning", "Organizing",
  "Systems Building", "Project Management", "Operations", "Logistics", "Law",
  "Debate", "Political Science", "Philosophy", "Ethics", "History",
  "International Relations", "Biology", "Medicine", "Anatomy", "Neuroscience",
  "Genetics", "Epidemiology"
] as const;

export type Personality = typeof personalities[number];
export type Interest = typeof interests[number];

export interface CareerData {
  name: string;
  category: string;
  personalities: Personality[];
  interests: Interest[];
}

export const careers: CareerData[] = [
  // Tech & Engineering
  { name: "Software Engineer", category: "Tech", personalities: ["The Analyst", "The Doer"], interests: ["Coding", "Software Development", "Math", "Engineering"] },
  { name: "Data Scientist", category: "Tech", personalities: ["The Analyst", "The Explorer"], interests: ["Data Analysis", "Math", "Machine Learning", "Coding"] },
  { name: "Machine Learning Engineer", category: "Tech", personalities: ["The Analyst", "The Visionary"], interests: ["Machine Learning", "Coding", "Math", "Data Analysis"] },
  { name: "Robotics Engineer", category: "Tech", personalities: ["The Doer", "The Analyst"], interests: ["Robotics", "Engineering", "Coding", "Electronics"] },
  { name: "Hardware Engineer", category: "Tech", personalities: ["The Doer", "The Analyst"], interests: ["Electronics", "Engineering", "DIY", "Physics"] },
  { name: "Cloud Architect", category: "Tech", personalities: ["The Analyst", "The Organizer"], interests: ["Cloud Computing", "Software Development", "Systems Building"] },
  { name: "Systems Administrator", category: "Tech", personalities: ["The Organizer", "The Doer"], interests: ["Cloud Computing", "DevOps", "Systems Building", "Cybersecurity"] },
  
  // Science
  { name: "Physicist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Physics", "Math", "Quantum Mechanics", "Space"] },
  { name: "Biomedical Researcher", category: "Science", personalities: ["The Analyst", "The Helper"], interests: ["Biology", "Medicine", "Genetics", "Chemistry"] },
  { name: "Astrophysicist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Space", "Physics", "Math", "Quantum Mechanics"] },
  { name: "Chemist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Chemistry", "Biology", "Medicine", "Engineering"] },
  { name: "Environmental Scientist", category: "Science", personalities: ["The Analyst", "The Helper"], interests: ["Environmentalism", "Conservation", "Biology", "Chemistry"] },
  { name: "Biologist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Biology", "Animals", "Genetics", "Medicine"] },
  { name: "Geneticist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Genetics", "Biology", "Medicine", "Chemistry"] },
  { name: "Epidemiologist", category: "Science", personalities: ["The Analyst", "The Helper"], interests: ["Epidemiology", "Medicine", "Data Analysis", "Biology"] },
  { name: "Neuroscientist", category: "Science", personalities: ["The Analyst", "The Explorer"], interests: ["Neuroscience", "Biology", "Psychology", "Medicine"] },
  
  // Creative & Design
  { name: "UI/UX Designer", category: "Creative", personalities: ["The Creator", "The Helper"], interests: ["UI/UX", "Graphic Design", "Psychology", "Drawing"] },
  { name: "Art Director", category: "Creative", personalities: ["The Creator", "The Visionary"], interests: ["Graphic Design", "Photography", "Animation", "Leadership"] },
  { name: "Animator", category: "Creative", personalities: ["The Creator", "The Doer"], interests: ["Animation", "Drawing", "Film Making", "Graphic Design"] },
  { name: "Video Editor", category: "Creative", personalities: ["The Creator", "The Doer"], interests: ["Film Making", "Editing", "Photography", "Animation"] },
  { name: "Illustrator", category: "Creative", personalities: ["The Creator", "The Explorer"], interests: ["Drawing", "Painting", "Graphic Design", "Animation"] },
  { name: "Fashion Designer", category: "Creative", personalities: ["The Creator", "The Visionary"], interests: ["Fashion", "Drawing", "Graphic Design", "Photography"] },
  { name: "Industrial Designer", category: "Creative", personalities: ["The Creator", "The Doer"], interests: ["Industrial Design", "Engineering", "Drawing", "DIY"] },
  
  // Content & Media
  { name: "Content Creator", category: "Media", personalities: ["The Performer", "The Creator"], interests: ["Social Media", "Streaming", "Podcasting", "Film Making"] },
  { name: "Journalist", category: "Media", personalities: ["The Explorer", "The Negotiator"], interests: ["Journalism", "Writing", "Public Speaking", "History"] },
  { name: "Copywriter", category: "Media", personalities: ["The Creator", "The Negotiator"], interests: ["Copywriting", "Writing", "Marketing", "Public Speaking"] },
  { name: "Public Relations Manager", category: "Media", personalities: ["The Negotiator", "The Organizer"], interests: ["Public Speaking", "Marketing", "Writing", "Leadership"] },
  { name: "Screenwriter", category: "Media", personalities: ["The Creator", "The Visionary"], interests: ["Writing", "Film Making", "Poetry", "Journalism"] },
  { name: "Social Media Manager", category: "Media", personalities: ["The Creator", "The Organizer"], interests: ["Social Media", "Marketing", "Writing", "Graphic Design"] },
  
  // Business & Finance
  { name: "Entrepreneur", category: "Business", personalities: ["The Visionary", "The Doer"], interests: ["Entrepreneurship", "Startups", "Leadership", "Marketing"] },
  { name: "Product Manager", category: "Business", personalities: ["The Organizer", "The Visionary"], interests: ["Project Management", "Leadership", "Startups", "Marketing"] },
  { name: "Investment Analyst", category: "Business", personalities: ["The Analyst", "The Negotiator"], interests: ["Investing", "Economics", "Data Analysis", "Crypto"] },
  { name: "Management Consultant", category: "Business", personalities: ["The Analyst", "The Negotiator"], interests: ["Economics", "Leadership", "Systems Building", "Project Management"] },
  { name: "Marketing Strategist", category: "Business", personalities: ["The Visionary", "The Negotiator"], interests: ["Marketing", "Sales", "Social Media", "Psychology"] },
  { name: "Quant Analyst", category: "Business", personalities: ["The Analyst", "The Doer"], interests: ["Math", "Data Analysis", "Investing", "Coding"] },
  { name: "Financial Planner", category: "Business", personalities: ["The Organizer", "The Helper"], interests: ["Investing", "Economics", "Planning", "Coaching"] },
  { name: "Crypto Researcher", category: "Business", personalities: ["The Analyst", "The Explorer"], interests: ["Crypto", "Web3", "Economics", "Investing"] },
  { name: "Angel Investor", category: "Business", personalities: ["The Visionary", "The Negotiator"], interests: ["Investing", "Startups", "Entrepreneurship", "Economics"] },
  
  // Health & Wellness
  { name: "Dietitian", category: "Health", personalities: ["The Helper", "The Analyst"], interests: ["Nutrition", "Biology", "Coaching", "Medicine"] },
  { name: "Physiotherapist", category: "Health", personalities: ["The Helper", "The Doer"], interests: ["Physical Therapy", "Anatomy", "Sports", "Working Out"] },
  { name: "Mental Health Counselor", category: "Health", personalities: ["The Helper", "The Analyst"], interests: ["Counseling", "Psychology", "Coaching", "Nursing"] },
  { name: "Personal Trainer", category: "Health", personalities: ["The Helper", "The Performer"], interests: ["Working Out", "Sports", "Nutrition", "Coaching"] },
  { name: "Health Coach", category: "Health", personalities: ["The Helper", "The Organizer"], interests: ["Coaching", "Nutrition", "Psychology", "Working Out"] },
  
  // Education
  { name: "Teacher", category: "Education", personalities: ["The Helper", "The Performer"], interests: ["Teaching", "Psychology", "Public Speaking", "Childcare"] },
  { name: "Professor", category: "Education", personalities: ["The Analyst", "The Helper"], interests: ["Teaching", "Writing", "Public Speaking", "Philosophy"] },
  { name: "Curriculum Designer", category: "Education", personalities: ["The Organizer", "The Creator"], interests: ["Teaching", "Writing", "Planning", "Psychology"] },
  { name: "Educational YouTuber", category: "Education", personalities: ["The Performer", "The Helper"], interests: ["Teaching", "Streaming", "Film Making", "Public Speaking"] },
  { name: "Learning Consultant", category: "Education", personalities: ["The Helper", "The Analyst"], interests: ["Teaching", "Coaching", "Psychology", "Planning"] },
  { name: "Career Coach", category: "Education", personalities: ["The Helper", "The Negotiator"], interests: ["Coaching", "Psychology", "Leadership", "Public Speaking"] },
  
  // Law & Policy
  { name: "Lawyer", category: "Law", personalities: ["The Negotiator", "The Analyst"], interests: ["Law", "Debate", "Ethics", "Public Speaking"] },
  { name: "Policy Analyst", category: "Law", personalities: ["The Analyst", "The Negotiator"], interests: ["Political Science", "Law", "Economics", "History"] },
  { name: "Lobbyist", category: "Law", personalities: ["The Negotiator", "The Visionary"], interests: ["Political Science", "Law", "Public Speaking", "Ethics"] },
  { name: "Diplomat", category: "Law", personalities: ["The Negotiator", "The Explorer"], interests: ["International Relations", "Languages", "History", "Political Science"] },
  { name: "Political Advisor", category: "Law", personalities: ["The Negotiator", "The Analyst"], interests: ["Political Science", "Leadership", "Public Speaking", "Ethics"] },
  
  // Trades & Technical
  { name: "Electrician", category: "Trades", personalities: ["The Doer", "The Analyst"], interests: ["Electronics", "DIY", "Engineering", "Mechanics"] },
  { name: "Mechanic", category: "Trades", personalities: ["The Doer", "The Explorer"], interests: ["Mechanics", "Automotive Repair", "DIY", "Engineering"] },
  { name: "CNC Machinist", category: "Trades", personalities: ["The Doer", "The Analyst"], interests: ["Mechanics", "Engineering", "Industrial Design", "DIY"] },
  { name: "Drone Technician", category: "Trades", personalities: ["The Doer", "The Explorer"], interests: ["Aerospace", "Electronics", "Robotics", "Engineering"] },
  
  // Operations & Management
  { name: "Supply Chain Analyst", category: "Operations", personalities: ["The Organizer", "The Analyst"], interests: ["Logistics", "Operations", "Data Analysis", "Economics"] },
  { name: "Project Manager", category: "Operations", personalities: ["The Organizer", "The Negotiator"], interests: ["Project Management", "Leadership", "Planning", "Operations"] },
  { name: "Operations Manager", category: "Operations", personalities: ["The Organizer", "The Doer"], interests: ["Operations", "Leadership", "Systems Building", "Planning"] },
  { name: "Event Planner", category: "Operations", personalities: ["The Organizer", "The Performer"], interests: ["Planning", "Organizing", "Public Speaking", "Marketing"] },
  
  // Gaming & VR
  { name: "Game Developer", category: "Gaming", personalities: ["The Creator", "The Doer"], interests: ["Game Development", "Coding", "Animation", "Graphic Design"] },
  { name: "Game Designer", category: "Gaming", personalities: ["The Creator", "The Visionary"], interests: ["Game Development", "Writing", "Psychology", "Animation"] },
  { name: "3D Modeler", category: "Gaming", personalities: ["The Creator", "The Doer"], interests: ["Animation", "Drawing", "Game Development", "Graphic Design"] },
  { name: "VR Engineer", category: "Gaming", personalities: ["The Visionary", "The Doer"], interests: ["Game Development", "Coding", "Engineering", "Robotics"] },
  
  // Social Impact
  { name: "Social Worker", category: "Social", personalities: ["The Helper", "The Negotiator"], interests: ["Counseling", "Psychology", "Volunteering", "Coaching"] },
  { name: "NGO Manager", category: "Social", personalities: ["The Helper", "The Organizer"], interests: ["Volunteering", "Leadership", "Project Management", "Coaching"] },
  { name: "Community Organizer", category: "Social", personalities: ["The Helper", "The Performer"], interests: ["Volunteering", "Public Speaking", "Leadership", "Coaching"] },
];

export const categories = [...new Set(careers.map(c => c.category))];
