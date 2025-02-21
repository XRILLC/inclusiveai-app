"use client";

import { Card, CardContent } from "@/components/ui/card";


export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="fixed top-4 right-4 z-50">

      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-12 tracking-tight">
          Blog
        </h1>

        <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Coming Soon!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                We&apos;re working on bringing you insightful articles and updates.
                Stay tuned!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
