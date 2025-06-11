"use client"
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is WagerVerse?",
      answer: "WagerVerse is a decentralized prediction market platform built on Solana where users can bet on any topic - from sports and politics to crypto prices and entertainment. You can either join existing markets or create your own custom prediction markets."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple: 1) Connect your Solana wallet, 2) Choose from existing markets or create your own, 3) Place your bet with SOL, and 4) Collect your rewards. The entire process takes just minutes."
    },
    {
      question: "What can I bet on?",
      answer: "You can bet on virtually anything! Popular categories include sports events, political outcomes, cryptocurrency prices, weather forecasts, entertainment awards, and major world events. You can also create custom markets for any topic you're passionate about."
    },
    {
      question: "What are platform tokens and how do I earn them?",
      answer: "Platform tokens are rewards you earn with every bet you place, regardless of whether you win or lose. The more you participate in betting activities, the more tokens you accumulate. These tokens can provide additional benefits and rewards within the ecosystem."
    },
    {
      question: "How does the resolver system work?",
      answer: "For custom markets, we use a resolver-based system where trusted community members or oracle services determine the outcome of bets. For famous events like sports and politics, we use professional data feeds for instant and accurate resolution."
    },
    {
      question: "Is my money safe?",
      answer: "Yes, your funds are secured by Solana's blockchain technology. All transactions are transparent and immutable. We use smart contracts to ensure automatic and fair payouts, eliminating the need to trust centralized parties."
    },
    {
      question: "What are the fees?",
      answer: "We maintain competitive fees to ensure fair play while supporting platform development. Fees vary by market type and bet size. All fees are transparently displayed before you place any bet."
    },
    {
      question: "How quickly can I withdraw my winnings?",
      answer: "Winnings are available instantly once a market resolves. Since we're built on Solana, withdrawals are processed in seconds with minimal transaction fees."
    },
    {
      question: "Can I create my own betting market?",
      answer: "Absolutely! One of our key features is allowing users to create custom prediction markets on any topic. You define the question, outcomes, resolution criteria, and timeframe. The community can then bet on your market."
    },
    // {
    //   question: "What wallets are supported?",
    //   answer: "We support all major Solana wallets including Phantom, Solflare, Sollet, and any wallet compatible with the Solana ecosystem. Simply connect your preferred wallet to start betting."
    // },
    // {
    //   question: "Are there betting limits?",
    //   answer: "Betting limits depend on the specific market and your account verification level. Most markets have minimum and maximum bet amounts displayed clearly. High-volume bettors may have access to higher limits."
    // },
    // {
    //   question: "How are disputes handled?",
    //   answer: "For custom markets, disputes are handled through our community governance system and designated resolvers. For major events, we rely on multiple authoritative data sources. We have a transparent appeals process for any contested outcomes."
    // },
    // {
    //   question: "Is betting legal in my jurisdiction?",
    //   answer: "Betting laws vary by jurisdiction. It's your responsibility to ensure that using prediction markets is legal in your location. We recommend consulting local regulations before participating."
    // },
    {
      question: "Can I bet on multiple outcomes?",
      answer: "Yes, you can place multiple bets on different outcomes within the same market or across multiple markets. This allows you to hedge your bets and implement sophisticated betting strategies."
    },
    {
      question: "What happens if a market is cancelled?",
      answer: "In the rare event a market needs to be cancelled (due to unforeseen circumstances or technical issues), all participants receive full refunds of their initial stakes. Platform tokens earned from cancelled markets are typically retained."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-black" id="faqs">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about betting on WagerVerse
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none group"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 ml-4">
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 