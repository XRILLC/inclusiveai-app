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
        <TabsList className="grid w-full grid-cols-4 h-16 bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-gray-900/90 dark:to-sky-900/50 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-sky-100/20 dark:border-sky-700/20">

          {modelTypes.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.id}
              className={`relative overflow-hidden group transition-all duration-300
                ${model.id === 'ASR' ? 'hover:bg-gradient-to-br hover:from-blue-100/50 hover:to-blue-200/50' : ''}
                ${model.id === 'NMT' ? 'hover:bg-gradient-to-br hover:from-emerald-100/50 hover:to-emerald-200/50' : ''}
                ${model.id === 'TTS' ? 'hover:bg-gradient-to-br hover:from-sky-100/50 hover:to-sky-200/50' : ''}
                ${model.id === 'Data' ? 'hover:bg-gradient-to-br hover:from-gray-100/50 hover:to-gray-200/50' : ''}
                dark:hover:from-gray-800/30 dark:hover:to-gray-800/10
              `}
            >
              <span className={`relative z-10 text-base font-medium bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300
                ${model.id === 'ASR' ? 'from-blue-600 to-blue-800 group-data-[state=active]:from-blue-100 group-data-[state=active]:to-blue-200' : ''}
                ${model.id === 'NMT' ? 'from-emerald-600 to-emerald-800 group-data-[state=active]:from-emerald-100 group-data-[state=active]:to-emerald-200' : ''}
                ${model.id === 'TTS' ? 'from-sky-600 to-sky-800 group-data-[state=active]:from-sky-100 group-data-[state=active]:to-sky-200' : ''}
                ${model.id === 'Data' ? 'from-gray-600 to-gray-800 group-data-[state=active]:from-gray-100 group-data-[state=active]:to-gray-200' : ''}
                dark:from-gray-300 dark:to-gray-100
              `}>{model.label}</span>
              <div className={`absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity -z-0 bg-gradient-to-br
                ${model.id === 'ASR' ? 'from-blue-500 to-blue-600' : ''}
                ${model.id === 'NMT' ? 'from-emerald-500 to-emerald-600' : ''}
                ${model.id === 'TTS' ? 'from-sky-500 to-sky-600' : ''}
                ${model.id === 'Data' ? 'from-gray-500 to-gray-600' : ''}
                dark:from-gray-800 dark:to-gray-700
              `}></div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
