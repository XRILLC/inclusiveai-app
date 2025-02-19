"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";

interface ModelFiltersProps {
  onFilterChange: (selectedModels: string[]) => void;
}

export function ModelFilters({ onFilterChange }: ModelFiltersProps) {
  const [activeTab, setActiveTab] = useState<string>("ASR");
  
  const modelTypes = [
    { id: "all", label: "Data" },
    { id: "ASR", label: "ASR Models" },
    { id: "NMT", label: "NMT Models" },
    { id: "TTS", label: "TTS Models" },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      onFilterChange([]);
    } else {
      onFilterChange([value]);
    }
  };

  return (
    <div className="w-full flex justify-center mb-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full max-w-3xl"
      >
        <TabsList className="grid w-full grid-cols-4 h-14 bg-white/10 backdrop-blur-sm">
          {modelTypes.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.id}
              className={`text-base font-medium transition-all
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                ${activeTab === model.id ? 'bg-indigo-600 text-white' : 'hover:bg-white/20'}
              `}
            >
              {model.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
