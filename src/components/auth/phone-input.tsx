import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { CountrySelector, Country } from './country-selector';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: Country | undefined;
  onCountryChange: (country: Country) => void;
  error?: string;
  className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, selectedCountry, onCountryChange, error, className, ...props }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const phoneValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
      onChange(phoneValue);
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex gap-2">
          <div className="w-1/2">
            <CountrySelector
              value={selectedCountry}
              onSelect={onCountryChange}
              placeholder="Country"
            />
          </div>
          <div className="flex-1">
            <Input
              ref={ref}
              type="tel"
              placeholder="Phone number"
              value={value}
              onChange={handlePhoneChange}
              className={cn(
                "h-12 text-lg",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              {...props}
            />
          </div>
        </div>
        {selectedCountry && value && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
            Full number: {selectedCountry.dialCode} {value}
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';