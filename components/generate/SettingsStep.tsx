import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Skull, Loader2 } from 'lucide-react'
import { GenerationSettings } from '@/types/generate'
import { CONTENT_TYPES, TONES, WRITING_LEVELS } from '@/lib/constants'
import * as CountryFlags from 'country-flag-icons/react/3x2'

// Add PirateFlag component
const PirateFlag = () => (
  <div className="bg-black w-5 h-4 flex items-center justify-center inline-flex mr-1">
    <Skull className="w-3 h-3 text-white" />
  </div>
);

const LANGUAGES = [
    { code: 'ar', name: 'Arabic', countryCode: 'SA', FlagComponent: CountryFlags.SA },
    { code: 'bn', name: 'Bengali', countryCode: 'BD', FlagComponent: CountryFlags.BD },
    { code: 'bg', name: 'Bulgarian', countryCode: 'BG', FlagComponent: CountryFlags.BG },
    { code: 'zh', name: 'Chinese', countryCode: 'CN', FlagComponent: CountryFlags.CN },
    { code: 'hr', name: 'Croatian', countryCode: 'HR', FlagComponent: CountryFlags.HR },
    { code: 'cs', name: 'Czech', countryCode: 'CZ', FlagComponent: CountryFlags.CZ },
    { code: 'da', name: 'Danish', countryCode: 'DK', FlagComponent: CountryFlags.DK },
    { code: 'nl', name: 'Dutch', countryCode: 'NL', FlagComponent: CountryFlags.NL },
    { code: 'en', name: 'English', countryCode: 'GB', FlagComponent: CountryFlags.GB },
    { code: 'et', name: 'Estonian', countryCode: 'EE', FlagComponent: CountryFlags.EE },
    { code: 'tl', name: 'Filipino', countryCode: 'PH', FlagComponent: CountryFlags.PH },
    { code: 'fi', name: 'Finnish', countryCode: 'FI', FlagComponent: CountryFlags.FI },
    { code: 'fr', name: 'French', countryCode: 'FR', FlagComponent: CountryFlags.FR },
    { code: 'de', name: 'German', countryCode: 'DE', FlagComponent: CountryFlags.DE },
    { code: 'el', name: 'Greek', countryCode: 'GR', FlagComponent: CountryFlags.GR },
    { code: 'he', name: 'Hebrew', countryCode: 'IL', FlagComponent: CountryFlags.IL },
    { code: 'hi', name: 'Hindi', countryCode: 'IN', FlagComponent: CountryFlags.IN },
    { code: 'hu', name: 'Hungarian', countryCode: 'HU', FlagComponent: CountryFlags.HU },
    { code: 'is', name: 'Icelandic', countryCode: 'IS', FlagComponent: CountryFlags.IS },
    { code: 'id', name: 'Indonesian', countryCode: 'ID', FlagComponent: CountryFlags.ID },
    { code: 'it', name: 'Italian', countryCode: 'IT', FlagComponent: CountryFlags.IT },
    { code: 'ja', name: 'Japanese', countryCode: 'JP', FlagComponent: CountryFlags.JP },
    { code: 'ko', name: 'Korean', countryCode: 'KR', FlagComponent: CountryFlags.KR },
    { code: 'lv', name: 'Latvian', countryCode: 'LV', FlagComponent: CountryFlags.LV },
    { code: 'lt', name: 'Lithuanian', countryCode: 'LT', FlagComponent: CountryFlags.LT },
    { code: 'ms', name: 'Malay', countryCode: 'MY', FlagComponent: CountryFlags.MY },
    { code: 'no', name: 'Norwegian', countryCode: 'NO', FlagComponent: CountryFlags.NO },
    { code: 'fa', name: 'Persian', countryCode: 'IR', FlagComponent: CountryFlags.IR },
    { code: 'pirate', name: 'Pirate', countryCode: 'PIRATE', FlagComponent: PirateFlag },
    { code: 'pl', name: 'Polish', countryCode: 'PL', FlagComponent: CountryFlags.PL },
    { code: 'pt', name: 'Portuguese', countryCode: 'PT', FlagComponent: CountryFlags.PT },
    { code: 'ro', name: 'Romanian', countryCode: 'RO', FlagComponent: CountryFlags.RO },
    { code: 'ru', name: 'Russian', countryCode: 'RU', FlagComponent: CountryFlags.RU },
    { code: 'sr', name: 'Serbian', countryCode: 'RS', FlagComponent: CountryFlags.RS },
    { code: 'sk', name: 'Slovak', countryCode: 'SK', FlagComponent: CountryFlags.SK },
    { code: 'sl', name: 'Slovenian', countryCode: 'SI', FlagComponent: CountryFlags.SI },
    { code: 'es', name: 'Spanish', countryCode: 'ES', FlagComponent: CountryFlags.ES },
    { code: 'sw', name: 'Swahili', countryCode: 'TZ', FlagComponent: CountryFlags.TZ },
    { code: 'sv', name: 'Swedish', countryCode: 'SE', FlagComponent: CountryFlags.SE },
    { code: 'th', name: 'Thai', countryCode: 'TH', FlagComponent: CountryFlags.TH },
    { code: 'tr', name: 'Turkish', countryCode: 'TR', FlagComponent: CountryFlags.TR },
    { code: 'uk', name: 'Ukrainian', countryCode: 'UA', FlagComponent: CountryFlags.UA },
    { code: 'ur', name: 'Urdu', countryCode: 'PK', FlagComponent: CountryFlags.PK },
    { code: 'vi', name: 'Vietnamese', countryCode: 'VN', FlagComponent: CountryFlags.VN },
  ];

