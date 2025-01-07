"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, FileText, Sparkles, Skull, BookmarkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as CountryFlags from 'country-flag-icons/react/3x2'
import { format } from 'timeago.js';

interface Humanization {
  id: number;
  title: string | null;
  inputText: string;
  outputText: string;
  language: string;
  level: string;
  createdAt: string;
}

const PirateFlag = () => (
  <div className="bg-black w-5 h-4 flex items-center justify-center inline-flex">
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

export default function HumanizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [humanizations, setHumanizations] = useState<Humanization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchHumanizations();
    }
  }, [status, router]);

  const fetchHumanizations = async () => {
    try {
      const response = await fetch('/api/saved');
      const data = await response.json();
      setHumanizations(data.humanizations);
    } catch (error) {
      console.error('Error fetching humanizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHumanizations = humanizations.filter((humanization) =>
    humanization.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    !searchQuery // Zeige alle wenn keine Suche
  );

  const sortedAndFilteredHumanizations = filteredHumanizations.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4 justify-center md:justify-start">
            <BookmarkIcon size={24} />
            Saved Texts
          </h1>
        </div>
      </header>
      <div className="flex-1 p-8"> 
        <div className="mb-6 flex flex-col sm:flex-row gap-4 w-full">
          <Input
            type="search"
            placeholder="Suche nach Titel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:flex-1"
          />
          <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "title") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Neueste zuerst</SelectItem>
              <SelectItem value="oldest">Älteste zuerst</SelectItem>
              <SelectItem value="title">Nach Titel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {sortedAndFilteredHumanizations.map((humanization) => (
            <Card 
              key={humanization.id} 
              className="w-full hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/saved/${humanization.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="max-w-[700px]">
                    <h2 className="text-xl font-semibold mb-2">
                      {humanization.title || 'Untitled'}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {humanization.outputText}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(humanization.createdAt)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2">
                      {(() => {
                        const lang = LANGUAGES.find(l => l.code === humanization.language);
                        if (lang) {
                          const Flag = lang.FlagComponent;
                          return <Flag className="w-4 h-4" />;
                        }
                        return humanization.language;
                      })()}
                    </Badge>
                    <Badge variant="outline">
                      {humanization.level.charAt(0).toUpperCase() + humanization.level.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 