'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import HistoryPanel from './HistoryPanel';

export interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.calculations || []);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, fetchHistory]);

  const saveCalculation = useCallback(async (expr: string, result: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result }),
      });
      if (showHistory) {
        fetchHistory();
      }
    } catch (e) {
      console.error('Failed to save calculation', e);
    }
  }, [showHistory, fetchHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }, []);

  const handleReset = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
    setHasError(false);
  }, []);

  const handleDigit = useCallback((digit: string) => {
    if (hasError) handleReset();

    setDisplay((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      if (prev === '0' && digit !== '.') return digit;
      if (digit === '.' && prev.includes('.')) return prev;
      return prev + digit;
    });
  }, [hasError, waitingForOperand, handleReset]);

  const handleOperator = useCallback((op: string) => {
    if (hasError) return;

    const current = parseFloat(display);

    if (prevValue !== null && operator && !waitingForOperand) {
      const prev = parseFloat(prevValue);
      let result: number;
      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '−':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            setDisplay('Error');
            setHasError(true);
            setExpression('Division by zero');
            return;
          }
          result = prev / current;
          break;
        default:
          result = current;
      }
      const resultStr = formatResult(result);
      setDisplay(resultStr);
      setExpression(`${resultStr} ${op}`);
      setPrevValue(resultStr);
    } else {
      setExpression(`${display} ${op}`);
      setPrevValue(display);
    }

    setOperator(op);
    setWaitingForOperand(true);
  }, [display, hasError, operator, prevValue, waitingForOperand]);

  const handleEquals = useCallback(() => {
    if (hasError || operator === null || prevValue === null) return;

    const current = parseFloat(display);
    const prev = parseFloat(prevValue);
    let result: number;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '−':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          setDisplay('Error');
          setHasError(true);
          setExpression('Division by zero');
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    const resultStr = formatResult(result);
    const fullExpr = `${prevValue} ${operator} ${display}`;

    setExpression(fullExpr + ' =');
    setDisplay(resultStr);
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(true);

    saveCalculation(fullExpr, resultStr);
  }, [display, hasError, operator, prevValue, saveCalculation]);

  const handleBackspace = useCallback(() => {
    if (hasError) {
      handleReset();
      return;
    }
    if (waitingForOperand) return;
    setDisplay((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  }, [hasError, waitingForOperand, handleReset]);

  const handleHistoryClick = useCallback((result: string) => {
    setDisplay(result);
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
    setHasError(false);
    setExpression('');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleReset]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-3xl">
      <div className="flex flex-col gap-0">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden w-80">
          <div className="p-4 bg-slate-900 flex justify-between items-center">
            <span className="text-slate-400 text-sm font-semibold tracking-wide uppercase">Calculator</span>
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="text-slate-400 hover:text-white transition-colors text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
          <Display display={display} expression={expression} hasError={hasError} />
          <ButtonGrid
            onDigit={handleDigit}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleReset}
            onBackspace={handleBackspace}
          />
        </div>
        <p className="text-slate-500 text-xs text-center mt-3">Keyboard shortcuts supported</p>
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          loading={historyLoading}
          onClear={clearHistory}
          onSelect={handleHistoryClick}
          onRefresh={fetchHistory}
        />
      )}
    </div>
  );
}

function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error';
  // Avoid floating point display issues
  const str = parseFloat(value.toPrecision(12)).toString();
  return str;
}
