import { useState, useEffect } from 'react';
import { useAllCountries } from '../../hooks/useQueries';
import { Trophy, Flame, RotateCcw, Check, X, Compass, Award } from 'lucide-react';

const QUESTION_COUNT = 10;

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const Quiz = () => {
  const { data: countries = [], isLoading: loading } = useAllCountries();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const generateQuestions = (dataset) => {
    if (!dataset || dataset.length < 10) return [];

    const validCountries = dataset.filter(
      (c) => c.names?.common && c.flag?.url_svg && c.capitals?.[0]?.name && c.region
    );

    const questionTypes = ['flag', 'capital', 'region'];
    const generated = [];

    for (let i = 0; i < QUESTION_COUNT; i++) {
      const type = questionTypes[i % questionTypes.length];
      const targetCountry = validCountries[Math.floor(Math.random() * validCountries.length)];

      // Pick 3 random distractor countries
      const distractors = shuffleArray(
        validCountries.filter((c) => c.names.common !== targetCountry.names.common)
      ).slice(0, 3);

      let questionText = '';
      let correctAnswer = '';
      let options = [];

      if (type === 'flag') {
        questionText = 'Which country flies this national flag?';
        correctAnswer = targetCountry.names.common;
        options = shuffleArray([targetCountry.names.common, ...distractors.map((d) => d.names.common)]);
      } else if (type === 'capital') {
        questionText = `What is the capital city of ${targetCountry.names.common}?`;
        correctAnswer = targetCountry.capitals[0].name;
        options = shuffleArray([
          targetCountry.capitals[0].name,
          ...distractors.map((d) => d.capitals[0]?.name || 'Geneva'),
        ]);
      } else {
        questionText = `Which continent or region is ${targetCountry.names.common} located in?`;
        correctAnswer = targetCountry.region;
        const allRegions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
        const otherRegions = allRegions.filter((r) => r !== targetCountry.region);
        options = shuffleArray([targetCountry.region, ...shuffleArray(otherRegions).slice(0, 3)]);
      }

      generated.push({
        id: i,
        type,
        targetCountry,
        questionText,
        correctAnswer,
        options,
      });
    }

    return generated;
  };

  const startNewQuiz = () => {
    if (countries.length > 0) {
      const qs = generateQuestions(countries);
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setQuizFinished(false);
    }
  };

  useEffect(() => {
    if (countries.length > 0 && questions.length === 0) {
      const qs = generateQuestions(countries);
      setQuestions(qs);
    }
  }, [countries, questions.length]);

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      const newScore = score + 10 + streak * 2;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="skeleton h-12 w-48 mx-auto mb-6 rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <Compass className="w-4 h-4 text-accent-2" />
          <span className="section-label text-[10px]">Atlas Quest · Geography Trivia</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            World Explorer{' '}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-2 to-primary">
            Challenge
          </span>
        </h1>
      </div>

      {!quizFinished && currentQ ? (
        <div className="glass-card glass-shimmer p-6 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                Question {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {streak >= 2 && (
                <div className="flex items-center gap-1 text-xs font-display font-bold text-amber-400 animate-pulse">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{streak} Streak!</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 font-mono text-xs font-bold text-primary">
                <Trophy className="w-3.5 h-3.5" />
                <span>{score} pts</span>
              </div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-2 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="text-center mb-8">
            {currentQ.type === 'flag' && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQ.targetCountry.flag?.url_svg}
                  alt="Flag quiz"
                  className="w-44 h-28 object-contain rounded-2xl border border-white/10 shadow-2xl bg-white/5 p-1"
                />
              </div>
            )}
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {currentQ.questionText}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-foreground';

              if (isAnswered) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                } else if (option === selectedOption) {
                  btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                } else {
                  btnStyle = 'opacity-40 border-transparent text-muted-foreground';
                }
              }

              return (
                <button
                  key={`${option}-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl border text-left font-display font-semibold text-sm transition-all duration-300 flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && option === currentQ.correctAnswer && (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                  )}
                  {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && (
                    <X className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="btn-primary-glass px-8 py-3 text-sm font-bold"
              >
                {currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score & Celebration */
        <div className="glass-card glass-shimmer p-10 rounded-3xl text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent-2 mx-auto flex items-center justify-center mb-6 shadow-glow">
            <Award className="w-10 h-10 text-white" />
          </div>

          <span className="section-label text-xs">Mission Completed</span>
          <h2 className="font-display text-4xl font-bold text-foreground mt-2 mb-2">
            {score >= 80 ? 'Grand Cartographer' : score >= 50 ? 'Master Navigator' : 'Apprentice Explorer'}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            You conquered the geography trivia with sharp cartographic instincts.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-muted-foreground font-display">Final Score</span>
              <p className="font-mono text-3xl font-bold text-primary mt-1">{score}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-muted-foreground font-display">Max Streak</span>
              <p className="font-mono text-3xl font-bold text-accent-2 mt-1">{maxStreak} 🔥</p>
            </div>
          </div>

          <button
            onClick={startNewQuiz}
            className="btn-primary-glass px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