interface SettingsStepProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  onNext: () => void;
}

export function SettingsStep({ settings, onSettingsChange, onNext }: SettingsStepProps) {
  const [keyword, setKeyword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keyword.trim()) {
      onSettingsChange({
        ...settings,
        keywords: [...settings.keywords, keyword.trim()]
      })
      setKeyword('')
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    onSettingsChange({
      ...settings,
      keywords: settings.keywords.filter(k => k !== keywordToRemove)
    })
  }

  const handleNext = async () => {
    setIsLoading(true)
    await onNext()
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <Select 
            value={settings.contentType} 
            onValueChange={value => onSettingsChange({ ...settings, contentType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <Select 
            value={settings.tone} 
            onValueChange={value => onSettingsChange({ ...settings, tone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map(tone => (
                <SelectItem key={tone.id} value={tone.id}>
                  {tone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select 
            value={settings.language} 
            onValueChange={value => onSettingsChange({ ...settings, language: value })}
          >
            <SelectTrigger>
              <SelectValue>
                {(() => {
                  const lang = LANGUAGES.find(l => l.code === settings.language);
                  if (lang) {
                    const Flag = lang.FlagComponent;
                    return (
                      <>
                        <Flag className="w-4 h-4 mr-2 inline-block" />
                        {lang.name}
                      </>
                    );
                  }
                  return "Choose language";
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => {
                const Flag = lang.FlagComponent;
                return (
                  <SelectItem 
                    key={lang.code} 
                    value={lang.code}
                    className="text-md flex items-center"
                  >
                    <Flag className="w-4 h-4 mr-2 inline-block" />
                    {lang.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Writing Level</label>
          <Select 
            value={settings.writingLevel} 
            onValueChange={value => onSettingsChange({ ...settings, writingLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select writing level" />
            </SelectTrigger>
            <SelectContent>
              {WRITING_LEVELS.map(level => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Length (words)</label>
        <Input 
          type="number"
          min={100}
          max={10000}
          value={settings.targetLength}
          onChange={e => onSettingsChange({ 
            ...settings, 
            targetLength: parseInt(e.target.value) || 500 
          })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Keywords</label>
        <Input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleAddKeyword}
          placeholder="Press Enter to add keywords"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {settings.keywords.map(keyword => (
            <Badge key={keyword} variant="secondary">
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt/Description</label>
        <Textarea
          value={settings.prompt}
          onChange={e => onSettingsChange({ ...settings, prompt: e.target.value })}
          placeholder="Describe what you want to generate..."
          className="min-h-[100px]"
        />
      </div>

      <Button 
        onClick={handleNext}
        className="w-full"
        disabled={!settings.prompt || !settings.contentType || !settings.tone || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Next Step'
        )}
      </Button>
    </div>
  )
} 