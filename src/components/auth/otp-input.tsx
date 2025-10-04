import { forwardRef, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  className?: string;
}

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  ({ value, onChange, length = 6, error, className }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, inputValue: string) => {
      const digit = inputValue.replace(/\D/g, '').slice(-1); // Only last digit
      const newValue = value.split('');
      newValue[index] = digit;
      
      const updatedValue = newValue.join('').slice(0, length);
      onChange(updatedValue);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange(pastedData);
      
      // Focus appropriate input after paste
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex gap-2 justify-center">
          {Array.from({ length }, (_, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
                if (index === 0 && ref) {
                  if (typeof ref === 'function') {
                    ref(el);
                  } else {
                    ref.current = el;
                  }
                }
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                "w-12 h-12 text-center text-lg font-semibold",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';