'use client';

import { Hero } from '../components/features/home/Hero';
import { Marquee } from '../components/features/home/Marquee';
import { FeaturedCollection } from '../components/features/home/FeaturedCollection';
import { ProductShowcase } from '../components/features/home/ProductShowcase';
import { CustomizerSection } from '../components/features/home/CustomizerSection';
import { EditorialStory } from '../components/features/home/EditorialStory';
import { InstagramGrid } from '../components/features/home/InstagramGrid';
import { NewsletterSection } from '../components/features/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCollection />
      <ProductShowcase />
      <CustomizerSection />
      <EditorialStory />
      <InstagramGrid />
      <NewsletterSection />
    </>
  );
}
