import PropTypes from 'prop-types';
import { useWikiSummary } from '../../hooks/useQueries';
import { BookOpen, ExternalLink } from 'lucide-react';

const WikiSummary = ({ countryName }) => {
  const { data: wiki, isLoading } = useWikiSummary(countryName);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="skeleton h-5 w-48 mb-4" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-5/6 mb-2" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    );
  }

  if (!wiki || !wiki.extract) return null;

  return (
    <div className="glass-card glass-shimmer p-6 md:p-8 rounded-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent-2" />
          <span className="section-label text-[10px]">Culture & History · Wikipedia</span>
        </div>
        {wiki.pageUrl && (
          <a
            href={wiki.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display flex items-center gap-1 text-primary hover:text-accent-2 transition-colors"
          >
            <span>Read full article</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {wiki.thumbnail && (
          <div className="w-full md:w-48 h-36 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group/img">
            <img
              src={wiki.thumbnail}
              alt={wiki.title}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="flex-1">
          <h4 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">
            {wiki.description || wiki.title}
          </h4>
          <p className="font-body text-sm leading-[1.8] text-foreground/80">
            {wiki.extract}
          </p>
        </div>
      </div>
    </div>
  );
};

WikiSummary.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default WikiSummary;
