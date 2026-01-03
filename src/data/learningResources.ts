// Learning resources mapped to careers
export interface LearningResource {
  title: string;
  platform: 'Coursera' | 'Udemy' | 'LinkedIn Learning' | 'edX' | 'Pluralsight' | 'YouTube' | 'freeCodeCamp' | 'Codecademy';
  url: string;
  type: 'Course' | 'Specialization' | 'Certificate' | 'Tutorial';
  duration?: string;
  free?: boolean;
}

const platformColors: Record<string, string> = {
  'Coursera': 'bg-blue-100 text-blue-700 border-blue-200',
  'Udemy': 'bg-purple-100 text-purple-700 border-purple-200',
  'LinkedIn Learning': 'bg-sky-100 text-sky-700 border-sky-200',
  'edX': 'bg-red-100 text-red-700 border-red-200',
  'Pluralsight': 'bg-pink-100 text-pink-700 border-pink-200',
  'YouTube': 'bg-rose-100 text-rose-700 border-rose-200',
  'freeCodeCamp': 'bg-green-100 text-green-700 border-green-200',
  'Codecademy': 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

export const getPlatformColor = (platform: string): string => {
  return platformColors[platform] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const learningResources: Record<string, LearningResource[]> = {
  'Software Engineer': [
    { title: 'Meta Front-End Developer Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer', type: 'Certificate', duration: '7 months' },
    { title: 'The Complete Web Developer Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', type: 'Course', duration: '65 hours' },
    { title: 'CS50: Introduction to Computer Science', platform: 'edX', url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science', type: 'Course', free: true },
    { title: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'Certificate', free: true },
  ],
  'Data Scientist': [
    { title: 'IBM Data Science Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', type: 'Certificate', duration: '5 months' },
    { title: 'Python for Data Science and Machine Learning Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/', type: 'Course', duration: '25 hours' },
    { title: 'Statistics with Python Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/statistics-with-python', type: 'Specialization', duration: '2 months' },
    { title: 'Data Analysis with Python', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', type: 'Certificate', free: true },
  ],
  'Machine Learning Engineer': [
    { title: 'Deep Learning Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning', type: 'Specialization', duration: '5 months' },
    { title: 'Machine Learning A-Z: AI, Python & R', platform: 'Udemy', url: 'https://www.udemy.com/course/machinelearning/', type: 'Course', duration: '44 hours' },
    { title: 'TensorFlow Developer Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice', type: 'Certificate', duration: '4 months' },
    { title: 'Machine Learning with Python', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/', type: 'Certificate', free: true },
  ],
  'Product Manager': [
    { title: 'Google Project Management Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-project-management', type: 'Certificate', duration: '6 months' },
    { title: 'Become a Product Manager', platform: 'Udemy', url: 'https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/', type: 'Course', duration: '12 hours' },
    { title: 'Product Management First Steps', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/product-management-first-steps', type: 'Course', duration: '1 hour' },
    { title: 'Digital Product Management Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/uva-darden-digital-product-management', type: 'Specialization', duration: '4 months' },
  ],
  'UX Designer': [
    { title: 'Google UX Design Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-ux-design', type: 'Certificate', duration: '6 months' },
    { title: 'Complete Web & Mobile Designer', platform: 'Udemy', url: 'https://www.udemy.com/course/complete-web-designer-mobile-designer-zero-to-mastery/', type: 'Course', duration: '27 hours' },
    { title: 'User Experience Design Essentials', platform: 'Udemy', url: 'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/', type: 'Course', duration: '12 hours' },
    { title: 'Responsive Web Design', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Certificate', free: true },
  ],
  'Game Developer': [
    { title: 'Complete C# Unity Game Developer 3D', platform: 'Udemy', url: 'https://www.udemy.com/course/unitycourse2/', type: 'Course', duration: '30 hours' },
    { title: 'Unreal Engine 5 C++ Developer', platform: 'Udemy', url: 'https://www.udemy.com/course/unrealcourse/', type: 'Course', duration: '60 hours' },
    { title: 'Game Design and Development Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/game-development', type: 'Specialization', duration: '6 months' },
    { title: 'Learn Game Development', platform: 'Codecademy', url: 'https://www.codecademy.com/catalog/subject/game-development', type: 'Course' },
  ],
  'Cloud Architect': [
    { title: 'AWS Solutions Architect Professional', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect', type: 'Certificate', duration: '6 months' },
    { title: 'Ultimate AWS Certified Solutions Architect', platform: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', type: 'Course', duration: '27 hours' },
    { title: 'Google Cloud Professional Cloud Architect', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/gcp-cloud-architect', type: 'Certificate', duration: '4 months' },
    { title: 'Azure Administrator', platform: 'Pluralsight', url: 'https://www.pluralsight.com/paths/microsoft-azure-administrator-az-104', type: 'Course', duration: '25 hours' },
  ],
  'Cybersecurity Analyst': [
    { title: 'Google Cybersecurity Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', type: 'Certificate', duration: '6 months' },
    { title: 'Complete Cyber Security Course', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-internet-security-privacy-course-volume-1/', type: 'Course', duration: '12 hours' },
    { title: 'IBM Cybersecurity Analyst', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst', type: 'Certificate', duration: '4 months' },
    { title: 'Information Security', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/information-security/', type: 'Certificate', free: true },
  ],
  'Digital Marketer': [
    { title: 'Google Digital Marketing & E-commerce', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', type: 'Certificate', duration: '6 months' },
    { title: 'Complete Digital Marketing Course', platform: 'Udemy', url: 'https://www.udemy.com/course/learn-digital-marketing-course/', type: 'Course', duration: '22 hours' },
    { title: 'Meta Social Media Marketing', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing', type: 'Certificate', duration: '7 months' },
    { title: 'Digital Marketing Specialist', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/paths/become-a-digital-marketing-specialist', type: 'Course', duration: '20 hours' },
  ],
  'Financial Analyst': [
    { title: 'Financial Analyst Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/financial-analyst', type: 'Certificate', duration: '4 months' },
    { title: 'Complete Financial Analyst Training', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-financial-analyst-training-and-investing-course/', type: 'Course', duration: '22 hours' },
    { title: 'Excel Skills for Business', platform: 'Coursera', url: 'https://www.coursera.org/specializations/excel', type: 'Specialization', duration: '6 months' },
    { title: 'Financial Markets', platform: 'Coursera', url: 'https://www.coursera.org/learn/financial-markets-global', type: 'Course', free: true },
  ],
  'Nurse': [
    { title: 'Nursing Informatics Training', platform: 'Coursera', url: 'https://www.coursera.org/learn/nursing-informatics-training-and-education', type: 'Course', duration: '4 weeks' },
    { title: 'Healthcare Provider CPR', platform: 'Udemy', url: 'https://www.udemy.com/course/healthcare-provider-cpr/', type: 'Course', duration: '2 hours' },
    { title: 'Anatomy Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/anatomy', type: 'Specialization', duration: '4 months' },
    { title: 'Medical Terminology', platform: 'Coursera', url: 'https://www.coursera.org/learn/medical-terminology', type: 'Course', duration: '6 weeks' },
  ],
  'Physician': [
    { title: 'Anatomy Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/anatomy', type: 'Specialization', duration: '4 months' },
    { title: 'Medical Neuroscience', platform: 'Coursera', url: 'https://www.coursera.org/learn/medical-neuroscience', type: 'Course', duration: '12 weeks' },
    { title: 'Healthcare Administration', platform: 'edX', url: 'https://www.edx.org/learn/healthcare-management', type: 'Course' },
    { title: 'Clinical Skills', platform: 'Coursera', url: 'https://www.coursera.org/learn/clinical-skills', type: 'Course', duration: '6 weeks' },
  ],
  'Graphic Designer': [
    { title: 'Graphic Design Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/graphic-design', type: 'Specialization', duration: '6 months' },
    { title: 'Complete Graphic Design Masterclass', platform: 'Udemy', url: 'https://www.udemy.com/course/graphic-design-masterclass-everything-you-need-to-know/', type: 'Course', duration: '29 hours' },
    { title: 'Adobe Creative Cloud', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/topics/adobe-creative-cloud', type: 'Course' },
    { title: 'Learn Adobe Illustrator', platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-illustrator', type: 'Course' },
  ],
  'Lawyer': [
    { title: 'Introduction to American Law', platform: 'Coursera', url: 'https://www.coursera.org/learn/american-law', type: 'Course', duration: '6 weeks' },
    { title: 'Contract Law', platform: 'edX', url: 'https://www.edx.org/learn/law/harvard-university-contracts', type: 'Course' },
    { title: 'Legal English', platform: 'Coursera', url: 'https://www.coursera.org/learn/legal-english', type: 'Course', duration: '4 weeks' },
    { title: 'Intellectual Property Law', platform: 'Coursera', url: 'https://www.coursera.org/specializations/intellectual-property', type: 'Specialization', duration: '5 months' },
  ],
  'Accountant': [
    { title: 'Intuit Bookkeeping Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/intuit-bookkeeping', type: 'Certificate', duration: '4 months' },
    { title: 'Accounting Fundamentals', platform: 'Udemy', url: 'https://www.udemy.com/course/accounting-fundamentals/', type: 'Course', duration: '6 hours' },
    { title: 'Introduction to Financial Accounting', platform: 'Coursera', url: 'https://www.coursera.org/learn/wharton-accounting', type: 'Course', duration: '4 weeks' },
    { title: 'Excel for Accountants', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/excel-for-accountants', type: 'Course', duration: '2 hours' },
  ],
  'Teacher': [
    { title: 'Foundations of Teaching', platform: 'Coursera', url: 'https://www.coursera.org/learn/foundations-of-teaching', type: 'Course', duration: '6 weeks' },
    { title: 'Classroom Management', platform: 'Udemy', url: 'https://www.udemy.com/course/classroom-management/', type: 'Course', duration: '3 hours' },
    { title: 'Learning How to Learn', platform: 'Coursera', url: 'https://www.coursera.org/learn/learning-how-to-learn', type: 'Course', free: true },
    { title: 'Virtual Teaching Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/virtual-teacher', type: 'Specialization', duration: '3 months' },
  ],
  'Architect': [
    { title: 'Autodesk CAD/CAM for Manufacturing', platform: 'Coursera', url: 'https://www.coursera.org/specializations/autodesk-cad-cam-manufacturing', type: 'Specialization', duration: '4 months' },
    { title: 'Complete Revit Course', platform: 'Udemy', url: 'https://www.udemy.com/course/revit-course/', type: 'Course', duration: '12 hours' },
    { title: 'AutoCAD Essentials', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/autocad-2024-essential-training', type: 'Course', duration: '8 hours' },
    { title: 'Sustainable Building Design', platform: 'edX', url: 'https://www.edx.org/learn/architecture', type: 'Course' },
  ],
  'Robotics Engineer': [
    { title: 'Modern Robotics Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/modernrobotics', type: 'Specialization', duration: '8 months' },
    { title: 'ROS for Beginners', platform: 'Udemy', url: 'https://www.udemy.com/course/ros-essentials/', type: 'Course', duration: '10 hours' },
    { title: 'Robotics MicroMasters', platform: 'edX', url: 'https://www.edx.org/micromasters/pennx-robotics', type: 'Certificate', duration: '1 year' },
    { title: 'Arduino Programming', platform: 'Udemy', url: 'https://www.udemy.com/course/arduino-programming/', type: 'Course', duration: '8 hours' },
  ],
  'VR Engineer': [
    { title: 'Unity XR Interaction Toolkit', platform: 'Udemy', url: 'https://www.udemy.com/course/unity-xr/', type: 'Course', duration: '15 hours' },
    { title: 'Virtual Reality Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/virtual-reality', type: 'Specialization', duration: '5 months' },
    { title: 'Unreal Engine VR Development', platform: 'Udemy', url: 'https://www.udemy.com/course/unreal-engine-vr/', type: 'Course', duration: '12 hours' },
    { title: '3D Graphics Programming', platform: 'Pluralsight', url: 'https://www.pluralsight.com/paths/3d-graphics-programming', type: 'Course' },
  ],
  'Content Creator': [
    { title: 'Content Strategy for Professionals', platform: 'Coursera', url: 'https://www.coursera.org/specializations/content-strategy', type: 'Specialization', duration: '5 months' },
    { title: 'YouTube Masterclass', platform: 'Udemy', url: 'https://www.udemy.com/course/youtube-masterclass/', type: 'Course', duration: '10 hours' },
    { title: 'Video Editing Fundamentals', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/video-editing-fundamentals', type: 'Course', duration: '3 hours' },
    { title: 'Social Media Marketing', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing', type: 'Certificate', duration: '7 months' },
  ],
  'Entrepreneur': [
    { title: 'Entrepreneurship Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/wharton-entrepreneurship', type: 'Specialization', duration: '4 months' },
    { title: 'Complete Business Plan Course', platform: 'Udemy', url: 'https://www.udemy.com/course/business-plan-course/', type: 'Course', duration: '6 hours' },
    { title: 'How to Start a Startup', platform: 'YouTube', url: 'https://www.youtube.com/playlist?list=PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1', type: 'Tutorial', free: true },
    { title: 'Y Combinator Startup School', platform: 'YouTube', url: 'https://www.startupschool.org/', type: 'Course', free: true },
  ],
  'Electrician': [
    { title: 'Electrical Wiring Fundamentals', platform: 'Udemy', url: 'https://www.udemy.com/course/electrical-wiring/', type: 'Course', duration: '4 hours' },
    { title: 'NEC Code Basics', platform: 'Udemy', url: 'https://www.udemy.com/course/nec-code/', type: 'Course', duration: '3 hours' },
    { title: 'Basic Electricity', platform: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLWv9VM947MKi_7yJ0_FCfzTBXpQU-Qd3K', type: 'Tutorial', free: true },
    { title: 'Industrial Electrical', platform: 'Udemy', url: 'https://www.udemy.com/course/industrial-electrical/', type: 'Course', duration: '8 hours' },
  ],
  'Chef': [
    { title: 'Culinary Arts', platform: 'Coursera', url: 'https://www.coursera.org/learn/culinary-arts', type: 'Course', duration: '4 weeks' },
    { title: 'Professional Chef Training', platform: 'Udemy', url: 'https://www.udemy.com/course/professional-chef/', type: 'Course', duration: '5 hours' },
    { title: 'Food Safety', platform: 'Coursera', url: 'https://www.coursera.org/learn/food-safety', type: 'Course', duration: '6 weeks' },
    { title: 'Cooking Techniques', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/topics/cooking', type: 'Course' },
  ],
};

// Default resources for careers without specific mappings
export const defaultResources: LearningResource[] = [
  { title: 'Learning How to Learn', platform: 'Coursera', url: 'https://www.coursera.org/learn/learning-how-to-learn', type: 'Course', free: true },
  { title: 'Critical Thinking Skills', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/critical-thinking', type: 'Course', duration: '1 hour' },
  { title: 'Communication Skills', platform: 'Coursera', url: 'https://www.coursera.org/learn/wharton-communication-skills', type: 'Course', duration: '4 weeks' },
];

export const getResourcesForCareer = (careerName: string): LearningResource[] => {
  return learningResources[careerName] || defaultResources;
};
