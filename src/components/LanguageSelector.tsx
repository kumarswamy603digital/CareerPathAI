import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { voiceLanguages, VoiceLanguage } from '@/lib/voiceLanguages';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  variant = 'default',
  disabled = false,
}: LanguageSelectorProps) {
  const currentLang = voiceLanguages.find(l => l.code === selectedLanguage) || voiceLanguages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={variant === 'compact' ? 'sm' : 'default'}
          disabled={disabled}
          className={cn(
            "gap-2",
            variant === 'compact' && "h-8 px-2 text-xs"
          )}
        >
          <span className="text-base">{currentLang.flag}</span>
          {variant === 'default' && (
            <span>{currentLang.name}</span>
          )}
          <Globe className={cn("text-muted-foreground", variant === 'compact' ? "w-3 h-3" : "w-4 h-4")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
        {voiceLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              <span className="text-muted-foreground text-xs">({lang.nativeName})</span>
            </div>
            {selectedLanguage === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
