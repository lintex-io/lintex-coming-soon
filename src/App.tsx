/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import KineticTypography from './components/KineticTypography';
import EmailForm from './components/EmailForm';
import Logo from './components/Logo';
import ScrollContent from './components/ScrollContent';
import { motion } from 'motion/react';

function ScrollIndicator() {
  return (
    <div className="hidden md:flex flex-col items-center gap-2 mix-blend-difference pointer-events-none">
      <div className="h-16 w-[1px] bg-white/50 overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-white h-1/2"
          animate={{ top: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">Scroll</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Background Effect (Fixed) */}
      <KineticTypography />

      {/* Header / Logo - Fixed to top */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-start pointer-events-auto px-6 md:px-12 py-12 bg-gradient-to-b from-black via-black/80 to-transparent"
      >
        <Logo />
      </motion.header>

      {/* Footer / Form - Fixed to bottom */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 w-full flex flex-col gap-8 pointer-events-auto px-6 md:px-12 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent"
      >
        <div className="w-full flex flex-col md:flex-row justify-between items-end">
          {/* Scroll Indicator - aligned with form */}
          <ScrollIndicator />

          <div className="w-full max-w-md text-center md:text-right">
            <p className="text-sm font-mono text-white/60 mb-8 uppercase tracking-widest leading-relaxed">
              LINTEX IS COMING.<br />
              GET ON THE LIST BEFORE THE NEXT CRASH.
            </p>
            <EmailForm />
          </div>
        </div>
        
        <div className="w-full flex justify-between items-end border-t border-white/10 pt-6">
           <span className="text-[10px] font-mono text-white/30 uppercase">© 2026 Lintex. ALL RIGHTS RESERVED.</span>
           <div className="flex gap-4">
              <a href="#" className="text-[10px] font-mono text-white/50 hover:text-white uppercase transition-colors">Twitter</a>
              <a href="https://t.me/Lintex_io" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/50 hover:text-white uppercase transition-colors">Telegram</a>
           </div>
        </div>
      </motion.footer>

      {/* Hero Section (100vh) - Just a spacer now since header/footer are fixed */}
      <main className="relative z-10 w-full h-screen flex flex-col justify-between pointer-events-none">
        {/* Empty spacer to keep the scroll flow correct if needed, or just let ScrollContent handle it */}
      </main>

      {/* Scroll Content (Appears after scroll) */}
      <ScrollContent />
    </div>
  );
}

