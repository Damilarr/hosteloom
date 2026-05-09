"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from './TourProvider';
import { MdArrowBack, MdArrowForward, MdClose } from 'react-icons/md';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getTargetRect(selector: string): TargetRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function scrollToTarget(selector: string) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

type Placement = 'top' | 'bottom' | 'left' | 'right';

function getCardPosition(rect: TargetRect, placement: Placement, cardWidth: number, cardHeight: number) {
  const OFFSET = 16;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  let top = 0, left = 0;

  switch (placement) {
    case 'bottom':
      top = rect.top + rect.height + OFFSET;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      break;
    case 'top':
      top = rect.top - cardHeight - OFFSET;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - cardHeight / 2;
      left = rect.left + rect.width + OFFSET;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - cardHeight / 2;
      left = rect.left - cardWidth - OFFSET;
      break;
  }

  if (left < 12) left = 12;
  if (left + cardWidth > vw - 12) left = vw - cardWidth - 12;
  if (top < 12) top = 12;
  if (top + cardHeight > vh - 12) top = vh - cardHeight - 12;

  return { top, left };
}

const CARD_WIDTH = 320;
const ESTIMATED_CARD_HEIGHT = 180;
const PADDING = 8;

export default function GuidedTour() {
  const { isActive, step, currentStep, totalSteps, next, prev, skip } = useTour();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const updateRect = useCallback(() => {
    if (!step) return;
    const rect = getTargetRect(step.target);
    if (rect) setTargetRect(rect);
    setIsMobile(window.innerWidth < 640);
  }, [step]);

  useEffect(() => {
    if (!isActive || !step) return;
    updateRect();
    scrollToTarget(step.target);
    const timer = setTimeout(updateRect, 150);
    return () => clearTimeout(timer);
  }, [isActive, step, updateRect]);

  useEffect(() => {
    if (!isActive || !step) return;
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => { updateRect(); ticking = false; });
      }
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, step, updateRect]);

  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, next, prev, skip]);

  if (!isActive || !step) return null;

  const placement = step.placement ?? 'bottom';
  const cardPos = targetRect
    ? getCardPosition(targetRect, placement, CARD_WIDTH, ESTIMATED_CARD_HEIGHT)
    : { top: window.innerHeight / 2 - ESTIMATED_CARD_HEIGHT / 2, left: window.innerWidth / 2 - CARD_WIDTH / 2 };

  const spotX = targetRect ? targetRect.left - PADDING : 0;
  const spotY = targetRect ? targetRect.top - PADDING : 0;
  const spotW = targetRect ? targetRect.width + PADDING * 2 : 0;
  const spotH = targetRect ? targetRect.height + PADDING * 2 : 0;

  const cardContent = (
    <div className="bg-hosteloom-surface border border-hosteloom-accent/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-hosteloom-accent/20 flex items-center justify-center text-hosteloom-accent text-xs font-heading font-bold">
              {currentStep + 1}
            </div>
            <span className="text-[10px] text-hosteloom-muted font-heading uppercase tracking-widest">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <button onClick={skip} className="text-hosteloom-muted hover:text-hosteloom-heading transition-colors p-0.5" aria-label="Close tour">
            <MdClose className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-heading font-bold text-base text-hosteloom-heading mb-1.5">{step.title}</h3>
        <p className="text-sm text-hosteloom-muted font-body leading-relaxed">{step.description}</p>

        <div className="flex items-center gap-1.5 mt-4 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-6 bg-hosteloom-accent' : i < currentStep ? 'w-2 bg-hosteloom-accent/50' : 'w-2 bg-hosteloom-border'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={skip} className="text-xs text-hosteloom-muted hover:text-hosteloom-heading font-heading font-medium transition-colors">
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-heading font-medium text-hosteloom-heading bg-hosteloom-hover-bg border border-hosteloom-border hover:bg-hosteloom-hover-bg transition-all"
              >
                <MdArrowBack className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-heading font-bold text-hosteloom-heading bg-hosteloom-accent hover:bg-hosteloom-accent-hover transition-all"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              {currentStep < totalSteps - 1 && <MdArrowForward className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9998]" aria-modal="true" role="dialog" key="tour-overlay">
        {/* Overlay with spotlight cutout */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }} onClick={skip}>
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={spotX} y={spotY} width={spotW} height={spotH} rx="12" fill="black"
                  style={{ transition: 'x 0.2s ease, y 0.2s ease, width 0.2s ease, height 0.2s ease' }}
                />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#tour-spotlight-mask)" />
        </svg>

        {/* Spotlight glow border */}
        {targetRect && (
          <div
            className="absolute rounded-xl border border-hosteloom-accent/70 pointer-events-none"
            style={{
              top: spotY, left: spotX, width: spotW, height: spotH,
              boxShadow: '0 0 18px 4px rgba(168, 85, 247, 0.35), inset 0 0 12px 2px rgba(168, 85, 247, 0.08)',
              transition: 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease',
              animation: 'tour-glow-breathe 2.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Card — bottom sheet on mobile, floating on desktop */}
        {isMobile ? (
          <motion.div
            key={step.id}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pb-6"
            style={{ pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {cardContent}
          </motion.div>
        ) : (
          <motion.div
            ref={cardRef}
            key={step.id}
            className="absolute z-[9999]"
            style={{
              top: cardPos.top, left: cardPos.left, width: CARD_WIDTH,
              pointerEvents: 'auto',
              transition: 'top 0.2s ease, left 0.2s ease',
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {cardContent}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
