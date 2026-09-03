'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../../../lib/data/products';

export const InstagramGrid: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-zinc-50 overflow-hidden border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 text-red-600" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 font-bold">
                COMMUNITY ARCHIVE
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-black uppercase">
              TAGGED // #GMATELIER
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-zinc-700 hover:text-black uppercase mt-4 sm:mt-0 transition-colors"
          >
            FOLLOW @GM_ATELIER <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 6 Fashion Imagery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer shadow-xs"
              data-cursor="view"
            >
              <img
                src={post.image}
                alt="THREADX Streetwear Community"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                <Instagram className="w-5 h-5 text-white mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                  {post.tag}
                </span>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-zinc-400" /> {post.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
