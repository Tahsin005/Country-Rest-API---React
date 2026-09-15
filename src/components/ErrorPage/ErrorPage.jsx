import { useNavigate } from "react-router-dom";
import { Compass, Home } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-glow">
        <Compass className="w-10 h-10 text-primary animate-pulse" />
      </div>

      <h1 className="font-display text-7xl md:text-9xl font-bold tracking-tighter text-foreground/15 mb-2 leading-none">
        404
      </h1>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Uncharted Coordinates
      </h2>

      <p className="font-body text-sm text-muted-foreground max-w-sm mb-8">
        The cartographic coordinates you are attempting to navigate to do not exist in this sector.
      </p>

      <button
        onClick={() => navigate('/')}
        className="btn-primary-glass inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to World Atlas</span>
      </button>
    </div>
  );
};

export default ErrorPage;