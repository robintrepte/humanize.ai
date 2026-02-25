"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Loader2, Skull } from "lucide-react"
import * as CountryFlags from 'country-flag-icons/react/3x2'

// Add PirateFlag component
const PirateFlag = () => (
  <div className="bg-foreground w-5 h-4 flex items-center justify-center inline-flex mr-1 rounded-sm">
    <Skull className="w-3 h-3 text-background" />
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

export function Why() {
  const [isHumanized, setIsHumanized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const [aiScore, setAiScore] = useState(2.4)
  const [displayText, setDisplayText] = useState(
    "Physics delves into the intricate relationships between matter, energy, and the forces that shape our universe. It reveals the hidden principles governing motion, electromagnetism, and the quantum realm."
  )
  const aiText = "Physics delves into the intricate relationships between matter, energy, and the forces that shape our universe. It reveals the hidden principles governing motion, electromagnetism, and the quantum realm."
  const humanText = "The fascinating field of physics looks into how matter, energy, and forces form the universe. This science reveals hidden principles of motion, electromagnetism, and the quantum territory."

  const morphText = async (targetText: string) => {
    setIsLoading(true)
    const current = displayText.split('')
    const target = targetText.split('')
    const maxLength = Math.max(current.length, target.length)
    
    for (let i = 0; i < maxLength; i++) {
      await new Promise(resolve => setTimeout(resolve, 10))
      setDisplayText(prev => {
        const chars = prev.split('')
        if (i >= target.length) {
          chars.splice(i)
        } else {
          chars[i] = target[i]
        }
        return chars.join('')
      })
    }
    setIsHumanized(!isHumanized)
    setIsLoading(false)
  }

  const handleHumanizeClick = () => {
    if (isHumanized) {
      morphText(aiText)
    } else {
      morphText(humanText)
    }
  }

  const handleCheckText = () => {
    // Generate random number between 0 and 100
    const randomScore = Math.random() * 100;
    setAiScore(Number(randomScore.toFixed(1)));
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-12">
          <h2 className="mx-auto max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            <span className="block text-sm text-primary font-mono font-medium tracking-wider uppercase mb-2">Features</span>
            Why 21AI?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Advanced AI Humanizer */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow lg:col-span-2 xl:col-span-1">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">Advanced AI Humanizer</h4>
              <p className="text-muted-foreground">Our humanizer is the most advanced, consistent, and cost-effective on the market.</p>
              
              <div className="space-y-3 mt-6">
                <div className="bg-accent/50 p-4 rounded-lg text-sm">
                  {displayText}
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-sm px-2 py-1 rounded-full ${
                    isHumanized 
                      ? 'bg-green-500/15 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }`}>
                    {isHumanized ? '100% Human Text' : 'AI Detected'}
                  </div>
                  <Button 
                    className="w-[120px]"
                    onClick={handleHumanizeClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      isHumanized ? 'Revert to AI' : 'Humanize'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bypass any AI detector */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">Bypass any AI detector</h4>
              <p className="text-muted-foreground">
                Bypass all AI detectors.
              </p>
              
              <div className="space-y-3 mt-6">
                <div className="bg-accent/50 p-4 rounded-lg text-sm">
                  <ul className="grid grid-cols-2 gap-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> GPTZero
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> ZeroGPT
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Copyleaks
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Turnitin
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Quillbot
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Winston AI
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Writer.com
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Originality.ai
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Content at Scale
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Sapling
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customizable */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">Customizable</h4>
              <p className="text-muted-foreground">Choose from different writing levels and purposes to achieve your desired writing style.</p>
              
              <div className="space-y-3 mt-6">
                <Select defaultValue="intermediate">
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Mobile Experience */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">First-Class Mobile Experience</h4>
              <p className="text-muted-foreground">Our platform is optimized for mobile devices, providing a seamless experience on the go.</p>
              
              <div className="space-y-3 mt-6">
                <div className="w-full h-48 bg-accent/50 rounded-lg flex items-center justify-center text-muted-foreground">
                  [Mobile Screenshot]
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Detector Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">State of the Art AI Detector</h4>
              <p className="text-muted-foreground">Our advanced AI detection system provides accurate and reliable results to ensure your text passes as human-written.</p>
              
              <div className="space-y-3 mt-6">
                <div className="bg-accent/50 p-4 rounded-lg text-sm h-32">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">AI Detection Score</span>
                    <span className={`font-semibold ${aiScore < 30 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {aiScore}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${aiScore < 30 ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'}`}
                      style={{ width: `${aiScore}%` }}
                    ></div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {aiScore < 30 
                      ? 'Your text is highly likely to pass as human-written content.'
                      : 'Your text may be detected as AI-generated content.'}
                  </p>
                </div>
                <Button className="w-full" onClick={handleCheckText}>Check Text</Button>
              </div>
            </CardContent>
          </Card>

          {/* Perfect SEO Content */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xl font-semibold text-primary">Perfect SEO Content</h4>
              <p className="text-muted-foreground">Generate SEO-optimized content that ranks well on search engines while maintaining natural readability.</p>
              
              <div className="space-y-3 mt-6">
                <div className="bg-accent/50 p-4 rounded-lg text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Keyword optimization
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Natural keyword density
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Google, Bing and more
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
} 