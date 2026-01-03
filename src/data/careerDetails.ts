// Extended career details for the detail panel
export interface CareerTrajectoryLevel {
  title: string;
  yearsExperience: string;
  salaryRange: { min: number; max: number };
  responsibilities: string[];
}

export interface CareerDetails {
  id: string;
  name: string;
  description: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  education: string[];
  jobOutlook: 'Declining' | 'Stable' | 'Growing' | 'High Demand';
  jobOutlookDescription: string;
  trajectory?: CareerTrajectoryLevel[];
}

// Default trajectory generator for careers without custom trajectory
export const getDefaultTrajectory = (career: CareerDetails): CareerTrajectoryLevel[] => {
  const baseMin = career.salaryRange.min;
  const baseMax = career.salaryRange.max;
  
  return [
    {
      title: `Junior ${career.name}`,
      yearsExperience: '0-2 years',
      salaryRange: { min: Math.round(baseMin * 0.7), max: Math.round(baseMin * 1.1) },
      responsibilities: ['Learn core skills', 'Work under supervision', 'Complete assigned tasks', 'Build foundational knowledge']
    },
    {
      title: `Mid-Level ${career.name}`,
      yearsExperience: '2-5 years',
      salaryRange: { min: Math.round(baseMin * 1.0), max: Math.round((baseMin + baseMax) / 2) },
      responsibilities: ['Work independently', 'Mentor juniors', 'Own small projects', 'Collaborate with team']
    },
    {
      title: `Senior ${career.name}`,
      yearsExperience: '5-10 years',
      salaryRange: { min: Math.round((baseMin + baseMax) / 2), max: Math.round(baseMax * 0.95) },
      responsibilities: ['Lead projects', 'Make technical decisions', 'Guide team direction', 'Drive best practices']
    },
    {
      title: `Lead ${career.name}`,
      yearsExperience: '10+ years',
      salaryRange: { min: Math.round(baseMax * 0.9), max: Math.round(baseMax * 1.3) },
      responsibilities: ['Set strategic vision', 'Manage teams', 'Shape department goals', 'Executive decisions']
    }
  ];
};

export const getCareerTrajectory = (career: CareerDetails): CareerTrajectoryLevel[] => {
  return career.trajectory || getDefaultTrajectory(career);
};

