import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; traits: string[] }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'work-style',
    question: 'How do you prefer to work?',
    options: [
      { label: 'Independently, with full control over my tasks', value: 'independent', traits: ['Analytical', 'Self-directed'] },
      { label: 'In a team, collaborating with others', value: 'team', traits: ['Collaborative', 'Social'] },
      { label: 'Leading and managing others', value: 'leader', traits: ['Leadership', 'Strategic'] },
      { label: 'Supporting and helping others succeed', value: 'support', traits: ['Supportive', 'Empathetic'] },
    ],
  },
  {
    id: 'problem-solving',
    question: 'When faced with a problem, you typically:',
    options: [
      { label: 'Analyze data and find logical solutions', value: 'analytical', traits: ['Analytical', 'Logical'] },
      { label: 'Brainstorm creative alternatives', value: 'creative', traits: ['Creative', 'Innovative'] },
      { label: 'Consult with others for different perspectives', value: 'collaborative', traits: ['Collaborative', 'Open-minded'] },
      { label: 'Trust your intuition and act quickly', value: 'intuitive', traits: ['Intuitive', 'Decisive'] },
    ],
  },
  {
    id: 'interests',
    question: 'Which activities excite you the most?',
    options: [
      { label: 'Building or creating things', value: 'building', traits: ['Technology', 'Engineering', 'Design'] },
      { label: 'Helping and teaching people', value: 'helping', traits: ['Education', 'Healthcare', 'Counseling'] },
      { label: 'Analyzing numbers and patterns', value: 'analyzing', traits: ['Finance', 'Data Analysis', 'Research'] },
      { label: 'Writing and communicating ideas', value: 'communicating', traits: ['Writing', 'Marketing', 'Communication'] },
    ],
  },
  {
    id: 'environment',
    question: 'Your ideal work environment is:',
    options: [
      { label: 'Fast-paced and dynamic', value: 'fast', traits: ['Adaptable', 'Energetic'] },
      { label: 'Structured and organized', value: 'structured', traits: ['Organized', 'Detail-oriented'] },
      { label: 'Flexible and remote-friendly', value: 'flexible', traits: ['Independent', 'Self-motivated'] },
      { label: 'Creative and innovative', value: 'creative', traits: ['Creative', 'Visionary'] },
    ],
  },
  {
    id: 'motivation',
    question: 'What motivates you most in a career?',
    options: [
      { label: 'Making a positive impact on society', value: 'impact', traits: ['Purpose-driven', 'Altruistic'] },
      { label: 'Financial success and stability', value: 'financial', traits: ['Ambitious', 'Goal-oriented'] },
      { label: 'Learning new skills and growing', value: 'growth', traits: ['Curious', 'Growth-mindset'] },
      { label: 'Recognition and achievement', value: 'recognition', traits: ['Competitive', 'Achievement-oriented'] },
    ],
  },
  {
    id: 'strengths',
    question: 'Which strength describes you best?',
    options: [
      { label: 'Technical skills and expertise', value: 'technical', traits: ['Technical', 'Problem-solving'] },
      { label: 'Communication and persuasion', value: 'communication', traits: ['Communicative', 'Persuasive'] },
      { label: 'Creativity and innovation', value: 'creativity', traits: ['Creative', 'Innovative'] },
      { label: 'Organization and planning', value: 'organization', traits: ['Organized', 'Strategic'] },
    ],
  },
];

interface PersonalityQuizProps {
  onComplete: (result: {
    interests: string[];
    personality: string[];
    career: string;
    reasoning: string;
  }) => void;
  onCancel: () => void;
}

