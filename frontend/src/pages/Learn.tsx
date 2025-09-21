import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import TruthLensHeader from "@/components/TruthLensHeader"
import TruthLensFooter from "@/components/TruthLensFooter"

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
}

interface CourseModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  lessons: CourseLesson[];
  quiz?: Quiz;
  completed: boolean;
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'infographic';
  content: string;
  mediaUrl?: string;
  completed: boolean;
}

const Learn: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Sample quiz data
  const sampleQuiz: Quiz = {
    id: "intro-quiz",
    title: "Misinformation Basics Quiz",
    questions: [
      {
        id: "q1",
        question: "What is the most important first step when evaluating information online?",
        options: [
          "Share it immediately with friends",
          "Check the source and date of publication",
          "Count how many likes it has",
          "Ask your family members"
        ],
        correctAnswer: 1,
        explanation: "Always verify the source and check when the information was published. Credible sources and recent dates are key indicators of reliability."
      },
      {
        id: "q2", 
        question: "Which of these is a red flag for potential misinformation?",
        options: [
          "Information from government websites",
          "News with multiple credible sources cited",
          "Emotional language designed to provoke anger",
          "Articles with author names and credentials"
        ],
        correctAnswer: 2,
        explanation: "Emotional language that aims to provoke strong reactions is often used in misinformation to bypass critical thinking."
      },
      {
        id: "q3",
        question: "What should you do if you're unsure about information you've seen?",
        options: [
          "Share it with a warning that you're not sure",
          "Ignore it completely",
          "Fact-check it using multiple reliable sources",
          "Wait for someone else to verify it"
        ],
        correctAnswer: 2,
        explanation: "When uncertain, always fact-check using multiple independent and reliable sources before drawing conclusions or sharing."
      }
    ]
  };

  // Sample course modules
  const [courseModules, setCourseModules] = useState<CourseModule[]>([
    {
      id: "intro",
      title: "Understanding Misinformation",
      icon: "🧠",
      description: "Learn the basics of identifying and understanding misinformation in the digital age.",
      completed: false,
      lessons: [
        {
          id: "lesson1",
          title: "What is Misinformation?",
          type: "text",
          content: "Misinformation refers to false or inaccurate information that is spread, regardless of whether there is intent to mislead. It differs from disinformation, which is deliberately false information spread with intent to deceive.",
          completed: false
        },
        {
          id: "lesson2", 
          title: "Types of False Information",
          type: "infographic",
          content: "There are several categories of false information: Fabricated content (completely false), Manipulated content (genuine information altered), False context (genuine content shared with false contextual information), and Misleading content (genuine information used to frame an issue or individual falsely).",
          mediaUrl: "/api/placeholder/600/400",
          completed: false
        },
        {
          id: "lesson3",
          title: "The Psychology Behind Misinformation",
          type: "video",
          content: "Understanding why people believe and share misinformation is crucial. Cognitive biases, emotional triggers, and social proof all play roles in how misinformation spreads.",
          mediaUrl: "/api/placeholder/video/intro",
          completed: false
        }
      ],
      quiz: sampleQuiz
    },
    {
      id: "source-verification",
      title: "Source Verification Techniques", 
      icon: "🔍",
      description: "Master the art of evaluating sources and verifying the credibility of information.",
      completed: false,
      lessons: [
        {
          id: "sv-lesson1",
          title: "Evaluating Website Credibility",
          type: "text",
          content: "Learn to assess websites by checking domain authority, publication date, author credentials, contact information, and cross-referencing with known reliable sources.",
          completed: false
        },
        {
          id: "sv-lesson2",
          title: "Reverse Image Search",
          type: "video", 
          content: "Master reverse image search techniques to verify the authenticity and context of images shared online.",
          mediaUrl: "/api/placeholder/video/reverse-search",
          completed: false
        }
      ]
    },
    {
      id: "digital-literacy",
      title: "Digital Media Literacy",
      icon: "📱",
      description: "Develop skills to critically analyze digital media and social media content.", 
      completed: false,
      lessons: [
        {
          id: "dl-lesson1",
          title: "Social Media Algorithms",
          type: "text",
          content: "Understand how social media algorithms work and how they can create echo chambers and filter bubbles that facilitate misinformation spread.",
          completed: false
        },
        {
          id: "dl-lesson2",
          title: "Deepfakes and AI-Generated Content", 
          type: "video",
          content: "Learn to identify AI-generated content, deepfakes, and other synthetic media that can be used to spread misinformation.",
          mediaUrl: "/api/placeholder/video/deepfakes",
          completed: false
        }
      ]
    },
    {
      id: "fact-checking",
      title: "Fact-Checking Tools & Techniques",
      icon: "✅",
      description: "Learn to use professional fact-checking tools and methodologies effectively.",
      completed: false, 
      lessons: [
        {
          id: "fc-lesson1",
          title: "Professional Fact-Checking Websites",
          type: "text",
          content: "Discover reliable fact-checking organizations like Snopes, FactCheck.org, PolitiFact, and local fact-checkers in India.",
          completed: false
        },
        {
          id: "fc-lesson2",
          title: "Using Verification Tools",
          type: "infographic",
          content: "Learn to use tools like Google Reverse Image Search, TinEye, Wayback Machine, and other verification platforms.",
          mediaUrl: "/api/placeholder/600/400",
          completed: false
        }
      ]
    }
  ]);

  const toggleModule = (moduleId: string) => {
    if (openModules.includes(moduleId)) {
      setOpenModules(openModules.filter(id => id !== moduleId));
    } else {
      setOpenModules([...openModules, moduleId]);
    }
  };

  const startLesson = (moduleId: string, lessonId: string) => {
    setActiveModule(moduleId);
    setActiveLesson(lessonId);
    setActiveQuiz(null);
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setActiveModule(null);
    setActiveLesson(null);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const result: QuizResult = {
      score: Math.round((correctCount / activeQuiz.questions.length) * 100),
      totalQuestions: activeQuiz.questions.length,
      answers: quizAnswers
    };

    setQuizResult(result);
  };

  const retryQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
  };

  const completeLesson = (moduleId: string, lessonId: string) => {
    setCourseModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        );
        const allLessonsCompleted = updatedLessons.every(lesson => lesson.completed);
        return {
          ...module,
          lessons: updatedLessons,
          completed: allLessonsCompleted
        };
      }
      return module;
    }));
  };

  const renderLessonContent = (lesson: CourseLesson) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{lesson.title}</h2>
          <Button 
            onClick={() => completeLesson(activeModule!, lesson.id)}
            disabled={lesson.completed}
            variant={lesson.completed ? "secondary" : "default"}
          >
            {lesson.completed ? "✅ Completed" : "Mark Complete"}
          </Button>
        </div>

        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {lesson.content}
          </p>
        </div>

        {lesson.mediaUrl && (
          <div className="mt-6">
            {lesson.type === 'image' || lesson.type === 'infographic' ? (
              <div className="bg-secondary/10 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">🖼️</div>
                <p className="text-muted-foreground">
                  Media content would be displayed here
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  URL: {lesson.mediaUrl}
                </p>
              </div>
            ) : lesson.type === 'video' ? (
              <div className="bg-secondary/10 p-8 rounded-lg text-center">
                <div className="text-4xl mb-4">🎥</div>
                <p className="text-muted-foreground">
                  Video content would be displayed here
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  URL: {lesson.mediaUrl}
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setActiveLesson(null)}
          >
            ← Back to Course
          </Button>
          {!lesson.completed && (
            <Button onClick={() => completeLesson(activeModule!, lesson.id)}>
              Complete Lesson
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!activeQuiz) return null;

    if (quizResult) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quiz Results</h2>
            <div className={`text-6xl font-bold mb-4 ${
              quizResult.score >= 70 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quizResult.score}%
            </div>
            <p className="text-muted-foreground mb-6">
              You scored {quizResult.score >= 70 ? '🎉 Great job!' : '📚 Keep learning!'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeQuiz.questions.map((question, index) => {
                const userAnswer = quizResult.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700 mt-1">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setActiveQuiz(null)}>
              ← Back to Course
            </Button>
            <Button onClick={retryQuiz}>
              Retry Quiz
            </Button>
            {quizResult.score >= 70 && (
              <Button className="bg-green-600 hover:bg-green-700">
                Continue to Next Module →
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">{activeQuiz.title}</h2>
          <p className="text-muted-foreground">
            Answer all questions and click submit to see your results.
          </p>
        </div>

        <div className="space-y-6">
          {activeQuiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        quizAnswers[question.id] === optionIndex
                          ? 'border-truthlens-primary bg-truthlens-primary/10'
                          : 'border-border hover:bg-secondary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={quizAnswers[question.id] === optionIndex}
                        onChange={() => handleQuizAnswer(question.id, optionIndex)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        quizAnswers[question.id] === optionIndex
                          ? 'border-truthlens-primary bg-truthlens-primary'
                          : 'border-border'
                      }`}>
                        {quizAnswers[question.id] === optionIndex && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-sm text-card-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => setActiveQuiz(null)}>
            ← Back to Course
          </Button>
          <Button 
            onClick={submitQuiz}
            disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    );
  };

  if (activeLesson) {
    const currentModule = courseModules.find(m => m.id === activeModule);
    const currentLesson = currentModule?.lessons.find(l => l.id === activeLesson);
    if (currentLesson) {
      return (
        <div className="min-h-screen flex flex-col">
          <TruthLensHeader />
          <main className="flex-1 py-8">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="max-w-4xl mx-auto">
                {renderLessonContent(currentLesson)}
              </div>
            </div>
          </main>
          <TruthLensFooter />
        </div>
      );
    }
  }

  if (activeQuiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <TruthLensHeader />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              {renderQuiz()}
            </div>
          </div>
        </main>
        <TruthLensFooter />
      </div>
    );
  }

  const completedModules = courseModules.filter(m => m.completed).length;
  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = courseModules.reduce((acc, m) => 
    acc + m.lessons.filter(l => l.completed).length, 0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: "var(--truthlens-gradient)" }}
          />
          <div className="container relative mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn to Identify Misinformation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive educational framework to become a digital fact-checker
              </p>

              {/* Progress Overview */}
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <div className="text-3xl font-bold text-truthlens-primary mb-2">
                    {completedModules}/{courseModules.length}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Modules Completed
                  </div>
                </div>
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <div className="text-3xl font-bold text-truthlens-primary mb-2">
                    {completedLessons}/{totalLessons}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Lessons Completed
                  </div>
                </div>
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <div className="text-3xl font-bold text-truthlens-primary mb-2">
                    {Math.round((completedLessons / totalLessons) * 100)}%
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Overall Progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {courseModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <Collapsible 
                    open={openModules.includes(module.id)} 
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{module.icon}</div>
                            <div className="text-left">
                              <CardTitle className="flex items-center gap-2">
                                {module.title}
                                {module.completed && (
                                  <span className="text-green-600">✅</span>
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {module.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-muted-foreground">
                            {openModules.includes(module.id) ? '▲' : '▼'}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>
                              {module.lessons.filter(l => l.completed).length}/{module.lessons.length} lessons
                            </span>
                          </div>
                          <Progress 
                            value={(module.lessons.filter(l => l.completed).length / module.lessons.length) * 100}
                            className="h-2"
                          />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Lessons */}
                          <div>
                            <h4 className="font-medium mb-3 text-muted-foreground">Lessons</h4>
                            <div className="space-y-2">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      lesson.completed 
                                        ? 'border-green-500 bg-green-500' 
                                        : 'border-muted-foreground'
                                    }`}>
                                      {lesson.completed ? (
                                        <span className="text-white text-xs">✓</span>
                                      ) : null}
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm">{lesson.title}</div>
                                      <div className="text-xs text-muted-foreground capitalize">
                                        {lesson.type} Content
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={lesson.completed ? "secondary" : "default"}
                                    onClick={() => startLesson(module.id, lesson.id)}
                                  >
                                    {lesson.completed ? "Review" : "Start"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quiz */}
                          {module.quiz && (
                            <div>
                              <h4 className="font-medium mb-3 text-muted-foreground">Assessment</h4>
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-blue-900">
                                      📝 {module.quiz.title}
                                    </div>
                                    <div className="text-sm text-blue-700">
                                      {module.quiz.questions.length} questions • Test your knowledge
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => startQuiz(module.quiz!)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Take Quiz
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <TruthLensFooter />
    </div>
  )
}

export default Learn