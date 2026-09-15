import PropTypes from 'prop-types';
import { useHolidays } from '../../hooks/useQueries';
import { Calendar, PartyPopper } from 'lucide-react';

const HolidaysList = ({ alpha2Code, countryName }) => {
  const { data: holidays = [], isLoading } = useHolidays(alpha2Code);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="skeleton h-5 w-40 mb-4" />
        <div className="space-y-3">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!holidays || holidays.length === 0) return null;

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-4 h-4 text-accent-3" />
          <span className="section-label text-[10px]">
            Public Holidays · {countryName || 'National'}
          </span>
        </div>
        <span className="text-[11px] font-display text-muted-foreground px-2 py-0.5 rounded bg-white/5 border border-white/5">
          {new Date().getFullYear()} Calendar
        </span>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {holidays.slice(0, 6).map((h, i) => {
          const holidayDate = new Date(h.date);
          const dateFormatted = holidayDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={`${h.date}-${i}`}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-foreground truncate">
                    {h.name}
                  </p>
                  {h.localName && h.localName !== h.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {h.localName}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs font-medium text-foreground/80 flex-shrink-0">
                {dateFormatted}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

HolidaysList.propTypes = {
  alpha2Code: PropTypes.string,
  countryName: PropTypes.string,
};

export default HolidaysList;
