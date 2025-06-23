"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface NumberFlowProps {
  value: number;
  format?: Intl.NumberFormatOptions;
  className?: string;
  transformTiming?: {
    duration: number;
    easing: string;
  };
  willChange?: boolean;
}
const NumberFlow: React.FC<NumberFlowProps> = ({
  value,
  format = {},
  className = "",
  transformTiming = {
    duration: 800,
    easing: "ease-out"
  },
  willChange = false
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      const startValue = displayValue;
      const endValue = value;
      const startTime = Date.now();
      const duration = transformTiming.duration;
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        setDisplayValue(Math.round(currentValue));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [value, displayValue, transformTiming.duration]);
  const formattedValue = new Intl.NumberFormat('en-EU', format).format(displayValue);
  return <span className={cn(className, isAnimating && willChange ? "will-change-contents" : "")} style={{
    transition: isAnimating ? `all ${transformTiming.duration}ms ${transformTiming.easing}` : undefined
  }}>
      {formattedValue}
    </span>;
};
interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  className?: string;
}
const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  max,
  min,
  step,
  className
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    let theme;
    if (typeof window === "undefined") {
      theme = "system";
    } else {
      theme = localStorage.getItem("theme") || "system";
    }
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    } else {
      setIsDarkMode(theme === "dark");
    }
  }, []);
  const percentage = (value[0] - min) / (max - min) * 100;
  return <div className={cn("w-full", className)}>
      <div className="relative flex justify-center items-center">
        <style>{`
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: white;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
          }

          .custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3);
          }

          .custom-slider::-moz-range-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: white;
            cursor: pointer;
            border-radius: 50%;
            border: none;
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
          }

          .custom-slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.3);
          }
        `}</style>
        <input type="range" min={min} max={max} step={step} value={value[0]} onChange={event => onValueChange([parseInt(event.target.value, 10)])} className="custom-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50" style={{
        background: `linear-gradient(to right, #FFD700 ${percentage}%, ${isDarkMode ? "#1f1f1f" : "#ebebeb"} ${percentage}%)`
      }} />
      </div>
    </div>;
};
interface SavingsCalculatorProps {
  className?: string;
  enableAnimations?: boolean;
}
export function SavingsCalculator({
  className,
  enableAnimations = true
}: SavingsCalculatorProps) {
  const [gymCost, setGymCost] = useState(50);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const yearlySavings = gymCost * 12;
  const twentyYearSavings = yearlySavings * 20;
  const handleSliderChange = (value: number[]) => {
    setGymCost(value[0]);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(150, value));
    setGymCost(clampedValue);
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
      filter: "blur(8px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 28,
        mass: 0.6
      }
    }
  };
  const numberVariants = {
    initial: {
      scale: 1
    },
    animate: shouldAnimate ? {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    } : {}
  };
  return <motion.div initial={shouldAnimate ? "hidden" : "visible"} animate="visible" variants={containerVariants} className={cn("w-full max-w-md mx-auto", className)}>
      <Card className="relative p-8 bg-background border-border shadow-2xl shadow-black/10 rounded-3xl overflow-hidden">
        {/* Main Title */}
        <motion.div variants={shouldAnimate ? childVariants : {}} className="text-center mb-8">
          
        </motion.div>

        {/* Question */}
        <motion.div variants={shouldAnimate ? childVariants : {}} className="mb-8">
          <h3 className="text-lg font-bold text-foreground text-center mb-6">
            What's your avarage gym membership cost?
          </h3>

          {/* Slider */}
          <div className="space-y-6">
            <div className="px-2">
              <Slider value={[gymCost]} onValueChange={handleSliderChange} max={150} min={0} step={1} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>€0</span>
                <span>€150</span>
              </div>
            </div>

            {/* Number Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-foreground">
                €
              </div>
              <Input type="number" value={gymCost} onChange={handleInputChange} min={0} max={150} className="pl-10 pr-4 py-4 text-xl font-bold text-center bg-muted/30 border-border/50 rounded-xl focus:border-[#FFD700] focus:ring-[#FFD700] transition-all duration-300" />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={shouldAnimate ? childVariants : {}} className="space-y-6">
          {/* Yearly Savings */}
          <div className="text-center p-4 bg-muted/20 rounded-xl border border-border/30">
            <motion.p key={yearlySavings} variants={numberVariants} initial="initial" animate="animate" className="text-lg font-semibold text-foreground">
              Start saving{" "}
              <NumberFlow value={yearlySavings} format={{
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }} className="font-bold text-[#FFD700]" />{" "}
              every year.
            </motion.p>
          </div>

          {/* 20 Year Savings */}
          <div className="text-center p-6 bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 rounded-2xl border-2 border-[#FFD700]/30">
            <motion.div variants={shouldAnimate ? childVariants : {}}>
              <h4 className="text-sm font-black tracking-wider text-foreground mb-3 uppercase">
                💳 MONEY SAVED - 20 YEARS
              </h4>
              <motion.div key={twentyYearSavings} variants={numberVariants} initial="initial" animate="animate" className="text-4xl md:text-5xl font-black text-[#FFD700] tracking-tight">
                <NumberFlow value={twentyYearSavings} format={{
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }} transformTiming={{
                duration: 800,
                easing: "ease-out"
              }} willChange />
                <span className="text-2xl align-middle" style={{
                verticalAlign: 'middle',
                lineHeight: '1'
              }}>+</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFD700]/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
      </Card>
    </motion.div>;
}
export default function SavingsCalculatorDemo() {
  return <div className="min-h-screen p-4 bg-background flex items-center justify-center">
      <SavingsCalculator />
    </div>;
}