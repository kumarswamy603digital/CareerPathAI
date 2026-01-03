import { Personality, Interest } from './careerData';

export interface CareerNode {
  id: string;
  name: string;
  personalities: Personality[];
  interests: Interest[];
}

export interface SubCategory {
  id: string;
  name: string;
  careers: CareerNode[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export const careerTree: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    subcategories: [
      {
        id: 'software-engineering',
        name: 'Software Engineering',
        careers: [
          { id: 'software-engineer', name: 'Software Engineer', personalities: ['The Analyst', 'The Doer'], interests: ['Coding', 'Software Development', 'Math', 'Engineering'] },
          { id: 'game-developer', name: 'Game Developer', personalities: ['The Creator', 'The Doer'], interests: ['Game Development', 'Coding', 'Animation', 'Graphic Design'] },
          { id: 'vr-engineer', name: 'VR Engineer', personalities: ['The Visionary', 'The Doer'], interests: ['Game Development', 'Coding', 'Engineering', 'Robotics'] },
        ],
      },
      {
        id: 'data-ai',
        name: 'Data & AI',
        careers: [
          { id: 'data-scientist', name: 'Data Scientist', personalities: ['The Analyst', 'The Explorer'], interests: ['Data Analysis', 'Math', 'Machine Learning', 'Coding'] },
          { id: 'machine-learning-engineer', name: 'Machine Learning Engineer', personalities: ['The Analyst', 'The Visionary'], interests: ['Machine Learning', 'Coding', 'Math', 'Data Analysis'] },
          { id: 'quant-analyst', name: 'Quant Analyst', personalities: ['The Analyst', 'The Doer'], interests: ['Math', 'Data Analysis', 'Investing', 'Coding'] },
          { id: 'crypto-researcher', name: 'Crypto Researcher', personalities: ['The Analyst', 'The Explorer'], interests: ['Crypto', 'Web3', 'Economics', 'Investing'] },
        ],
      },
      {
        id: 'robotics-hardware',
        name: 'Robotics & Hardware',
        careers: [
          { id: 'robotics-engineer', name: 'Robotics Engineer', personalities: ['The Doer', 'The Analyst'], interests: ['Robotics', 'Engineering', 'Coding', 'Electronics'] },
          { id: 'hardware-engineer', name: 'Hardware Engineer', personalities: ['The Doer', 'The Analyst'], interests: ['Electronics', 'Engineering', 'DIY', 'Physics'] },
          { id: 'drone-technician', name: 'Drone Technician', personalities: ['The Doer', 'The Explorer'], interests: ['Aerospace', 'Electronics', 'Robotics', 'Engineering'] },
          { id: 'electrician', name: 'Electrician', personalities: ['The Doer', 'The Analyst'], interests: ['Electronics', 'DIY', 'Engineering', 'Mechanics'] },
          { id: 'mechanic', name: 'Mechanic', personalities: ['The Doer', 'The Explorer'], interests: ['Mechanics', 'Automotive Repair', 'DIY', 'Engineering'] },
          { id: 'cnc-machinist', name: 'CNC Machinist', personalities: ['The Doer', 'The Analyst'], interests: ['Mechanics', 'Engineering', 'Industrial Design', 'DIY'] },
        ],
      },
      {
        id: 'it-infrastructure',
        name: 'IT & Infrastructure',
        careers: [
          { id: 'cloud-architect', name: 'Cloud Architect', personalities: ['The Analyst', 'The Organizer'], interests: ['Cloud Computing', 'Software Development', 'Systems Building'] },
          { id: 'systems-administrator', name: 'Systems Administrator', personalities: ['The Organizer', 'The Doer'], interests: ['Cloud Computing', 'DevOps', 'Systems Building', 'Cybersecurity'] },
        ],
      },
      {
        id: 'technical-product',
        name: 'Technical Product Roles',
        careers: [
          { id: 'product-manager', name: 'Product Manager', personalities: ['The Organizer', 'The Visionary'], interests: ['Project Management', 'Leadership', 'Startups', 'Marketing'] },
          { id: 'project-manager', name: 'Project Manager', personalities: ['The Organizer', 'The Negotiator'], interests: ['Project Management', 'Leadership', 'Planning', 'Operations'] },
          { id: 'operations-manager', name: 'Operations Manager', personalities: ['The Organizer', 'The Doer'], interests: ['Operations', 'Leadership', 'Systems Building', 'Planning'] },
          { id: 'supply-chain-analyst', name: 'Supply Chain Analyst', personalities: ['The Organizer', 'The Analyst'], interests: ['Logistics', 'Operations', 'Data Analysis', 'Economics'] },
        ],
      },
    ],
  },
  {
    id: 'science-academia',
    name: 'Science & Academia',
    subcategories: [
      {
        id: 'natural-sciences',
        name: 'Natural Sciences',
        careers: [
          { id: 'physicist', name: 'Physicist', personalities: ['The Analyst', 'The Explorer'], interests: ['Physics', 'Math', 'Quantum Mechanics', 'Space'] },
          { id: 'astrophysicist', name: 'Astrophysicist', personalities: ['The Analyst', 'The Explorer'], interests: ['Space', 'Physics', 'Math', 'Quantum Mechanics'] },
          { id: 'chemist', name: 'Chemist', personalities: ['The Analyst', 'The Explorer'], interests: ['Chemistry', 'Biology', 'Medicine', 'Engineering'] },
          { id: 'environmental-scientist', name: 'Environmental Scientist', personalities: ['The Analyst', 'The Helper'], interests: ['Environmentalism', 'Conservation', 'Biology', 'Chemistry'] },
          { id: 'biomedical-researcher', name: 'Biomedical Researcher', personalities: ['The Analyst', 'The Helper'], interests: ['Biology', 'Medicine', 'Genetics', 'Chemistry'] },
        ],
      },
      {
        id: 'life-sciences',
        name: 'Life Sciences',
        careers: [
          { id: 'biologist', name: 'Biologist', personalities: ['The Analyst', 'The Explorer'], interests: ['Biology', 'Animals', 'Genetics', 'Medicine'] },
          { id: 'geneticist', name: 'Geneticist', personalities: ['The Analyst', 'The Explorer'], interests: ['Genetics', 'Biology', 'Medicine', 'Chemistry'] },
          { id: 'epidemiologist', name: 'Epidemiologist', personalities: ['The Analyst', 'The Helper'], interests: ['Epidemiology', 'Medicine', 'Data Analysis', 'Biology'] },
          { id: 'neuroscientist', name: 'Neuroscientist', personalities: ['The Analyst', 'The Explorer'], interests: ['Neuroscience', 'Biology', 'Psychology', 'Medicine'] },
        ],
      },
      {
        id: 'education-research',
        name: 'Education & Research',
        careers: [
          { id: 'professor', name: 'Professor', personalities: ['The Analyst', 'The Helper'], interests: ['Teaching', 'Writing', 'Public Speaking', 'Philosophy'] },
          { id: 'teacher', name: 'Teacher', personalities: ['The Helper', 'The Performer'], interests: ['Teaching', 'Psychology', 'Public Speaking', 'Childcare'] },
          { id: 'curriculum-designer', name: 'Curriculum Designer', personalities: ['The Organizer', 'The Creator'], interests: ['Teaching', 'Writing', 'Planning', 'Psychology'] },
          { id: 'learning-consultant', name: 'Learning Consultant', personalities: ['The Helper', 'The Analyst'], interests: ['Teaching', 'Coaching', 'Psychology', 'Planning'] },
          { id: 'educational-youtuber', name: 'Educational YouTuber', personalities: ['The Performer', 'The Helper'], interests: ['Teaching', 'Streaming', 'Film Making', 'Public Speaking'] },
        ],
      },
    ],
  },
  {
    id: 'design-creativity',
    name: 'Design & Creativity',
    subcategories: [
      {
        id: 'visual-design',
        name: 'Visual Design',
        careers: [
          { id: 'ui-ux-designer', name: 'UI/UX Designer', personalities: ['The Creator', 'The Helper'], interests: ['UI/UX', 'Graphic Design', 'Psychology', 'Drawing'] },
          { id: 'illustrator', name: 'Illustrator', personalities: ['The Creator', 'The Explorer'], interests: ['Drawing', 'Painting', 'Graphic Design', 'Animation'] },
          { id: 'animator', name: 'Animator', personalities: ['The Creator', 'The Doer'], interests: ['Animation', 'Drawing', 'Film Making', 'Graphic Design'] },
          { id: 'art-director', name: 'Art Director', personalities: ['The Creator', 'The Visionary'], interests: ['Graphic Design', 'Photography', 'Animation', 'Leadership'] },
          { id: 'industrial-designer', name: 'Industrial Designer', personalities: ['The Creator', 'The Doer'], interests: ['Industrial Design', 'Engineering', 'Drawing', 'DIY'] },
        ],
      },
      {
        id: 'fashion-aesthetics',
        name: 'Fashion & Aesthetics',
        careers: [
          { id: 'fashion-designer', name: 'Fashion Designer', personalities: ['The Creator', 'The Visionary'], interests: ['Fashion', 'Drawing', 'Graphic Design', 'Photography'] },
        ],
      },
      {
        id: 'multimedia',
        name: 'Multimedia',
        careers: [
          { id: 'video-editor', name: 'Video Editor', personalities: ['The Creator', 'The Doer'], interests: ['Film Making', 'Editing', 'Photography', 'Animation'] },
          { id: '3d-modeler', name: '3D Modeler', personalities: ['The Creator', 'The Doer'], interests: ['Animation', 'Drawing', 'Game Development', 'Graphic Design'] },
          { id: 'game-designer', name: 'Game Designer', personalities: ['The Creator', 'The Visionary'], interests: ['Game Development', 'Writing', 'Psychology', 'Animation'] },
          { id: 'screenwriter', name: 'Screenwriter', personalities: ['The Creator', 'The Visionary'], interests: ['Writing', 'Film Making', 'Poetry', 'Journalism'] },
        ],
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        careers: [
          { id: 'content-creator', name: 'Content Creator', personalities: ['The Performer', 'The Creator'], interests: ['Social Media', 'Streaming', 'Podcasting', 'Film Making'] },
          { id: 'journalist', name: 'Journalist', personalities: ['The Explorer', 'The Negotiator'], interests: ['Journalism', 'Writing', 'Public Speaking', 'History'] },
          { id: 'copywriter', name: 'Copywriter', personalities: ['The Creator', 'The Negotiator'], interests: ['Copywriting', 'Writing', 'Marketing', 'Public Speaking'] },
          { id: 'public-relations-manager', name: 'Public Relations Manager', personalities: ['The Negotiator', 'The Organizer'], interests: ['Public Speaking', 'Marketing', 'Writing', 'Leadership'] },
          { id: 'career-coach', name: 'Career Coach', personalities: ['The Helper', 'The Negotiator'], interests: ['Coaching', 'Psychology', 'Leadership', 'Public Speaking'] },
          { id: 'social-media-manager', name: 'Social Media Manager', personalities: ['The Creator', 'The Organizer'], interests: ['Social Media', 'Marketing', 'Writing', 'Graphic Design'] },
        ],
      },
    ],
  },
  {
    id: 'business-finance',
    name: 'Business & Finance',
    subcategories: [
      {
        id: 'leadership-strategy',
        name: 'Leadership & Strategy',
        careers: [
          { id: 'entrepreneur', name: 'Entrepreneur', personalities: ['The Visionary', 'The Doer'], interests: ['Entrepreneurship', 'Startups', 'Leadership', 'Marketing'] },
          { id: 'marketing-strategist', name: 'Marketing Strategist', personalities: ['The Visionary', 'The Negotiator'], interests: ['Marketing', 'Sales', 'Social Media', 'Psychology'] },
          { id: 'management-consultant', name: 'Management Consultant', personalities: ['The Analyst', 'The Negotiator'], interests: ['Economics', 'Leadership', 'Systems Building', 'Project Management'] },
        ],
      },
      {
        id: 'finance',
        name: 'Finance',
        careers: [
          { id: 'investment-analyst', name: 'Investment Analyst', personalities: ['The Analyst', 'The Negotiator'], interests: ['Investing', 'Economics', 'Data Analysis', 'Crypto'] },
          { id: 'financial-planner', name: 'Financial Planner', personalities: ['The Organizer', 'The Helper'], interests: ['Investing', 'Economics', 'Planning', 'Coaching'] },
          { id: 'angel-investor', name: 'Angel Investor', personalities: ['The Visionary', 'The Negotiator'], interests: ['Investing', 'Startups', 'Entrepreneurship', 'Economics'] },
        ],
      },
      {
        id: 'event-people-ops',
        name: 'Event & People Ops',
        careers: [
          { id: 'event-planner', name: 'Event Planner', personalities: ['The Organizer', 'The Performer'], interests: ['Planning', 'Organizing', 'Public Speaking', 'Marketing'] },
        ],
      },
    ],
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    subcategories: [
      {
        id: 'physical-health',
        name: 'Physical Health',
        careers: [
          { id: 'dietitian', name: 'Dietitian', personalities: ['The Helper', 'The Analyst'], interests: ['Nutrition', 'Biology', 'Coaching', 'Medicine'] },
          { id: 'physiotherapist', name: 'Physiotherapist', personalities: ['The Helper', 'The Doer'], interests: ['Physical Therapy', 'Anatomy', 'Sports', 'Working Out'] },
          { id: 'personal-trainer', name: 'Personal Trainer', personalities: ['The Helper', 'The Performer'], interests: ['Working Out', 'Sports', 'Nutrition', 'Coaching'] },
          { id: 'health-coach', name: 'Health Coach', personalities: ['The Helper', 'The Organizer'], interests: ['Coaching', 'Nutrition', 'Psychology', 'Working Out'] },
        ],
      },
      {
        id: 'mental-health',
        name: 'Mental Health',
        careers: [
          { id: 'mental-health-counselor', name: 'Mental Health Counselor', personalities: ['The Helper', 'The Analyst'], interests: ['Counseling', 'Psychology', 'Coaching', 'Nursing'] },
        ],
      },
    ],
  },
  {
    id: 'social-impact-politics',
    name: 'Social Impact & Politics',
    subcategories: [
      {
        id: 'policy-law',
        name: 'Policy & Law',
        careers: [
          { id: 'lawyer', name: 'Lawyer', personalities: ['The Negotiator', 'The Analyst'], interests: ['Law', 'Debate', 'Ethics', 'Public Speaking'] },
          { id: 'policy-analyst', name: 'Policy Analyst', personalities: ['The Analyst', 'The Negotiator'], interests: ['Political Science', 'Law', 'Economics', 'History'] },
          { id: 'lobbyist', name: 'Lobbyist', personalities: ['The Negotiator', 'The Visionary'], interests: ['Political Science', 'Law', 'Public Speaking', 'Ethics'] },
          { id: 'diplomat', name: 'Diplomat', personalities: ['The Negotiator', 'The Explorer'], interests: ['International Relations', 'Languages', 'History', 'Political Science'] },
          { id: 'political-advisor', name: 'Political Advisor', personalities: ['The Negotiator', 'The Analyst'], interests: ['Political Science', 'Leadership', 'Public Speaking', 'Ethics'] },
        ],
      },
      {
        id: 'social-services',
        name: 'Social Services',
        careers: [
          { id: 'social-worker', name: 'Social Worker', personalities: ['The Helper', 'The Negotiator'], interests: ['Counseling', 'Psychology', 'Volunteering', 'Coaching'] },
          { id: 'ngo-manager', name: 'NGO Manager', personalities: ['The Helper', 'The Organizer'], interests: ['Volunteering', 'Leadership', 'Project Management', 'Coaching'] },
          { id: 'community-organizer', name: 'Community Organizer', personalities: ['The Helper', 'The Performer'], interests: ['Volunteering', 'Public Speaking', 'Leadership', 'Coaching'] },
        ],
      },
    ],
  },
];

// Helper function to get all career names from the tree
export const getAllCareerNames = (): string[] => {
  const names: string[] = [];
  careerTree.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategory.careers.forEach(career => {
        names.push(career.name);
      });
    });
  });
  return names;
};

// Helper to find a career by name
export const findCareerByName = (name: string): CareerNode | undefined => {
  for (const category of careerTree) {
    for (const subcategory of category.subcategories) {
      const career = subcategory.careers.find(c => c.name === name);
      if (career) return career;
    }
  }
  return undefined;
};
