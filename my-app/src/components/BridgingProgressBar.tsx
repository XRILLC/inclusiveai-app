"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BridgingProgressBarProps {
  progress?: number;
  onTabChange?: (tab: 'languages' | 'population') => void;
  activeTab?: 'languages' | 'population';
}

export function BridgingProgressBar({ 
  progress = 46,
  onTabChange,
  activeTab = 'languages'
}: BridgingProgressBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Bridging the Divide
        </h2>
        <p className="mt-2 text-gray-400">
          Track our progress in connecting languages through technology
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value: string) => onTabChange?.(value as 'languages' | 'population')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-white/5 backdrop-blur-sm">
          <TabsTrigger 
            value="languages"
            className={`text-sm font-medium transition-all
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              ${activeTab === 'languages' ? 'bg-indigo-600 text-white' : 'hover:bg-white/10'}
            `}
          >
            By Languages
          </TabsTrigger>
          <TabsTrigger 
            value="population"
            className={`text-sm font-medium transition-all
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              ${activeTab === 'population' ? 'bg-indigo-600 text-white' : 'hover:bg-white/10'}
            `}
          >
            By Population
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="bg-black/20 rounded-full h-3 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
          />
        </div>
        
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>0%</span>
          <span className="font-medium text-white">{progress}% Complete</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
