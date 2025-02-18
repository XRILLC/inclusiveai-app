import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <ThemeToggle />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-8 tracking-tight">
          About Digital Divide
        </h1>

        <div className="space-y-12">
          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                The <span className="text-blue-600 dark:text-blue-400 font-semibold">digitaldivide.ai</span> project 
                is a collaborative initiative between XRI Global and students at the University 
                of Arizona. Our mission is to provide real-time visibility into AI model 
                capabilities across the world&apos;s languages. We believe that bridging the digital 
                divide begins with establishing foundational technology support for all languages.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-semibold">Essential AI Models</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">ASR</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Speech-to-Text</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Convert spoken language to text</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">NMT</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Machine Translation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Translate between languages</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-semibold text-lg">TTS</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Text-to-Speech</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Convert text to natural speech</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                These models are fundamental to achieving inclusive AI. While English dominates 
                internet content and large language models (LLMs), we can make this knowledge 
                accessible to everyone through translation models. For those who don&apos;t read or 
                write, combining speech models with translation capabilities can unlock access 
                to powerful AI tools.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-semibold">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Each language page features a sophisticated progress bar that evaluates model 
                presence and performance scores. This serves as a benchmark indicator, 
                measuring the distance to achieving acceptable model performance based on 
                real-world utility.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                This is an evolving project with regular updates. Future versions will 
                incorporate LLM performance metrics and direct links to top-performing models 
                for each language.
              </p>
              <div className="flex justify-center">
                <Button asChild className="group relative overflow-hidden rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300">
                  <Link href="/get-involved">
                    <span className="relative z-10 flex items-center gap-2">
                      Stay Updated
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
