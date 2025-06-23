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
      className="text-center py-6 sm:py-8 md:py-12 px-4 sm:px-6"
    >
      <style jsx>{`
        /* Mobile-first responsive styles */
        @media (max-width: 435px) {
          .welcome-title {
            font-size: 1.75rem !important;
            line-height: 2rem !important;
            margin-bottom: 1rem !important;
          }
          
          .welcome-subtitle {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .welcome-card {
            padding: 1rem !important;
            border-radius: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .popular-questions-title {
            font-size: 1rem !important;
            margin-bottom: 1rem !important;
          }
          
          .question-button {
            padding: 0.75rem !important;
            border-radius: 1rem !important;
          }
          
          .question-text {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .disclaimer-text {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
            padding: 0 0.5rem !important;
          }
          
          .welcome-avatar {
            width: 4rem !important;
            height: 4rem !important;
            margin-bottom: 1rem !important;
          }
          
          .welcome-avatar-icon {
            width: 2rem !important;
            height: 2rem !important;
          }
        }

        @media (max-width: 375px) {
          .welcome-title {
            font-size: 1.5rem !important;
            line-height: 1.75rem !important;
          }
          
          .welcome-subtitle {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .welcome-card {
            padding: 0.75rem !important;
            margin-bottom: 1rem !important;
          }
          
          .question-button {
            padding: 0.5rem !important;
          }
          
          .question-text {
            font-size: 0.8rem !important;
          }
          
          .welcome-avatar {
            width: 3rem !important;
            height: 3rem !important;
          }
          
          .welcome-avatar-icon {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
        }

        /* Tablet styles */
        @media (min-width: 436px) and (max-width: 768px) {
          .welcome-title {
            font-size: 2.5rem !important;
          }
          
          .welcome-subtitle {
            font-size: 1.125rem !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="welcome-avatar w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg"
        >
          <Heart className="welcome-avatar-icon w-8 sm:w-10 h-8 sm:h-10 text-pink-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="welcome-title text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            Hi Beautiful! I&apos;m Luna 💕 
          </h1>
          <p className="welcome-subtitle text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Your caring companion for all things reproductive health. 
            Ask me anything - this is your safe, judgment-free space.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="welcome-card bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-pink-100 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
            <h3 className="popular-questions-title text-base sm:text-lg font-semibold text-gray-800 text-center">
              Popular Questions
            </h3>
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {starterQuestions.map((question: string, index: number) => (
              <motion.div
                key={question}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  onClick={() => onQuestionSelect(question)}
                  className="question-button w-full text-left p-3 sm:p-4 h-auto hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 rounded-xl sm:rounded-2xl border-pink-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <Flower className="w-3 sm:w-4 h-3 sm:h-4 text-pink-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                    <span className="question-text text-xs sm:text-sm text-gray-700 leading-relaxed text-left break-words">
                      {question}
                    </span>
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
          className="disclaimer-text text-xs sm:text-sm text-gray-500 italic px-4 leading-relaxed"
        >
          Remember: I&apos;m here to provide information and support, but always consult with your healthcare provider for personalized medical advice 💗
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;