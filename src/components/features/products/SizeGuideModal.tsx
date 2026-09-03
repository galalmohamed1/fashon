'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Check } from 'lucide-react';
import { useShop } from '../../../lib/context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isSizeGuideOpen) return null;

  const measurements = [
    { size: 'XS', chestIn: '38 - 40', chestCm: '96 - 101', lengthIn: '28.0', lengthCm: '71.1', shoulderIn: '19.5', shoulderCm: '49.5' },
    { size: 'S', chestIn: '40 - 42', chestCm: '101 - 106', lengthIn: '29.0', lengthCm: '73.6', shoulderIn: '20.5', shoulderCm: '52.0' },
    { size: 'M', chestIn: '42 - 44', chestCm: '106 - 112', lengthIn: '30.0', lengthCm: '76.2', shoulderIn: '21.5', shoulderCm: '54.6' },
    { size: 'L', chestIn: '44 - 46', chestCm: '112 - 117', lengthIn: '31.0', lengthCm: '78.7', shoulderIn: '22.5', shoulderCm: '57.1' },
    { size: 'XL', chestIn: '46 - 48', chestCm: '117 - 122', lengthIn: '32.0', lengthCm: '81.3', shoulderIn: '23.5', shoulderCm: '59.7' },
    { size: 'XXL', chestIn: '48 - 50', chestCm: '122 - 127', lengthIn: '33.0', lengthCm: '83.8', shoulderIn: '24.5', shoulderCm: '62.2' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-black" />
              <h3 className="font-display font-black text-xl text-black uppercase tracking-wide">
                GM ATELIER SIZE & FIT SPEC
              </h3>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1.5 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between my-5">
            <p className="text-xs font-mono text-zinc-600 font-bold">
              BOX-FIT CUT // INTENTIONAL OVERSIZED DRAPE
            </p>
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  unit === 'inches' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                }`}
              >
                INCHES
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Measurement Table */}
          <div className="overflow-x-auto border border-zinc-200 rounded-2xl bg-zinc-50">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 text-black uppercase border-b border-zinc-200 font-bold">
                <tr>
                  <th className="p-3.5">SIZE</th>
                  <th className="p-3.5">CHEST WIDTH</th>
                  <th className="p-3.5">TOTAL LENGTH</th>
                  <th className="p-3.5">SHOULDER DROP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                {measurements.map((m) => (
                  <tr key={m.size} className="hover:bg-zinc-100/60 transition-colors">
                    <td className="p-3.5 font-bold text-black">{m.size}</td>
                    <td className="p-3.5">{unit === 'inches' ? `${m.chestIn}"` : `${m.chestCm} cm`}</td>
                    <td className="p-3.5">{unit === 'inches' ? `${m.lengthIn}"` : `${m.lengthCm} cm`}</td>
                    <td className="p-3.5">{unit === 'inches' ? `${m.shoulderIn}"` : `${m.shoulderCm} cm`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model Fit Guide */}
          <div className="mt-5 p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-600 font-sans">
              <strong className="text-black font-bold">Fit recommendation:</strong> Take your standard true-to-size for the intended architectural boxy fit. Size down 1 size if you prefer a classic tailored look.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
