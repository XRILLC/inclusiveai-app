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
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 dark:from-emerald-400 dark:via-sky-400 dark:to-blue-400 pb-1">
          Bridging the Divide
        </h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Track our progress in connecting languages through technology
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value: string) => onTabChange?.(value as 'languages' | 'population')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-900/20 dark:to-sky-900/20 p-1 rounded-lg backdrop-blur-sm border border-emerald-100/20 dark:border-emerald-700/20 overflow-hidden">
          <TabsTrigger 
            value="languages"
            className="relative overflow-hidden group transition-all duration-300"
          >
            <span className={`relative z-10 text-sm font-medium transition-colors
              ${activeTab === 'languages' 
                ? 'text-white dark:text-white' 
                : 'bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent'}
            `}>By Languages</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-600 dark:to-sky-600 transition-opacity ${activeTab === 'languages' ? 'opacity-100' : 'opacity-0'}`}></div>
          </TabsTrigger>
          <TabsTrigger 
            value="population"
            className="relative overflow-hidden group transition-all duration-300"
          >
            <span className={`relative z-10 text-sm font-medium transition-colors
              ${activeTab === 'population' 
                ? 'text-white dark:text-white' 
                : 'bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent'}
            `}>By Population</span>
            <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-600 dark:to-sky-600 transition-opacity ${activeTab === 'population' ? 'opacity-100' : 'opacity-0'}`}></div>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-white/90 to-sky-50/50 dark:from-gray-900/90 dark:to-sky-900/50 backdrop-blur-sm border border-sky-100/20 dark:border-sky-700/20 shadow-lg">
        <div className="bg-gradient-to-r from-emerald-100 to-sky-100 dark:from-emerald-950 dark:to-sky-950 rounded-full h-3 overflow-hidden">

          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
          />
        </div>
        
        <div className="mt-4 flex justify-between text-sm text-black dark:text-white">
          <span>0%</span>
          <span className="font-medium">{progress}% Complete</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