export function PersonalityQuiz({ onComplete, onCancel }: PersonalityQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleSelect = (value: string, traits: string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    setSelectedTraits([...selectedTraits, ...traits]);
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Deduplicate and categorize traits
    const uniqueTraits = [...new Set(selectedTraits)];
    const personalityTraits = uniqueTraits.filter(t => 
      ['Analytical', 'Creative', 'Collaborative', 'Leadership', 'Empathetic', 'Organized', 
       'Innovative', 'Strategic', 'Decisive', 'Curious', 'Ambitious', 'Communicative'].includes(t)
    );
    const interestTraits = uniqueTraits.filter(t => 
      ['Technology', 'Engineering', 'Design', 'Education', 'Healthcare', 'Finance', 
       'Data Analysis', 'Research', 'Writing', 'Marketing', 'Communication', 'Counseling'].includes(t)
    );

    try {
      // Call AI to get career recommendation based on quiz results
      const { data, error } = await supabase.functions.invoke('career-chat', {
        body: {
          messages: [{
            role: 'user',
            content: `Based on this personality quiz, recommend ONE specific career. 
            
Personality traits: ${personalityTraits.join(', ')}
Interests: ${interestTraits.join(', ')}
Work style: ${answers['work-style']}
Problem solving: ${answers['problem-solving']}
Motivation: ${answers['motivation']}
Preferred environment: ${answers['environment']}

Respond in this exact JSON format only, no other text:
{"career": "Career Name", "reasoning": "2-3 sentence explanation of why this career fits"}`
          }]
        }
      });

      if (error) throw error;

      // Parse the AI response
      let career = 'Software Engineer';
      let reasoning = 'Based on your analytical nature and interest in technology, this career aligns well with your strengths.';

      try {
        const parsed = JSON.parse(data.response || data.generatedText || '{}');
        if (parsed.career) career = parsed.career;
        if (parsed.reasoning) reasoning = parsed.reasoning;
      } catch {
        // Use defaults if parsing fails
        console.log('Using default career recommendation');
      }

      onComplete({
        interests: interestTraits.length > 0 ? interestTraits : ['Technology', 'Problem-solving'],
        personality: personalityTraits.length > 0 ? personalityTraits : ['Analytical', 'Creative'],
        career,
        reasoning,
      });
    } catch (error) {
      console.error('Error getting career recommendation:', error);
      // Fallback recommendation based on quiz answers
      const fallbackCareer = getFallbackCareer(answers, personalityTraits, interestTraits);
      onComplete(fallbackCareer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentAnswered = answers[currentQuestion?.id];
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  return (
    <Card className="w-full max-w-lg bg-card border-border shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentStep + 1} of {quizQuestions.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
            Cancel
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-xl font-serif mt-4">{currentQuestion.question}</CardTitle>
        <CardDescription>Select the option that best describes you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value, option.traits)}
              className={`w-full p-4 text-left rounded-lg border transition-all ${
                answers[currentQuestion.id] === option.value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentAnswered || isSubmitting}
              className="gap-2 bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get My Career Match'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getFallbackCareer(
  answers: Record<string, string>,
  personality: string[],
  interests: string[]
): { interests: string[]; personality: string[]; career: string; reasoning: string } {
  const careerMap: Record<string, { career: string; reasoning: string }> = {
    'technical-analytical': {
      career: 'Data Scientist',
      reasoning: 'Your analytical mindset and technical skills make you well-suited for data-driven roles where you can solve complex problems.',
    },
    'creative-communicating': {
      career: 'UX Designer',
      reasoning: 'Your creativity combined with strong communication skills positions you perfectly for designing user experiences.',
    },
    'helping-collaborative': {
      career: 'Human Resources Manager',
      reasoning: 'Your empathetic nature and desire to help others thrive makes HR an excellent career path for you.',
    },
    'building-independent': {
      career: 'Software Engineer',
      reasoning: 'Your love for building things and working independently aligns perfectly with software development.',
    },
    'analyzing-structured': {
      career: 'Financial Analyst',
      reasoning: 'Your analytical skills and preference for structured environments make financial analysis an ideal fit.',
    },
  };

  const key = `${answers['interests']}-${answers['work-style']}`;
  const fallback = careerMap[key] || {
    career: 'Project Manager',
    reasoning: 'Your diverse skill set and adaptable nature make you well-suited for coordinating complex projects and teams.',
  };

  return {
    interests: interests.length > 0 ? interests : ['Problem-solving', 'Communication'],
    personality: personality.length > 0 ? personality : ['Adaptable', 'Organized'],
    ...fallback,
  };
}