export const careerDetails: Record<string, CareerDetails> = {
  // Technology - Software Engineering
  'Software Engineer': {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems. Work with teams to build scalable solutions that solve real-world problems.',
    salaryRange: { min: 70000, max: 180000, currency: 'USD' },
    skills: ['Programming (Python, JavaScript, Java)', 'Data Structures & Algorithms', 'System Design', 'Version Control (Git)', 'Problem Solving', 'Debugging'],
    education: ["Bachelor's in Computer Science", 'Coding Bootcamp', 'Self-taught with portfolio'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Expected 25% growth over the next decade. Strong demand across all industries.',
  },
  'Game Developer': {
    id: 'game-developer',
    name: 'Game Developer',
    description: 'Create video games for consoles, PC, and mobile platforms. Combine programming skills with creative vision to build immersive experiences.',
    salaryRange: { min: 50000, max: 150000, currency: 'USD' },
    skills: ['Unity/Unreal Engine', 'C++/C#', '3D Math', 'Physics Simulation', 'Game Design', 'Performance Optimization'],
    education: ["Bachelor's in Game Development", "Bachelor's in Computer Science", 'Game Development Bootcamp'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Gaming industry continues to expand with mobile and VR growth.',
  },
  'VR Engineer': {
    id: 'vr-engineer',
    name: 'VR Engineer',
    description: 'Build virtual reality experiences and applications. Work on cutting-edge technology to create immersive environments for gaming, training, and enterprise.',
    salaryRange: { min: 80000, max: 160000, currency: 'USD' },
    skills: ['Unity/Unreal Engine', '3D Graphics', 'Spatial Computing', 'C++/C#', 'User Experience', 'Performance Optimization'],
    education: ["Bachelor's in Computer Science", "Master's in XR Development", 'Specialized VR Certifications'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Emerging field with increasing enterprise adoption and consumer growth.',
  },

  // Technology - Data & AI
  'Data Scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Extract insights from complex data using statistical analysis and machine learning. Help organizations make data-driven decisions.',
    salaryRange: { min: 90000, max: 200000, currency: 'USD' },
    skills: ['Python/R', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization', 'Communication'],
    education: ["Master's in Data Science", "Bachelor's in Statistics/Math", 'Data Science Bootcamp'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'One of the fastest-growing careers with 35% projected growth.',
  },
  'Machine Learning Engineer': {
    id: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    description: 'Design and implement machine learning systems at scale. Bridge the gap between data science research and production systems.',
    salaryRange: { min: 100000, max: 220000, currency: 'USD' },
    skills: ['Python', 'TensorFlow/PyTorch', 'MLOps', 'Cloud Platforms', 'Data Engineering', 'Algorithm Design'],
    education: ["Master's in Machine Learning", "Bachelor's in Computer Science", 'PhD in AI/ML'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'AI boom driving unprecedented demand for ML engineers.',
  },
  'Quant Analyst': {
    id: 'quant-analyst',
    name: 'Quant Analyst',
    description: 'Apply mathematical and statistical models to financial markets. Develop trading strategies and risk management systems.',
    salaryRange: { min: 120000, max: 300000, currency: 'USD' },
    skills: ['Advanced Mathematics', 'Python/C++', 'Statistical Modeling', 'Financial Markets', 'Risk Analysis', 'Algorithmic Trading'],
    education: ["Master's/PhD in Mathematics", "Master's in Financial Engineering", "Bachelor's in Physics/Math"],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive field with steady demand at top financial firms.',
  },
  'Crypto Researcher': {
    id: 'crypto-researcher',
    name: 'Crypto Researcher',
    description: 'Analyze blockchain technologies, cryptocurrencies, and DeFi protocols. Research market trends and emerging technologies.',
    salaryRange: { min: 80000, max: 200000, currency: 'USD' },
    skills: ['Blockchain Technology', 'Cryptography', 'Economic Analysis', 'Technical Writing', 'Smart Contracts', 'Market Analysis'],
    education: ["Bachelor's in Computer Science", "Master's in Economics", 'Self-taught with publications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Volatile but growing field tied to crypto market expansion.',
  },

  // Technology - Robotics & Hardware
  'Robotics Engineer': {
    id: 'robotics-engineer',
    name: 'Robotics Engineer',
    description: 'Design, build, and program robots for manufacturing, healthcare, and other industries. Combine mechanical, electrical, and software engineering.',
    salaryRange: { min: 75000, max: 150000, currency: 'USD' },
    skills: ['ROS', 'Python/C++', 'Control Systems', 'CAD Design', 'Electronics', 'Sensor Integration'],
    education: ["Bachelor's in Robotics Engineering", "Master's in Mechatronics", "Bachelor's in Electrical Engineering"],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Automation and AI driving strong growth in robotics.',
  },
  'Hardware Engineer': {
    id: 'hardware-engineer',
    name: 'Hardware Engineer',
    description: 'Design and develop computer hardware components and systems. Work on everything from microprocessors to IoT devices.',
    salaryRange: { min: 80000, max: 160000, currency: 'USD' },
    skills: ['Circuit Design', 'FPGA/ASIC', 'PCB Layout', 'Verilog/VHDL', 'Testing', 'Embedded Systems'],
    education: ["Bachelor's in Electrical Engineering", "Master's in Computer Engineering", 'Hardware Certifications'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Steady demand with growth in IoT and semiconductor industries.',
  },
  'Drone Technician': {
    id: 'drone-technician',
    name: 'Drone Technician',
    description: 'Build, maintain, and operate unmanned aerial vehicles for commercial and industrial applications.',
    salaryRange: { min: 45000, max: 90000, currency: 'USD' },
    skills: ['Drone Operation', 'Electronics Repair', 'Flight Planning', 'GIS', 'FAA Regulations', 'Photography/Videography'],
    education: ['FAA Part 107 Certification', 'Aviation Technology Degree', 'Technical Training Programs'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Rapid growth as drones expand into delivery, agriculture, and inspection.',
  },
  'Electrician': {
    id: 'electrician',
    name: 'Electrician',
    description: 'Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.',
    salaryRange: { min: 45000, max: 100000, currency: 'USD' },
    skills: ['Electrical Systems', 'Blueprint Reading', 'Code Compliance', 'Troubleshooting', 'Safety Protocols', 'Tool Proficiency'],
    education: ['Apprenticeship Program', 'Trade School Diploma', 'Journeyman/Master License'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Strong demand driven by construction and renewable energy.',
  },
  'Mechanic': {
    id: 'mechanic',
    name: 'Mechanic',
    description: 'Diagnose, repair, and maintain vehicles and machinery. Specialize in automotive, diesel, or industrial equipment.',
    salaryRange: { min: 40000, max: 85000, currency: 'USD' },
    skills: ['Diagnostics', 'Engine Repair', 'Electrical Systems', 'Computer Systems', 'Brake Systems', 'Customer Service'],
    education: ['Vocational Training', 'ASE Certifications', 'Manufacturer Training'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Consistent demand with shift toward electric vehicle expertise.',
  },
  'CNC Machinist': {
    id: 'cnc-machinist',
    name: 'CNC Machinist',
    description: 'Operate and program computer-controlled machines to manufacture precision parts and components.',
    salaryRange: { min: 40000, max: 75000, currency: 'USD' },
    skills: ['G-Code Programming', 'Blueprint Reading', 'Precision Measurement', 'CAD/CAM', 'Quality Control', 'Machine Setup'],
    education: ['Trade School Certificate', 'Apprenticeship', 'CNC Certifications'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Steady demand in manufacturing with increasing automation.',
  },

  // Technology - IT & Infrastructure
  'Cloud Architect': {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: 'Design and oversee cloud computing strategies. Create scalable, secure, and cost-effective cloud infrastructure solutions.',
    salaryRange: { min: 120000, max: 200000, currency: 'USD' },
    skills: ['AWS/Azure/GCP', 'Infrastructure as Code', 'Security', 'Networking', 'Cost Optimization', 'Solution Design'],
    education: ['Cloud Certifications (AWS SA, Azure Architect)', "Bachelor's in IT", 'Years of Cloud Experience'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Cloud adoption driving exceptional demand for architects.',
  },
  'Systems Administrator': {
    id: 'systems-administrator',
    name: 'Systems Administrator',
    description: 'Maintain and manage an organization\'s IT infrastructure. Ensure systems run smoothly and securely.',
    salaryRange: { min: 60000, max: 110000, currency: 'USD' },
    skills: ['Linux/Windows Administration', 'Networking', 'Security', 'Scripting', 'Backup/Recovery', 'Monitoring'],
    education: ["Bachelor's in IT", 'CompTIA/Microsoft Certifications', 'On-the-job Training'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Evolving toward DevOps and cloud-focused roles.',
  },

  // Technology - Technical Product Roles
  'Product Manager': {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Define product vision and strategy. Work with engineering, design, and business teams to build products users love.',
    salaryRange: { min: 100000, max: 200000, currency: 'USD' },
    skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'Agile'],
    education: ["Bachelor's in Business/Tech", 'MBA', 'Product Management Bootcamp'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Tech companies highly value strong product managers.',
  },
  'Project Manager': {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Plan, execute, and close projects on time and within budget. Coordinate teams and resources to achieve goals.',
    salaryRange: { min: 70000, max: 140000, currency: 'USD' },
    skills: ['Project Planning', 'Risk Management', 'Agile/Scrum', 'Budgeting', 'Communication', 'Leadership'],
    education: ["Bachelor's Degree", 'PMP Certification', 'Agile Certifications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Consistent demand across all industries.',
  },
  'Operations Manager': {
    id: 'operations-manager',
    name: 'Operations Manager',
    description: 'Oversee daily business operations. Optimize processes, manage teams, and ensure efficiency across the organization.',
    salaryRange: { min: 65000, max: 130000, currency: 'USD' },
    skills: ['Process Optimization', 'Team Leadership', 'Budget Management', 'Strategic Planning', 'Problem Solving', 'Analytics'],
    education: ["Bachelor's in Business", 'MBA', 'Operations Management Certifications'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Essential role with steady demand in all sectors.',
  },
  'Supply Chain Analyst': {
    id: 'supply-chain-analyst',
    name: 'Supply Chain Analyst',
    description: 'Analyze and optimize supply chain operations. Use data to improve efficiency, reduce costs, and manage inventory.',
    salaryRange: { min: 55000, max: 95000, currency: 'USD' },
    skills: ['Data Analysis', 'Excel/SQL', 'ERP Systems', 'Forecasting', 'Logistics', 'Process Improvement'],
    education: ["Bachelor's in Supply Chain", "Bachelor's in Business Analytics", 'APICS Certifications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Supply chain disruptions increased focus on this role.',
  },

  // Science & Academia - Natural Sciences
  'Physicist': {
    id: 'physicist',
    name: 'Physicist',
    description: 'Study the fundamental principles of nature, from subatomic particles to the cosmos. Conduct research and develop new theories.',
    salaryRange: { min: 70000, max: 150000, currency: 'USD' },
    skills: ['Advanced Mathematics', 'Research Methods', 'Data Analysis', 'Scientific Writing', 'Programming', 'Critical Thinking'],
    education: ['PhD in Physics', "Master's in Physics", 'Postdoctoral Research'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Academic positions competitive; industry roles growing.',
  },
  'Astrophysicist': {
    id: 'astrophysicist',
    name: 'Astrophysicist',
    description: 'Study the physics of the universe, including stars, galaxies, and cosmology. Work at observatories or research institutions.',
    salaryRange: { min: 60000, max: 140000, currency: 'USD' },
    skills: ['Astronomy', 'Data Analysis', 'Computational Methods', 'Telescope Operation', 'Research', 'Scientific Publishing'],
    education: ['PhD in Astrophysics', "Master's in Astronomy", 'Postdoctoral Fellowships'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Limited positions but steady funding for space research.',
  },
  'Chemist': {
    id: 'chemist',
    name: 'Chemist',
    description: 'Study the properties and behavior of matter. Develop new materials, drugs, and processes in labs and industry.',
    salaryRange: { min: 55000, max: 120000, currency: 'USD' },
    skills: ['Lab Techniques', 'Analytical Chemistry', 'Instrumentation', 'Research', 'Safety Protocols', 'Documentation'],
    education: ["Bachelor's in Chemistry", "Master's/PhD for Research", 'Industry Certifications'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Steady demand in pharmaceuticals and materials science.',
  },
  'Environmental Scientist': {
    id: 'environmental-scientist',
    name: 'Environmental Scientist',
    description: 'Study and protect the environment. Analyze pollution, climate change, and natural resources to develop solutions.',
    salaryRange: { min: 50000, max: 100000, currency: 'USD' },
    skills: ['Field Research', 'Data Analysis', 'GIS', 'Environmental Policy', 'Report Writing', 'Regulatory Knowledge'],
    education: ["Bachelor's in Environmental Science", "Master's for Advanced Roles", 'Specialized Certifications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Climate change driving increased demand for expertise.',
  },
  'Biomedical Researcher': {
    id: 'biomedical-researcher',
    name: 'Biomedical Researcher',
    description: 'Conduct research to advance medical knowledge and develop treatments. Work in labs, universities, or pharmaceutical companies.',
    salaryRange: { min: 60000, max: 130000, currency: 'USD' },
    skills: ['Lab Techniques', 'Data Analysis', 'Grant Writing', 'Scientific Publishing', 'Collaboration', 'Critical Thinking'],
    education: ['PhD in Biomedical Sciences', 'MD-PhD Programs', 'Postdoctoral Training'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Aging population and new diseases driving research funding.',
  },

  // Science & Academia - Life Sciences
  'Biologist': {
    id: 'biologist',
    name: 'Biologist',
    description: 'Study living organisms and their environments. Research in labs, field sites, or academic institutions.',
    salaryRange: { min: 45000, max: 100000, currency: 'USD' },
    skills: ['Lab Techniques', 'Field Research', 'Data Analysis', 'Scientific Writing', 'Microscopy', 'Statistical Analysis'],
    education: ["Bachelor's in Biology", "Master's/PhD for Research", 'Field Specializations'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Consistent opportunities in research and healthcare.',
  },
  'Geneticist': {
    id: 'geneticist',
    name: 'Geneticist',
    description: 'Study genes, genetic variation, and heredity. Work on genetic disorders, gene therapy, or agricultural genetics.',
    salaryRange: { min: 65000, max: 140000, currency: 'USD' },
    skills: ['Molecular Biology', 'Bioinformatics', 'Gene Sequencing', 'Data Analysis', 'CRISPR', 'Research Methods'],
    education: ['PhD in Genetics', "Master's in Genomics", 'Medical Genetics Certification'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Genomic medicine and personalized healthcare driving growth.',
  },
  'Epidemiologist': {
    id: 'epidemiologist',
    name: 'Epidemiologist',
    description: 'Study disease patterns in populations. Track outbreaks, analyze health data, and develop prevention strategies.',
    salaryRange: { min: 60000, max: 120000, currency: 'USD' },
    skills: ['Biostatistics', 'Disease Surveillance', 'Data Analysis', 'Research Design', 'Public Health Policy', 'Communication'],
    education: ["Master's in Public Health (MPH)", 'PhD in Epidemiology', 'Medical Degree'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Pandemic preparedness increased focus on epidemiology.',
  },
  'Neuroscientist': {
    id: 'neuroscientist',
    name: 'Neuroscientist',
    description: 'Study the brain and nervous system. Research brain function, neurological diseases, and potential treatments.',
    salaryRange: { min: 65000, max: 140000, currency: 'USD' },
    skills: ['Neuroimaging', 'Lab Techniques', 'Data Analysis', 'Research Design', 'Scientific Writing', 'Programming'],
    education: ['PhD in Neuroscience', 'MD-PhD Programs', 'Postdoctoral Research'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Brain research funding increasing; AI-neuroscience intersection growing.',
  },

  // Science & Academia - Education & Research
  'Professor': {
    id: 'professor',
    name: 'Professor',
    description: 'Teach and conduct research at universities. Mentor students, publish papers, and contribute to academic knowledge.',
    salaryRange: { min: 60000, max: 180000, currency: 'USD' },
    skills: ['Teaching', 'Research', 'Grant Writing', 'Publishing', 'Mentoring', 'Public Speaking'],
    education: ['PhD in Field', 'Postdoctoral Experience', 'Academic Publications'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive tenure-track positions; adjunct roles more available.',
  },
  'Teacher': {
    id: 'teacher',
    name: 'Teacher',
    description: 'Educate students at K-12 levels. Develop lesson plans, assess learning, and inspire the next generation.',
    salaryRange: { min: 40000, max: 80000, currency: 'USD' },
    skills: ['Lesson Planning', 'Classroom Management', 'Communication', 'Patience', 'Assessment', 'Adaptability'],
    education: ["Bachelor's in Education", 'Teaching Certification', "Master's for Advancement"],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Always in demand; some subject areas have shortages.',
  },
  'Curriculum Designer': {
    id: 'curriculum-designer',
    name: 'Curriculum Designer',
    description: 'Create educational content and learning experiences. Design courses for schools, corporations, or online platforms.',
    salaryRange: { min: 55000, max: 100000, currency: 'USD' },
    skills: ['Instructional Design', 'Learning Theory', 'Content Development', 'Assessment Design', 'Ed Tech Tools', 'Project Management'],
    education: ["Master's in Instructional Design", "Bachelor's in Education", 'ID Certifications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Online learning expansion driving demand.',
  },
  'Learning Consultant': {
    id: 'learning-consultant',
    name: 'Learning Consultant',
    description: 'Advise organizations on training and development strategies. Design learning programs to improve performance.',
    salaryRange: { min: 60000, max: 120000, currency: 'USD' },
    skills: ['Needs Assessment', 'Program Design', 'Facilitation', 'Evaluation', 'Change Management', 'Consulting'],
    education: ["Master's in OD/HR", 'Training Certifications', 'Business Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Corporate training budgets increasing.',
  },
  'Educational YouTuber': {
    id: 'educational-youtuber',
    name: 'Educational YouTuber',
    description: 'Create educational video content for online audiences. Build a following while teaching subjects you\'re passionate about.',
    salaryRange: { min: 30000, max: 500000, currency: 'USD' },
    skills: ['Video Production', 'Teaching', 'Content Strategy', 'SEO', 'Community Building', 'Editing'],
    education: ['No Formal Requirements', 'Subject Matter Expertise', 'Video Production Skills'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Creator economy expanding; income highly variable.',
  },

  // Design & Creativity - Visual Design
  'UI/UX Designer': {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    description: 'Design user interfaces and experiences for digital products. Combine aesthetics with usability to create intuitive designs.',
    salaryRange: { min: 65000, max: 150000, currency: 'USD' },
    skills: ['Figma/Sketch', 'User Research', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Systems'],
    education: ["Bachelor's in Design", 'UX Bootcamp', 'Self-taught with Portfolio'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Digital product growth driving strong UX demand.',
  },
  'Illustrator': {
    id: 'illustrator',
    name: 'Illustrator',
    description: 'Create visual representations of concepts, stories, and ideas. Work in publishing, advertising, or as a freelancer.',
    salaryRange: { min: 40000, max: 90000, currency: 'USD' },
    skills: ['Drawing', 'Digital Art', 'Adobe Illustrator', 'Color Theory', 'Composition', 'Client Communication'],
    education: ["Bachelor's in Illustration", 'Art School', 'Self-taught with Portfolio'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Freelance opportunities growing; competition from AI tools.',
  },
  'Animator': {
    id: 'animator',
    name: 'Animator',
    description: 'Bring characters and stories to life through motion. Work in film, television, games, or digital media.',
    salaryRange: { min: 50000, max: 110000, currency: 'USD' },
    skills: ['2D/3D Animation', 'Timing', 'Storytelling', 'Character Design', 'Animation Software', 'Collaboration'],
    education: ["Bachelor's in Animation", 'Animation Bootcamp', 'Strong Demo Reel'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Streaming content and gaming driving animation demand.',
  },
  'Art Director': {
    id: 'art-director',
    name: 'Art Director',
    description: 'Lead the visual style and creative direction for projects. Manage design teams and ensure brand consistency.',
    salaryRange: { min: 80000, max: 160000, currency: 'USD' },
    skills: ['Creative Direction', 'Team Leadership', 'Visual Design', 'Brand Strategy', 'Presentation', 'Client Relations'],
    education: ["Bachelor's in Design", 'Years of Design Experience', 'Portfolio'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Experienced designers valued for leadership roles.',
  },
  'Industrial Designer': {
    id: 'industrial-designer',
    name: 'Industrial Designer',
    description: 'Design physical products for manufacturing. Balance aesthetics, functionality, and manufacturability.',
    salaryRange: { min: 55000, max: 110000, currency: 'USD' },
    skills: ['CAD (SolidWorks)', '3D Modeling', 'Prototyping', 'Materials Knowledge', 'Sketching', 'User Research'],
    education: ["Bachelor's in Industrial Design", "Master's for Senior Roles", 'Portfolio'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Consumer products and sustainable design creating opportunities.',
  },

  // Design & Creativity - Fashion & Aesthetics
  'Fashion Designer': {
    id: 'fashion-designer',
    name: 'Fashion Designer',
    description: 'Create clothing and accessories. Develop collections, work with materials, and set trends in the fashion industry.',
    salaryRange: { min: 40000, max: 130000, currency: 'USD' },
    skills: ['Sketching', 'Sewing', 'Textile Knowledge', 'Trend Forecasting', 'Pattern Making', 'Collection Development'],
    education: ["Bachelor's in Fashion Design", 'Fashion School', 'Portfolio & Industry Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive field; sustainable fashion creating new opportunities.',
  },

  // Design & Creativity - Multimedia
  'Video Editor': {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Assemble footage into polished videos. Work on films, commercials, YouTube content, or corporate videos.',
    salaryRange: { min: 40000, max: 100000, currency: 'USD' },
    skills: ['Premiere Pro/Final Cut', 'Storytelling', 'Color Grading', 'Audio Editing', 'Motion Graphics', 'Collaboration'],
    education: ["Bachelor's in Film", 'Self-taught with Portfolio', 'Video Production Courses'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Video content explosion creating high demand.',
  },
  '3D Modeler': {
    id: '3d-modeler',
    name: '3D Modeler',
    description: 'Create three-dimensional digital models for games, films, architecture, or product visualization.',
    salaryRange: { min: 50000, max: 100000, currency: 'USD' },
    skills: ['Maya/Blender/ZBrush', 'Texturing', 'Topology', 'UV Mapping', 'Rendering', 'Artistic Eye'],
    education: ["Bachelor's in 3D Animation", 'Art School', 'Strong Demo Reel'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Gaming and visualization industries expanding.',
  },
  'Game Designer': {
    id: 'game-designer',
    name: 'Game Designer',
    description: 'Create game mechanics, rules, and player experiences. Design levels, balance systems, and craft compelling gameplay.',
    salaryRange: { min: 55000, max: 130000, currency: 'USD' },
    skills: ['Game Mechanics', 'Level Design', 'Player Psychology', 'Prototyping', 'Documentation', 'Playtesting'],
    education: ["Bachelor's in Game Design", 'Game Development Bootcamp', 'Published Games'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Gaming industry growth creating design opportunities.',
  },
  'Screenwriter': {
    id: 'screenwriter',
    name: 'Screenwriter',
    description: 'Write scripts for film, television, or digital media. Craft stories, dialogue, and characters for the screen.',
    salaryRange: { min: 35000, max: 200000, currency: 'USD' },
    skills: ['Storytelling', 'Dialogue Writing', 'Script Format', 'Character Development', 'Pitching', 'Collaboration'],
    education: ["Bachelor's in Film/Writing", 'MFA in Screenwriting', 'Writing Samples'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Streaming services creating more opportunities.',
  },

  // Design & Creativity - Content Creation
  'Content Creator': {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Produce engaging content for social media, streaming, or digital platforms. Build an audience and monetize your creativity.',
    salaryRange: { min: 25000, max: 300000, currency: 'USD' },
    skills: ['Content Strategy', 'Video Production', 'Community Building', 'Branding', 'Analytics', 'Consistency'],
    education: ['No Formal Requirements', 'Marketing/Media Background Helpful', 'Platform Expertise'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Creator economy expanding rapidly.',
  },
  'Journalist': {
    id: 'journalist',
    name: 'Journalist',
    description: 'Research, investigate, and report news stories. Work for newspapers, magazines, TV, or online publications.',
    salaryRange: { min: 35000, max: 90000, currency: 'USD' },
    skills: ['Research', 'Writing', 'Interviewing', 'Fact-Checking', 'Deadline Management', 'Ethics'],
    education: ["Bachelor's in Journalism", "Bachelor's in Communications", 'Published Work'],
    jobOutlook: 'Declining',
    jobOutlookDescription: 'Traditional media shrinking; digital journalism growing.',
  },
  'Copywriter': {
    id: 'copywriter',
    name: 'Copywriter',
    description: 'Write persuasive text for marketing and advertising. Create content that drives action and builds brands.',
    salaryRange: { min: 45000, max: 100000, currency: 'USD' },
    skills: ['Persuasive Writing', 'Brand Voice', 'SEO', 'Headlines', 'Research', 'Creativity'],
    education: ["Bachelor's in Marketing/English", 'Copywriting Courses', 'Portfolio'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Content marketing keeping demand steady.',
  },
  'Public Relations Manager': {
    id: 'public-relations-manager',
    name: 'Public Relations Manager',
    description: 'Manage an organization\'s public image. Handle media relations, crisis communication, and brand messaging.',
    salaryRange: { min: 60000, max: 130000, currency: 'USD' },
    skills: ['Media Relations', 'Crisis Management', 'Writing', 'Strategic Planning', 'Event Management', 'Social Media'],
    education: ["Bachelor's in Communications/PR", "Master's for Senior Roles", 'APR Certification'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Brand reputation increasingly important.',
  },
  'Career Coach': {
    id: 'career-coach',
    name: 'Career Coach',
    description: 'Help individuals navigate career transitions, job searches, and professional development.',
    salaryRange: { min: 45000, max: 120000, currency: 'USD' },
    skills: ['Active Listening', 'Career Assessment', 'Resume Writing', 'Interview Coaching', 'Goal Setting', 'Empathy'],
    education: ['Coaching Certification', 'HR/Psychology Background', 'Years of Career Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Career changes increasing demand for coaches.',
  },
  'Social Media Manager': {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Develop and execute social media strategies. Manage brand presence across platforms and engage audiences.',
    salaryRange: { min: 45000, max: 90000, currency: 'USD' },
    skills: ['Platform Expertise', 'Content Creation', 'Analytics', 'Community Management', 'Paid Social', 'Trend Awareness'],
    education: ["Bachelor's in Marketing", 'Digital Marketing Certifications', 'Portfolio'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Social media importance driving consistent demand.',
  },

  // Business & Finance - Leadership & Strategy
  'Entrepreneur': {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Start and run your own business. Identify opportunities, take risks, and build something from the ground up.',
    salaryRange: { min: 0, max: 1000000, currency: 'USD' },
    skills: ['Business Strategy', 'Leadership', 'Sales', 'Financial Management', 'Resilience', 'Networking'],
    education: ['No Formal Requirements', 'MBA Helpful', 'Business Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Startup ecosystem thriving; failure rate high.',
  },
  'Marketing Strategist': {
    id: 'marketing-strategist',
    name: 'Marketing Strategist',
    description: 'Develop comprehensive marketing plans to achieve business goals. Analyze markets and create campaigns that drive growth.',
    salaryRange: { min: 65000, max: 140000, currency: 'USD' },
    skills: ['Market Research', 'Campaign Planning', 'Analytics', 'Brand Strategy', 'Budget Management', 'Cross-functional Leadership'],
    education: ["Bachelor's in Marketing", 'MBA', 'Marketing Certifications'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Digital marketing driving demand for strategists.',
  },
  'Management Consultant': {
    id: 'management-consultant',
    name: 'Management Consultant',
    description: 'Advise organizations on strategy, operations, and organizational challenges. Solve complex business problems.',
    salaryRange: { min: 80000, max: 200000, currency: 'USD' },
    skills: ['Problem Solving', 'Data Analysis', 'Presentation', 'Client Management', 'Industry Knowledge', 'Travel Flexibility'],
    education: ['MBA (Preferred)', "Bachelor's in Business", 'Top Firm Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Demand tied to economic cycles; expertise valued.',
  },

  // Business & Finance - Finance
  'Investment Analyst': {
    id: 'investment-analyst',
    name: 'Investment Analyst',
    description: 'Research investments and provide recommendations. Analyze stocks, bonds, and other securities for investors.',
    salaryRange: { min: 70000, max: 180000, currency: 'USD' },
    skills: ['Financial Modeling', 'Valuation', 'Research', 'Excel', 'Industry Analysis', 'Report Writing'],
    education: ["Bachelor's in Finance", 'CFA Certification', 'MBA'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive field with steady opportunities.',
  },
  'Financial Planner': {
    id: 'financial-planner',
    name: 'Financial Planner',
    description: 'Help individuals manage their finances, plan for retirement, and achieve financial goals.',
    salaryRange: { min: 55000, max: 150000, currency: 'USD' },
    skills: ['Financial Planning', 'Investment Knowledge', 'Tax Planning', 'Client Relationships', 'Communication', 'Sales'],
    education: ["Bachelor's in Finance", 'CFP Certification', 'Series 65/66 Licenses'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Aging population increasing demand for planning.',
  },
  'Angel Investor': {
    id: 'angel-investor',
    name: 'Angel Investor',
    description: 'Invest personal capital in early-stage startups. Provide funding, mentorship, and connections to entrepreneurs.',
    salaryRange: { min: 0, max: 500000, currency: 'USD' },
    skills: ['Due Diligence', 'Industry Expertise', 'Networking', 'Mentoring', 'Risk Assessment', 'Portfolio Management'],
    education: ['Significant Capital Required', 'Business/Investment Experience', 'Industry Expertise'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Startup ecosystem creating investment opportunities.',
  },

  // Business & Finance - Event & People Ops
  'Event Planner': {
    id: 'event-planner',
    name: 'Event Planner',
    description: 'Organize and coordinate events from weddings to corporate conferences. Manage vendors, budgets, and logistics.',
    salaryRange: { min: 40000, max: 85000, currency: 'USD' },
    skills: ['Project Management', 'Vendor Negotiation', 'Budgeting', 'Creativity', 'Problem Solving', 'Client Communication'],
    education: ["Bachelor's in Hospitality", 'Event Planning Certification', 'Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Events rebounding post-pandemic; corporate events growing.',
  },

  // Health & Wellness - Physical Health
  'Dietitian': {
    id: 'dietitian',
    name: 'Dietitian',
    description: 'Provide nutrition advice and create meal plans. Help people manage health conditions through diet.',
    salaryRange: { min: 50000, max: 85000, currency: 'USD' },
    skills: ['Nutrition Science', 'Meal Planning', 'Counseling', 'Medical Nutrition Therapy', 'Communication', 'Empathy'],
    education: ["Bachelor's in Dietetics", 'Registered Dietitian Credential', 'Supervised Practice'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Health awareness driving demand for nutrition expertise.',
  },
  'Physiotherapist': {
    id: 'physiotherapist',
    name: 'Physiotherapist',
    description: 'Help patients recover from injuries and improve mobility. Develop treatment plans and therapeutic exercises.',
    salaryRange: { min: 65000, max: 100000, currency: 'USD' },
    skills: ['Anatomy Knowledge', 'Manual Therapy', 'Exercise Prescription', 'Patient Assessment', 'Communication', 'Patience'],
    education: ['Doctor of Physical Therapy (DPT)', 'State Licensure', 'Clinical Residency (Optional)'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Aging population and sports medicine driving strong growth.',
  },
  'Personal Trainer': {
    id: 'personal-trainer',
    name: 'Personal Trainer',
    description: 'Design and implement fitness programs for clients. Motivate and guide people toward their health goals.',
    salaryRange: { min: 30000, max: 80000, currency: 'USD' },
    skills: ['Exercise Science', 'Program Design', 'Nutrition Basics', 'Motivation', 'Client Management', 'Business Skills'],
    education: ['Personal Training Certification (ACE, NASM)', 'CPR/First Aid', "Bachelor's in Exercise Science (Optional)"],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Fitness industry growth creating opportunities.',
  },
  'Health Coach': {
    id: 'health-coach',
    name: 'Health Coach',
    description: 'Guide clients toward healthier lifestyles. Address wellness holistically including nutrition, exercise, and stress management.',
    salaryRange: { min: 40000, max: 90000, currency: 'USD' },
    skills: ['Coaching', 'Nutrition Knowledge', 'Behavior Change', 'Active Listening', 'Goal Setting', 'Empathy'],
    education: ['Health Coaching Certification', "Bachelor's in Health Sciences (Optional)", 'Wellness Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Preventive health focus driving demand.',
  },

  // Health & Wellness - Mental Health
  'Mental Health Counselor': {
    id: 'mental-health-counselor',
    name: 'Mental Health Counselor',
    description: 'Provide therapy and support for mental health challenges. Help clients develop coping strategies and improve wellbeing.',
    salaryRange: { min: 45000, max: 85000, currency: 'USD' },
    skills: ['Active Listening', 'Therapeutic Techniques', 'Assessment', 'Empathy', 'Ethics', 'Documentation'],
    education: ["Master's in Counseling", 'State Licensure (LPC, LMHC)', 'Supervised Clinical Hours'],
    jobOutlook: 'High Demand',
    jobOutlookDescription: 'Mental health awareness driving significant demand.',
  },

  // Social Impact & Politics - Policy & Law
  'Lawyer': {
    id: 'lawyer',
    name: 'Lawyer',
    description: 'Represent clients in legal matters. Provide advice, draft documents, and advocate in court across various practice areas.',
    salaryRange: { min: 60000, max: 250000, currency: 'USD' },
    skills: ['Legal Research', 'Writing', 'Argumentation', 'Critical Thinking', 'Negotiation', 'Client Management'],
    education: ['Juris Doctor (JD)', 'Bar Exam Passage', "Bachelor's Degree"],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive field; specialized areas in higher demand.',
  },
  'Policy Analyst': {
    id: 'policy-analyst',
    name: 'Policy Analyst',
    description: 'Research and analyze public policies. Develop recommendations for government agencies, think tanks, or advocacy groups.',
    salaryRange: { min: 55000, max: 110000, currency: 'USD' },
    skills: ['Research', 'Data Analysis', 'Policy Writing', 'Critical Thinking', 'Stakeholder Engagement', 'Communication'],
    education: ["Master's in Public Policy", "Bachelor's in Political Science", 'Research Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Government and nonprofit sectors maintain steady demand.',
  },
  'Lobbyist': {
    id: 'lobbyist',
    name: 'Lobbyist',
    description: 'Advocate for specific interests to legislators and government officials. Build relationships and influence policy decisions.',
    salaryRange: { min: 60000, max: 200000, currency: 'USD' },
    skills: ['Relationship Building', 'Policy Knowledge', 'Persuasion', 'Networking', 'Strategic Planning', 'Communication'],
    education: ["Bachelor's/Master's in Political Science", 'Law Degree (Helpful)', 'Government Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Regulatory complexity maintains lobbying demand.',
  },
  'Diplomat': {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Represent your country abroad. Negotiate treaties, promote interests, and build international relationships.',
    salaryRange: { min: 55000, max: 160000, currency: 'USD' },
    skills: ['Negotiation', 'Cultural Competence', 'Languages', 'Protocol', 'Analysis', 'Communication'],
    education: ["Bachelor's/Master's in International Relations", 'Foreign Service Exam', 'Language Proficiency'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Competitive positions; global complexity increases importance.',
  },
  'Political Advisor': {
    id: 'political-advisor',
    name: 'Political Advisor',
    description: 'Advise political candidates and officials on strategy, communication, and policy positions.',
    salaryRange: { min: 50000, max: 150000, currency: 'USD' },
    skills: ['Political Strategy', 'Communication', 'Research', 'Crisis Management', 'Networking', 'Media Relations'],
    education: ["Bachelor's in Political Science", 'Campaign Experience', "Master's in Public Policy (Helpful)"],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Election cycles drive demand; off-years slower.',
  },

  // Social Impact & Politics - Social Services
  'Social Worker': {
    id: 'social-worker',
    name: 'Social Worker',
    description: 'Help individuals and families navigate challenges. Provide support, resources, and advocacy for vulnerable populations.',
    salaryRange: { min: 40000, max: 70000, currency: 'USD' },
    skills: ['Case Management', 'Counseling', 'Advocacy', 'Assessment', 'Cultural Competence', 'Resilience'],
    education: ["Bachelor's/Master's in Social Work (BSW/MSW)", 'State Licensure (LSW, LCSW)', 'Field Experience'],
    jobOutlook: 'Growing',
    jobOutlookDescription: 'Aging population and mental health needs driving demand.',
  },
  'NGO Manager': {
    id: 'ngo-manager',
    name: 'NGO Manager',
    description: 'Lead nonprofit organizations focused on social causes. Manage programs, fundraising, and operations.',
    salaryRange: { min: 50000, max: 120000, currency: 'USD' },
    skills: ['Leadership', 'Fundraising', 'Program Management', 'Grant Writing', 'Stakeholder Relations', 'Strategic Planning'],
    education: ["Bachelor's in Nonprofit Management", 'MBA/MPA', 'Nonprofit Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Nonprofit sector steady; mission-driven talent valued.',
  },
  'Community Organizer': {
    id: 'community-organizer',
    name: 'Community Organizer',
    description: 'Mobilize communities around issues and causes. Build coalitions, run campaigns, and create grassroots change.',
    salaryRange: { min: 35000, max: 65000, currency: 'USD' },
    skills: ['Community Engagement', 'Campaign Strategy', 'Public Speaking', 'Relationship Building', 'Conflict Resolution', 'Persistence'],
    education: ['No Formal Requirements', "Bachelor's in Social Sciences (Helpful)", 'Organizing Experience'],
    jobOutlook: 'Stable',
    jobOutlookDescription: 'Social movements and advocacy maintain demand.',
  },
};

// Helper to get career details by name
export const getCareerDetails = (name: string): CareerDetails | undefined => {
  return careerDetails[name];
};

// Format salary range as string
export const formatSalaryRange = (salary: CareerDetails['salaryRange']): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
};
