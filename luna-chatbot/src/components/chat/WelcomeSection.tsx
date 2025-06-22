"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Flower, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeSectionProps {
  onQuestionSelect: (question: string) => void;
}

const starterQuestions: string[] = [
  "What is a normal menstrual cycle?",
  "How can I track my ovulation?",
  "When should I see a gynecologist?",
  "How do I manage period pain naturally?",
 
];

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onQuestionSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-6"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg"
        >
          <Heart className="w-10 h-10 text-pink-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Hi Beautiful! I&apos;m Luna 💕 
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your caring companion for all things reproductive health. 
            Ask me anything - this is your safe, judgment-free space.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-800">Popular Questions</h3>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {starterQuestions.map((question: string, index: number) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => onQuestionSelect(question)}
                  className="w-full text-left p-4 h-auto hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 rounded-2xl border-pink-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <Flower className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{question}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-gray-500 italic"
        >
          Remember: I&apos;m here to provide information and support, but always consult with your healthcare provider for personalized medical advice 💗
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;