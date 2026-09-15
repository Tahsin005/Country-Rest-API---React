import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useCurrencyRates } from '../../hooks/useQueries';
import { currencyApi } from '../../services/currencyApi';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';

const TARGET_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

const CurrencyConverter = ({ baseCurrencyCode, baseCurrencyName, baseCurrencySymbol }) => {
  const { data: rates, isLoading: loading } = useCurrencyRates();
  const [amount, setAmount] = useState('100');
  const [targetCurrency, setTargetCurrency] = useState('USD');

  const activeBaseCode = baseCurrencyCode || 'USD';

  const converted = useMemo(() => {
    if (!rates || !amount) return null;
    return currencyApi.convert(amount, activeBaseCode, targetCurrency, rates);
  }, [rates, amount, activeBaseCode, targetCurrency]);

  const singleUnitValue = useMemo(() => {
    return rates ? currencyApi.convert(1, activeBaseCode, targetCurrency, rates) : null;
  }, [rates, activeBaseCode, targetCurrency]);

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="section-label text-[10px]">
            Live Currency Exchange {baseCurrencyName ? `· ${baseCurrencyName}` : ''}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-white/5 border border-white/5">
          1 {activeBaseCode} ≈ {singleUnitValue ? singleUnitValue.toFixed(2) : '—'} {targetCurrency}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-input font-mono text-base font-semibold"
              placeholder="Amount"
            />
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 font-display font-bold text-sm min-w-[80px] text-center text-foreground">
            {activeBaseCode} {baseCurrencySymbol ? `(${baseCurrencySymbol})` : ''}
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-display">
            <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
            <span>Convert into</span>
          </div>

          <div className="flex gap-1">
            {TARGET_CURRENCIES.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setTargetCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-all ${
                  targetCurrency === curr
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent-2/10 border border-primary/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-display font-semibold text-muted-foreground">
              Estimated Total
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">
              {loading
                ? '...'
                : converted !== null
                ? converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—'}
            </span>
          </div>
          <span className="font-display text-sm font-bold text-primary px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
            {targetCurrency}
          </span>
        </div>
      </div>
    </div>
  );
};

CurrencyConverter.propTypes = {
  baseCurrencyCode: PropTypes.string,
  baseCurrencyName: PropTypes.string,
  baseCurrencySymbol: PropTypes.string,
};

export default CurrencyConverter;
