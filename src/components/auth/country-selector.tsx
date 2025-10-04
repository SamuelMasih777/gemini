import { useState, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface CountrySelectorProps {
  value?: Country;
  onSelect: (country: Country) => void;
  placeholder?: string;
}
interface RestCountry {
  name: { common: string };
  cca2: string;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  flag: string;
}

export function CountrySelector({ value, onSelect, placeholder = "Select country..." }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        const data = (await response.json()) as RestCountry[];

        const formattedCountries: Country[] = data
          .filter((country) => country.idd?.root && country.idd?.suffixes?.[0])
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: `${country.idd!.root}${country.idd!.suffixes![0]}`,
            flag: country.flag,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Fallback to popular countries
        setCountries([
          { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
          { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
          { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
          { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
          { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 px-4"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{value.flag}</span>
              <span className="font-medium">{value.dialCode}</span>
              <span className="text-muted-foreground truncate">{value.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading countries..." : "No country found."}
            </CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  onSelect={() => {
                    onSelect(country);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2"
                >
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-muted-foreground">{country.dialCode}</div>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value?.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}