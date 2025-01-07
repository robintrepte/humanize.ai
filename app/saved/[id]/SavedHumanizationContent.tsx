"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, ArrowLeft, Copy, Skull } from "lucide-react";
import { format } from 'timeago.js';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { DeleteButton } from "./DeleteButton";
import * as CountryFlags from 'country-flag-icons/react/3x2';

// Add PirateFlag component
const PirateFlag = () => (
  <div className="bg-black w-5 h-4 flex items-center justify-center inline-flex">
    <Skull className="w-3 h-3 text-white" />
  </div>
);

// Add LANGUAGES constant
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

interface Humanization {
  id: number;
  title: string | null;
  inputText: string;
  outputText: string;
  language: string;
  level: string;
  createdAt: string;
}

interface SavedHumanizationContentProps {
  id: string;
}

export default function SavedHumanizationContent({ id }: SavedHumanizationContentProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [humanization, setHumanization] = useState<Humanization | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHumanization = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved/${id}`);
      if (!response.ok) {
        throw new Error('Humanization not found');
      }
      const data = await response.json();
      setHumanization(data.humanization);
    } catch (error) {
      console.error('Error fetching humanization:', error);
      router.push('/saved');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchHumanization();
    }
  }, [status, router, fetchHumanization]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!humanization) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/saved')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold flex-1">
              {humanization.title || 'Untitled'}
            </h1>
            <DeleteButton id={humanization.id.toString()} />
          </div>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Clock className="w-3 h-3 mr-1" />
            {format(humanization.createdAt)}
          </Badge>
          <Badge variant="outline">
            {(() => {
              const lang = LANGUAGES.find(l => l.code === humanization.language);
              if (lang) {
                const Flag = lang.FlagComponent;
                return (
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    {lang.name}
                  </div>
                );
              }
              return humanization.language.toUpperCase();
            })()}
          </Badge>
          <Badge variant="outline">
            {humanization.level.charAt(0).toUpperCase() + humanization.level.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Input Text</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(humanization.inputText)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <Textarea
                  value={humanization.inputText}
                  readOnly
                  className="min-h-full resize-none border-0"
                />
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Humanized Text</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(humanization.outputText)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <Textarea
                  value={humanization.outputText}
                  readOnly
                  className="min-h-full resize-none border-0"
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 