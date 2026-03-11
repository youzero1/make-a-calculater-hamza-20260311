'use client';

import { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

type Operator = '+' | '-' | '×' | '÷' | null;

export default function Calculator() {
  const [current, setCurrent] = useState<string>('0');
  const [previous, setPrevious] = useState<string>('');
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setCurrent(digit);
        setWaitingForOperand(false);
      } else {
        setCurrent(current === '0' ? digit : current + digit);
      }
    },
    [current, waitingForOperand]
  );

  const handleDecimal = useCallback(() => {
    if (waitingForOperand) {
      setCurrent('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!current.includes('.')) {
      setCurrent(current + '.');
    }
  }, [current, waitingForOperand]);

  const handleClear = useCallback(() => {
    setCurrent('0');
    setPrevious('');
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
    setSaveStatus('');
  }, []);

  const handleToggleSign = useCallback(() => {
    setCurrent((prev) =>
      prev.startsWith('-') ? prev.slice(1) : prev === '0' ? '0' : '-' + prev
    );
  }, []);

  const handlePercent = useCallback(() => {
    const value = parseFloat(current);
    if (!isNaN(value)) {
      setCurrent(String(value / 100));
    }
  }, [current]);

  const calculate = useCallback(
    (a: number, op: Operator, b: number): number | string => {
      switch (op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '×':
          return a * b;
        case '÷':
          if (b === 0) return 'Error';
          return a / b;
        default:
          return b;
      }
    },
    []
  );

  const formatResult = (value: number | string): string => {
    if (value === 'Error') return 'Error';
    const num = value as number;
    if (!isFinite(num)) return 'Error';
    // Avoid floating point display issues
    const str = parseFloat(num.toPrecision(12)).toString();
    return str;
  };

  const saveCalculation = async (expr: string, res: string) => {
    try {
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result: res }),
      });
      if (response.ok) {
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  };

  const handleOperator = useCallback(
    (op: Operator) => {
      const currentValue = parseFloat(current);

      if (operator && !waitingForOperand) {
        const previousValue = parseFloat(previous);
        const result = calculate(previousValue, operator, currentValue);
        const formattedResult = formatResult(result);
        const expr = `${previous} ${operator} ${current}`;
        setExpression(`${formattedResult} ${op}`);
        setCurrent(formattedResult);
        setPrevious(formattedResult);
      } else {
        setPrevious(current);
        setExpression(`${current} ${op}`);
      }

      setOperator(op);
      setWaitingForOperand(true);
    },
    [current, previous, operator, waitingForOperand, calculate]
  );

  const handleEquals = useCallback(async () => {
    if (!operator || waitingForOperand) return;

    const currentValue = parseFloat(current);
    const previousValue = parseFloat(previous);
    const result = calculate(previousValue, operator, currentValue);
    const formattedResult = formatResult(result);
    const expr = `${previous} ${operator} ${current}`;

    setExpression(`${expr} =`);
    setCurrent(formattedResult);
    setPrevious('');
    setOperator(null);
    setWaitingForOperand(true);

    if (formattedResult !== 'Error') {
      await saveCalculation(expr, formattedResult);
    }
  }, [current, previous, operator, waitingForOperand, calculate]);

  const buttons = [
    { label: 'C', variant: 'clear' as const, action: handleClear },
    { label: '+/-', variant: 'default' as const, action: handleToggleSign },
    { label: '%', variant: 'default' as const, action: handlePercent },
    { label: '÷', variant: 'operator' as const, action: () => handleOperator('÷') },
    { label: '7', variant: 'default' as const, action: () => handleDigit('7') },
    { label: '8', variant: 'default' as const, action: () => handleDigit('8') },
    { label: '9', variant: 'default' as const, action: () => handleDigit('9') },
    { label: '×', variant: 'operator' as const, action: () => handleOperator('×') },
    { label: '4', variant: 'default' as const, action: () => handleDigit('4') },
    { label: '5', variant: 'default' as const, action: () => handleDigit('5') },
    { label: '6', variant: 'default' as const, action: () => handleDigit('6') },
    { label: '-', variant: 'operator' as const, action: () => handleOperator('-') },
    { label: '1', variant: 'default' as const, action: () => handleDigit('1') },
    { label: '2', variant: 'default' as const, action: () => handleDigit('2') },
    { label: '3', variant: 'default' as const, action: () => handleDigit('3') },
    { label: '+', variant: 'operator' as const, action: () => handleOperator('+') },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-gray-800 rounded-2xl p-5 shadow-2xl w-full max-w-sm">
        <Display expression={expression} current={current} />

        {saveStatus && (
          <div className="text-green-400 text-center text-sm mb-2 animate-pulse">
            {saveStatus}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              label={btn.label}
              onClick={btn.action}
              variant={btn.variant}
            />
          ))}

          {/* Zero button spans 2 columns */}
          <Button
            label="0"
            onClick={() => handleDigit('0')}
            variant="zero"
          />
          <Button
            label="."
            onClick={handleDecimal}
            variant="default"
          />
          <Button
            label="="
            onClick={handleEquals}
            variant="equals"
          />
        </div>

        <div className="mt-4 text-center">
          <a
            href="/history"
            className="text-amber-400 hover:text-amber-300 text-sm underline transition-colors"
          >
            View Calculation History →
          </a>
        </div>
      </div>
    </div>
  );
}
