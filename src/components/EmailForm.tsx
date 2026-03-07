import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('You are on the list.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect. Please try again.');
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-transparent border-b border-white/30 py-4 pr-12 text-lg text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors font-mono uppercase tracking-wider disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success' || !email}
            className="absolute right-0 p-2 text-white/70 hover:text-white transition-colors disabled:opacity-30"
          >
            {status === 'loading' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : status === 'success' ? (
              <Check className="w-6 h-6 text-emerald-400" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
        
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute left-0 right-0 text-center bottom-full mb-4 md:bottom-auto md:top-full md:left-0 md:right-auto md:text-left md:mt-2 md:mb-0 text-xs font-mono tracking-widest uppercase ${
                status === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
