'use client';

interface ButtonGridProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
}

type ButtonConfig = {
  label: string;
  type: 'digit' | 'operator' | 'equals' | 'clear' | 'backspace' | 'special';
  value?: string;
  wide?: boolean;
};

const buttons: ButtonConfig[][] = [
  [
    { label: 'C', type: 'clear' },
    { label: '⌫', type: 'backspace' },
    { label: '%', type: 'special', value: '%' },
    { label: '÷', type: 'operator', value: '÷' },
  ],
  [
    { label: '7', type: 'digit', value: '7' },
    { label: '8', type: 'digit', value: '8' },
    { label: '9', type: 'digit', value: '9' },
    { label: '×', type: 'operator', value: '×' },
  ],
  [
    { label: '4', type: 'digit', value: '4' },
    { label: '5', type: 'digit', value: '5' },
    { label: '6', type: 'digit', value: '6' },
    { label: '−', type: 'operator', value: '−' },
  ],
  [
    { label: '1', type: 'digit', value: '1' },
    { label: '2', type: 'digit', value: '2' },
    { label: '3', type: 'digit', value: '3' },
    { label: '+', type: 'operator', value: '+' },
  ],
  [
    { label: '0', type: 'digit', value: '0', wide: true },
    { label: '.', type: 'digit', value: '.' },
    { label: '=', type: 'equals' },
  ],
];

export default function ButtonGrid({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
}: ButtonGridProps) {
  const getButtonStyle = (btn: ButtonConfig) => {
    const base =
      'flex items-center justify-center rounded-xl font-medium text-lg transition-all duration-100 active:scale-95 select-none cursor-pointer h-14 ';
    switch (btn.type) {
      case 'clear':
        return base + 'bg-red-500 hover:bg-red-400 text-white shadow-lg';
      case 'backspace':
        return base + 'bg-slate-600 hover:bg-slate-500 text-white shadow-md';
      case 'operator':
        return base + 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg text-xl';
      case 'equals':
        return base + 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg text-xl';
      case 'special':
        return base + 'bg-slate-600 hover:bg-slate-500 text-slate-200 shadow-md';
      default:
        return base + 'bg-slate-700 hover:bg-slate-600 text-white shadow-md';
    }
  };

  const handleClick = (btn: ButtonConfig) => {
    switch (btn.type) {
      case 'digit':
        onDigit(btn.value!);
        break;
      case 'operator':
        onOperator(btn.value!);
        break;
      case 'equals':
        onEquals();
        break;
      case 'clear':
        onClear();
        break;
      case 'backspace':
        onBackspace();
        break;
      case 'special':
        // percent handled as divide by 100
        if (btn.value === '%') {
          onOperator('÷');
          onDigit('1');
          onDigit('0');
          onDigit('0');
          onEquals();
        }
        break;
    }
  };

  return (
    <div className="p-4 bg-slate-800 flex flex-col gap-3">
      {buttons.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-4 gap-3">
          {row.map((btn) => (
            <button
              key={btn.label}
              onClick={() => handleClick(btn)}
              className={`${getButtonStyle(btn)} ${
                btn.wide ? 'col-span-2' : 'col-span-1'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
