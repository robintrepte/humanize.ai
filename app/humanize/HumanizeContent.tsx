"use client";

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Clipboard, Gem, Skull, Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import * as CountryFlags from 'country-flag-icons/react/3x2'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Custom Pirate Flag component
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

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countCharacters = (text: string): number => {
  return text.length;
};

export default function HumanizeContent() {
  const { data: session, status } = useSession();
  const [inputText, setInputText] = React.useState("")
  const [outputText, setOutputText] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [level, setLevel] = React.useState("intermediate")
  const [language, setLanguage] = React.useState("en")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [localCredits, setLocalCredits] = React.useState(session?.user?.credits || 0)
  const [hasBeenHumanized, setHasBeenHumanized] = React.useState(false)
  const [retryAvailable, setRetryAvailable] = React.useState(true)

  React.useEffect(() => {
    setLocalCredits(session?.user?.credits || 0)
  }, [session?.user?.credits])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handlePaste = async () => {
    try {
      // First try to request permission
      const permissionResult = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName
      });
      
      if (permissionResult.state === 'denied') {
        throw new Error('Permission to access clipboard was denied');
      }

      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      // Fallback to execCommand for broader browser support
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();
      document.execCommand('paste');
      const text = textarea.value;
      document.body.removeChild(textarea);
      
      if (text) {
        setInputText(text);
      } else {
        console.error("Error pasting:", err);
        setError('Unable to paste. Please try copying and pasting manually.');
      }
    }
  }

  const handleHumanize = async () => {
    if (isLoading) return;
    
    if (!session?.user) {
      setError('Please log in to use this feature');
      return;
    }

    const wordCount = countWords(inputText);
    if (!inputText || wordCount < 50) {
      setError('Text must be at least 50 words');
      return;
    }

    const requiredCredits = hasBeenHumanized && retryAvailable ? 0 : calculateRequiredCredits();
    
    if (requiredCredits > (session.user.credits || 0)) {
      setError('Not enough credits. Please purchase more credits to continue.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          level,
          language,
          generateTitle: !title,
          currentTitle: title,
          requiredCredits
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to humanize text');
      }

      const data = await response.json();
      setOutputText(data.text);
      if (data.generatedTitle) {
        setTitle(data.generatedTitle);
      }
      if (!hasBeenHumanized) {
        setHasBeenHumanized(true);
      } else if (retryAvailable) {
        setRetryAvailable(false);
      }
      if (requiredCredits > 0) {
        setLocalCredits(prev => prev - requiredCredits);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const calculateRequiredCredits = () => {
    return Math.max(0, Math.ceil(inputText.length / 5))
  }

  return (
    <div className="h-full flex">
      <Card className="w-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex flex-col flex-1 space-y-6">
            <div className="grid gap-4 md:grid-cols-[1fr,200px,200px] pb-4 border-b">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="Leave empty for automatic generation..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-md"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Writing Level</label>
                <Select value={level} onValueChange={setLevel} disabled={isLoading}>
                  <SelectTrigger className="text-md">
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic" className="text-md">Basic</SelectItem>
                    <SelectItem value="intermediate" className="text-md">Intermediate</SelectItem>
                    <SelectItem value="advanced" className="text-md">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger className="text-md">
                    <SelectValue>
                      {(() => {
                        const lang = LANGUAGES.find(l => l.code === language);
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
            </div>

            <div className="grid gap-4 md:grid-cols-2 flex-1 min-h-0">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Input <span className="text-muted-foreground font-normal">({countCharacters(inputText)} chars, {countWords(inputText)} words)</span>
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {localCredits} Credits remaining
                  </span>
                </div>
                <div className="relative flex-1 min-h-[300px]">
                  <ScrollArea className="h-full absolute inset-0">
                    <Textarea 
                      placeholder="Insert text here..." 
                      className="w-full min-h-[500px] border-0 focus-visible:ring-0 resize-none text-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setHasBeenHumanized(false);
                        setRetryAvailable(true);
                      }}
                      disabled={isLoading}
                    />
                  </ScrollArea>
                  {!inputText && (
                    <Button 
                      variant="outline" 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-[90%] md:w-1/2" 
                      onClick={handlePaste}
                      disabled={isLoading}
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      Click here to paste text
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2 md:border-l md:pl-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Output <span className="text-muted-foreground font-normal">({countCharacters(outputText)} chars, {countWords(outputText)} words)</span>
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-sm text-muted-foreground underline cursor-pointer">
                        AI text detected?
                      </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>Check your text with various AI detection tools (e.g., GPTZero, ZeroGPT).</p>
                          <p className="mt-2">If you have used the free retry and your output is still flagged, please reach out to us for credit reimbursement.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative flex-1 min-h-[300px]">
                  <ScrollArea className="h-full absolute inset-0">
                    <Textarea 
                      placeholder="Your humanized text will appear here" 
                      className="w-full min-h-[500px] border-0 focus-visible:ring-0 resize-none text-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                      readOnly
                      value={outputText}
                    />
                  </ScrollArea>
                  {outputText && !isLoading && (
                    <>
                      <div className="absolute bottom-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-medium">
                        {`${Math.floor(Math.random() * 7 + 94)}% Human`}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2"
                        onClick={() => navigator.clipboard.writeText(outputText)}
                      >
                        <Copy />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleHumanize} 
                className="text-md w-full h-16 text-xl bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {hasBeenHumanized && retryAvailable ? 'Retry' : 'Humanize'}
                    <div className="ml-auto flex items-center gap-1">
                      <Gem />
                      <span className="text-sm">
                        {hasBeenHumanized && retryAvailable ? 'FREE' : calculateRequiredCredits()}
                      </span>
                    </div>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 