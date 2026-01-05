export interface VoiceLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  firstMessage: string;
  promptSuffix: string;
}

export const voiceLanguages: VoiceLanguage[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    flag: '🇺🇸',
    firstMessage: "Hello! I'm your career advisor. Tell me about your interests, skills, and what kind of work environment you enjoy. I'll help you discover the perfect career path!",
    promptSuffix: "Always respond in English."
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    flag: '🇪🇸',
    firstMessage: "¡Hola! Soy tu asesor de carreras. Cuéntame sobre tus intereses, habilidades y qué tipo de ambiente de trabajo disfrutas. ¡Te ayudaré a descubrir el camino profesional perfecto!",
    promptSuffix: "Always respond in Spanish (Español). Never switch to English."
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    flag: '🇫🇷',
    firstMessage: "Bonjour! Je suis votre conseiller de carrière. Parlez-moi de vos intérêts, compétences et du type d'environnement de travail que vous appréciez. Je vous aiderai à découvrir le parcours professionnel parfait!",
    promptSuffix: "Always respond in French (Français). Never switch to English."
  },
  { 
    code: 'zh', 
    name: 'Mandarin', 
    nativeName: '中文', 
    flag: '🇨🇳',
    firstMessage: "你好！我是你的职业顾问。告诉我你的兴趣、技能以及你喜欢什么样的工作环境。我会帮助你找到完美的职业道路！",
    promptSuffix: "Always respond in Mandarin Chinese (中文). Never switch to English."
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪',
    firstMessage: "Hallo! Ich bin Ihr Karriereberater. Erzählen Sie mir von Ihren Interessen, Fähigkeiten und welche Art von Arbeitsumgebung Sie bevorzugen. Ich helfe Ihnen, den perfekten Karriereweg zu finden!",
    promptSuffix: "Always respond in German (Deutsch). Never switch to English."
  },
  { 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português', 
    flag: '🇧🇷',
    firstMessage: "Olá! Sou seu conselheiro de carreira. Conte-me sobre seus interesses, habilidades e que tipo de ambiente de trabalho você gosta. Vou ajudá-lo a descobrir o caminho profissional perfeito!",
    promptSuffix: "Always respond in Portuguese (Português). Never switch to English."
  },
  { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano', 
    flag: '🇮🇹',
    firstMessage: "Ciao! Sono il tuo consulente di carriera. Parlami dei tuoi interessi, competenze e del tipo di ambiente di lavoro che preferisci. Ti aiuterò a scoprire il percorso professionale perfetto!",
    promptSuffix: "Always respond in Italian (Italiano). Never switch to English."
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語', 
    flag: '🇯🇵',
    firstMessage: "こんにちは！私はあなたのキャリアアドバイザーです。あなたの興味、スキル、好きな職場環境について教えてください。完璧なキャリアパスを見つけるお手伝いをします！",
    promptSuffix: "Always respond in Japanese (日本語). Never switch to English."
  },
  { 
    code: 'ko', 
    name: 'Korean', 
    nativeName: '한국어', 
    flag: '🇰🇷',
    firstMessage: "안녕하세요! 저는 당신의 진로 상담사입니다. 당신의 관심사, 기술, 그리고 어떤 직장 환경을 좋아하는지 말씀해 주세요. 완벽한 진로를 찾는 것을 도와드리겠습니다!",
    promptSuffix: "Always respond in Korean (한국어). Never switch to English."
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    flag: '🇮🇳',
    firstMessage: "नमस्ते! मैं आपका करियर सलाहकार हूं। मुझे अपनी रुचियों, कौशल और पसंदीदा कार्य वातावरण के बारे में बताएं। मैं आपको सही करियर पथ खोजने में मदद करूंगा!",
    promptSuffix: "Always respond in Hindi (हिन्दी). Never switch to English."
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    flag: '🇸🇦',
    firstMessage: "مرحباً! أنا مستشارك المهني. أخبرني عن اهتماماتك ومهاراتك ونوع بيئة العمل التي تفضلها. سأساعدك في اكتشاف المسار المهني المثالي!",
    promptSuffix: "Always respond in Arabic (العربية). Never switch to English."
  },
  { 
    code: 'ru', 
    name: 'Russian', 
    nativeName: 'Русский', 
    flag: '🇷🇺',
    firstMessage: "Привет! Я ваш карьерный консультант. Расскажите мне о ваших интересах, навыках и какую рабочую среду вы предпочитаете. Я помогу вам найти идеальный карьерный путь!",
    promptSuffix: "Always respond in Russian (Русский). Never switch to English."
  },
];

export const getLanguageByCode = (code: string): VoiceLanguage => {
  return voiceLanguages.find(lang => lang.code === code) || voiceLanguages[0];
};
