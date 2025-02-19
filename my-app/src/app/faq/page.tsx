import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-12 tracking-tight">
          Frequently Asked Questions
        </h1>

        <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <Accordion type="single" collapsible className="p-6">
            <AccordionItem value="item-1" className="border-b-0 mb-4">
              <AccordionTrigger className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:no-underline">
                Why isn&apos;t my language included?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 mt-2">
                Our intention is to add every language that has some level of AI support. 
                This project is ongoing and will be updated regularly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b-0 mb-4">
              <AccordionTrigger className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:no-underline">
                Why did you choose just ASR, NMT, and TTS to showcase?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 mt-2">
                While there are many other interesting tools developed to support other 
                sub-topics for low resource languages (named entities, sentiment analysis, 
                topic models), we believe that these three are the most significant for 
                enabling speakers of low-resource languages to experience the benefits of 
                current breakthroughs in large language models.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:no-underline">
                What is your intention with this map?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300 mt-2">
                We hope this resource will help bring visibility for global stakeholders 
                on where the major gaps are for supporting low-resource languages. We hope 
                model providers will gain visibility and funders will know where to focus 
                their resources for greater impact.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
