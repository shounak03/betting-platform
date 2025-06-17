import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Highlight } from "../ui/hero-highlight";
import { TypewriterEffect, TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { text } from "stream/consumers";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { FlipWords } from "../ui/flip-words";



const Hero = () => {
  
  const words2 = [
    { text: "you", className: "text-2xl text-white" },
    { text: "can", className: "text-2xl text-white" },
    { text: "bet", className: "text-2xl text-purple-400" },
    { text: "on", className: "text-2xl text-white" },
    { text: "any", className: "text-2xl text-white" },
    { text: "topic.", className: "text-2xl text-white" },
  ]

  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    // {
    //   id: 5,
    //   name: "Tyler Durden",
    //   designation: "Soap Developer",
    //   image:
    //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    // },
    // {
    //   id: 6,
    //   name: "Dora",
    //   designation: "The Explorer",
    //   image:
    //     "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    // },
  ];

  const words1 = ["opinions", "sports", "politics", "anything"];
  return (
    // <section className="min-h-screen flex items-center justify-center bg-gray-900/70 relative overflow-hidden">
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      

      
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="container mx-auto px-6 relative z-10">
      <div className="flex items-center justify-center gap-14 text-xl">
        <Link href={"/#features"}>
          <h1>Features</h1>
        </Link>
        <Link href={"/#how-it-works"}>
          <h1>How it works</h1>
        </Link>
        <Link href={"/#faqs"}>
          <h1>FAQs</h1>
        </Link>
      </div>


        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left pr-4 lg:pr-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 ">
              Wager
              <Highlight>
                <span className="text-white">
                Verse
                </span>
              </Highlight>
              
            </h1>

            <h1 className="lg:text-5xl md:text-2xl text-gray-50 mb-8 animate-fade-in delay-200 mt-8">

              Place bets on
              <FlipWords words={words1} className="text-5xl font-bold" />
            </h1>

            <p className="lg:text-2xl md:text-2xl mb-8 mt-8 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              The first Solana-powered prediction market where you can bet on any topic. Bet on anything and everything.

            </p>


            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12 animate-fade-in delay-400">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                <Link href="/betting">
                Start Betting Now
                </Link>
              </Button>
            </div> */}

            <div className="flex justify-center lg:justify-start items-center gap-8 text-sm text-gray-300 animate-fade-in delay-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live on Solana</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Instant Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Token Rewards</span>
              </div>
            </div>
          </div>

          {/* Right Column - Waitlist */}
          <div className="flex flex-col sm:items-center justify-center lg:justify-end">
            <div className="relative p-8 bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in delay-800">
              {/* Moving Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 blur-sm animate-pulse"></div>
              <div className="absolute inset-0.5 bg-black rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-50 mb-2 text-center">
                  Join the Waitlist
                </h3>
                <p className="text-gray-400 mb-6 text-center">
                  Be among the first to experience the future of prediction markets
                </p>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-black"
                  />
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                    Join Waitlist
                  </Button>
                </div>

                
              </div>
              
            </div>
            {/* <div className="flex flex-row items-center justify-center mt-6 w-full">
                  <AnimatedTooltip items={people} /> 
                  <span className="text-gray-300 text-xl ml-6">
                    & more have already joined
                  </span>
            </div> */}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
