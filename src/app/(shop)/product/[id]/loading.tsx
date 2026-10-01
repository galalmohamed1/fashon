import { LiquidLogoLoader } from '@/components/ui/LiquidLogoLoader';

export default function ProductLoading() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-white flex items-center justify-center">
      <LiquidLogoLoader
        autoLoop={true}
        size={135}
        statusText="LOADING ARCHIVE SPECIFICATION..."
      />
    </div>
  );
}
