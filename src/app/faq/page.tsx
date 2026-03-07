"use client";

import { Accordion, AccordionItem } from "@/components/ui";
import { GradientMesh } from "@/components/animation/GradientMesh";

const faqs = [
  {
    question: "Who is Mateo The Great?",
    answer:
      "Mateo The Great is a creator, educator, and AI enthusiast dedicated to making artificial intelligence accessible to everyone. Through videos, articles, and community engagement, Mateo breaks down complex AI concepts into clear, understandable explanations.",
  },
  {
    question: "What kind of content does Mateo create?",
    answer:
      "Mateo creates educational content about artificial intelligence, including video breakdowns of the latest AI developments, tutorials on using AI tools, thoughtful analysis of industry trends, and discussions about the ethical implications of AI technology.",
  },
  {
    question: "How can I stay updated on new content?",
    answer:
      "The best way to stay in the loop is to subscribe to our newsletter on the homepage. You'll receive updates on new videos, exclusive insights, and early access to special content. You can also follow Mateo on social media for daily updates.",
  },
  {
    question: "Is the content beginner-friendly?",
    answer:
      "Absolutely! One of Mateo's core values is clarity—making complex ideas accessible without dumbing them down. Whether you're completely new to AI or already working in the field, you'll find content tailored to help you learn and grow.",
  },
  {
    question: "How can I support Mateo's work?",
    answer:
      "The best way to support is by engaging with the content—subscribe, share videos with friends, and join the community discussions. For those who want to go further, exclusive membership options are available that provide bonus content and direct access to Mateo.",
  },
  {
    question: "Can I suggest topics for future content?",
    answer:
      "Yes! Community input is highly valued. You can submit topic suggestions through our social media channels or by replying to the newsletter. Many popular videos have come directly from audience questions and suggestions.",
  },
];

export default function FAQPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-4 py-16 relative">
      <GradientMesh />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            FAQ
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
          Got questions? We&apos;ve got answers. Find everything you need to know about Mateo The Great and our content.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="relative z-10 mt-16 w-full max-w-3xl">
        <Accordion className="rounded-xl border border-white/[0.06] bg-[#111111] px-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} title={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
