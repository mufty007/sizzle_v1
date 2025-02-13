"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I submit a recipe?",
    answer: "To submit a recipe, simply log in to your account and click on the 'Share Recipe' button. Fill in the recipe details, ingredients, and instructions, then submit for review."
  },
  {
    question: "Can I save my favorite recipes?",
    answer: "Yes! Once you're logged in, you can save any recipe by clicking the bookmark icon. Access your saved recipes from your profile dashboard."
  },
  {
    question: "Are the recipes reviewed for quality?",
    answer: "All recipes go through a basic review process to ensure they include complete information. Our community also helps maintain quality through ratings and feedback."
  },
  {
    question: "Can I adjust serving sizes?",
    answer: "Yes, most recipes include a serving size adjuster that automatically recalculates ingredient quantities based on your desired number of servings."
  }
];

export function FAQ() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find answers to common questions about RecipeVerse
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}