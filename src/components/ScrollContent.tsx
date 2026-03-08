import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const content = [
  {
    id: "01",
    title: "The Confrontation",
    body: [
      "THEY LIED TO YOU.",
      "WHILE THE MARKET CRASHED",
      "IN OCTOBER '25,",
      "THEY PULLED THE PLUG."
    ]
  },
  {
    id: "02",
    title: "THE ILLUSION OF FAILURE",
    body: [
      "\"SYSTEM BUSY\" IS A CHOICE.",
      "THEY DIDN'T \"CRASH.\"",
      "THEY JUST PRIORITIZED THEIR OWN LIQUIDATION BOTS",
      "OVER YOUR LIMIT ORDERS."
    ]
  },
  {
    id: "03",
    title: "The Retail Sacrifice",
    body: [
      "YOU WERE THE EXIT LIQUIDITY.",
      "THEY WATCHED YOUR $0 BALANCE",
      "GLITCH WHILE THE ELITES",
      "BOUGHT YOUR DIP.",
      "NEVER AGAIN."
    ]
  },
  {
    id: "04",
    title: "The Lintex Standard",
    body: [
      "LINTEX DOESN'T SWEAT.",
      "WE BUILT THE PLUMBING TO HANDLE THE TOXIC VOLUME.",
      "WHEN THE MARKET PANICS, WE STAY COLD."
    ]
  },
  {
    id: "05",
    title: "Anti-Security Theater",
    body: [
      "F*CK THE LOCKOUTS.",
      "TIRED OF BEING TREATED",
      "LIKE A CRIMINAL TO ACCESS",
      "YOUR OWN MONEY?",
      "NO ROBOTIC KYC BOTS. NO SECURITY THEATER."
    ]
  },
  {
    id: "06",
    title: "The Support Black Hole",
    body: [
      "NO TICKETS. NO AI BOTS.",
      "NO BULLSH*T.",
      "WHILE THEY \"REVIEW\"",
      "YOUR FUNDS FOR DAYS,",
      "WE ACTUALLY ANSWER",
      "WITHIN 24 HOURS.",
      "HUMAN EMPATHY IS",
      "OUR CORE STACK."
    ]
  },
  {
    id: "07",
    title: "The Manifesto",
    body: [
      "RETAIL ISN'T THE PRODUCT.",
      "RETAIL IS THE MISSION.",
      "NO HIDDEN FEES.",
      "NO CANNIBAL TOKENS.",
      "JUST PURE, BRUTAL",
      "TRANSPARENCY."
    ]
  },
  {
    id: "08",
    title: "THE ESCAPE PLAN",
    body: [
      "THE EXCHANGE FOR",
      "THE UNGOVERNABLE.",
      "LINTEX IS COMING.",
      "GET ON THE LIST BEFORE",
      "THE NEXT CRASH."
    ]
  }
];

const highlightPhrases = (text: string) => {
  const glitchPhrases = ['"SYSTEM BUSY"', "SYSTEM BUSY", "CRASHED", "CRASH", "GLITCH"];
  const brandPhrases = ["NEVER AGAIN.", "THEY PULLED THE PLUG.", "OVER YOUR LIMIT ORDERS.", "RETAIL IS THE MISSION.", "THE EXCHANGE FOR", "THE UNGOVERNABLE."];
  
  let parts: (string | React.JSX.Element)[] = [text];

  // Handle Glitch Phrases
  glitchPhrases.forEach(phrase => {
    const newParts: (string | React.JSX.Element)[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const split = part.split(phrase);
        split.forEach((s, i) => {
          if (i > 0) {
            newParts.push(
              <span key={`glitch-${phrase}-${i}`} className="glitch inline-block text-white" data-text={phrase}>
                {phrase}
              </span>
            );
          }
          newParts.push(s);
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  // Handle Brand Phrases
  brandPhrases.forEach(phrase => {
    const newParts: (string | React.JSX.Element)[] = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const split = part.split(phrase);
        split.forEach((s, i) => {
          if (i > 0) {
            newParts.push(
              <span key={`brand-${phrase}-${i}`} className="text-[#FD6818]">
                {phrase}
              </span>
            );
          }
          newParts.push(s);
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return parts;
};

interface SectionProps {
  item: typeof content[0];
  index: number;
  isLast: boolean;
  key?: string | number;
}

const Section = ({ item, index, isLast }: SectionProps) => {
  return (
    <div className={`${isLast ? 'h-screen' : 'min-h-screen'} flex flex-col justify-center px-6 md:px-20 ${isLast ? 'py-0' : 'pt-16 md:pt-32 pb-0'} border-b border-white/10 ${isLast ? 'border-0' : ''} ${isLast ? '' : 'pb-[30vh] md:pb-[20vh]'} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row gap-8 md:gap-20 items-start"
        >
          <div className="font-mono text-sm md:text-base text-white/50 pt-2">
            {item.id}
          </div>
          
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl md:text-4xl font-light text-white mb-8 uppercase tracking-tight">
                {item.title}
              </h2>
              
              {/* Mobile: Sequential animation with natural flow */}
              <div className="md:hidden flex flex-wrap w-full">
                {item.body.map((line, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + (i * 0.1), ease: "easeOut" }}
                    className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tighter uppercase mr-[0.3em] inline-block break-words whitespace-normal"
                  >
                    {highlightPhrases(line)}
                  </motion.span>
                ))}
              </div>

              {/* Desktop: Line-by-line formatting */}
              <div className="hidden md:block space-y-2">
                {item.body.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + (i * 0.1), ease: "easeOut" }}
                    className="font-display text-6xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tighter uppercase"
                  >
                    {highlightPhrases(line)}
                  </motion.p>
                ))}
              </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function ScrollContent() {
  return (
    <div className="relative z-10 pt-[25vh] bg-transparent">
      <div className="bg-transparent backdrop-blur-sm">
        {content.map((item, index) => (
          <Section key={item.id} item={item} index={index} isLast={index === content.length - 1} />
        ))}
      </div>
    </div>
  );
}
