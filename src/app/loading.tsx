import { LiquidLogoLoader } from '@/components/ui/LiquidLogoLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
      <LiquidLogoLoader autoLoop={true} size={135} statusText="LOADING ATELIER..." />
    </div>
  );
}
