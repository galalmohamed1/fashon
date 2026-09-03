import { Product } from '../../types';

export const PRODUCTS: Product[] = [
  {
    id: 'tx-tee-lucky-cat',
    name: 'KIIKII Original Lucky Cat Tee',
    price: 64,
    originalPrice: 79,
    category: 't-shirts',
    collection: 'TOKYO ATELIER',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Oatmeal Sand', hex: '#DED4C5' },
      { name: 'Obsidian Black', hex: '#121214' },
      { name: 'Pure White', hex: '#F5F5F7', border: true },
      { name: 'Royal Cobalt', hex: '#0B3EBC' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Archive graphic tee crafted from premium 280 GSM organic combed cotton in natural oatmeal sand. Features iconic Japanese Maneki-neko silkscreen artwork in vivid Royal Cobalt blue, "神を信じる" typography, bold "ORIGINAL" base, chunky crewneck ribbing, and custom woven hem clip label.',
    materials: [
      '100% Heavyweight Organic Combed Ring-Spun Cotton (280 GSM)',
      'Plastisol & high-density water-based royal blue screenprint',
      '1.25" Chunky 1x1 cotton rib retention collar',
      'Woven archive hem clip tag'
    ],
    features: [
      'Traditional Maneki-neko (Lucky Cat) Japanese screenprint',
      'Oatmeal sand organic unbleached cotton base',
      'Structured boxy drop-shoulder silhouette',
      'Reinforced double-needle stitched sleeves & hem'
    ],
    rating: 5.0,
    reviewCount: 184,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 24,
    tag: 'NEW DROP'
  },
  {
    id: 'tx-tee-01',
    name: 'Essential Oversized Tee',
    price: 59,
    originalPrice: 75,
    category: 't-shirts',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#121214' },
      { name: 'Pure White', hex: '#F5F5F7', border: true },
      { name: 'Mineral Gray', hex: '#52525B' },
      { name: 'Raw Cream', hex: '#E7E5E4' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Constructed from 280 GSM heavyweight custom-milled organic French terry cotton. Features dropped shoulder seam geometry, reinforced double-needle collar, and anti-shrink enzyme wash finish for a tailored drape.',
    materials: [
      '100% Heavyweight Organic Combed Cotton (280 GSM)',
      'Pre-shrunk enzyme bio-wash finish',
      'Custom rib-knit collar retention system',
      'Ethically sourced in Portugal'
    ],
    features: [
      'Relaxed boxy silhouette with dropped shoulders',
      'Silicone high-density tonal THREADX back nape hit',
      'Seamless tubular side construction',
      'Breathable, moisture-regulating knit structure'
    ],
    rating: 4.9,
    reviewCount: 142,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 18,
    tag: 'BESTSELLER'
  },
  {
    id: 'tx-tee-02',
    name: 'Heavyweight Matrix Tee',
    price: 69,
    category: 't-shirts',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#121214' },
      { name: 'Cyber Crimson', hex: '#DC2626' },
      { name: 'Charcoal', hex: '#27272A' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Engineered for tactical urban wear. High-gauge 320 GSM jersey with liquid-repellent microscopic nanocoating and matte rubberized front typography.',
    materials: [
      '100% Compact Spun Cotton (320 GSM)',
      'Water & smudge resistant nanotech finish',
      'High-density screenprint graphic'
    ],
    features: [
      'Heavyweight structural box drape',
      'UV-reactive accent chest print',
      'Side split hem with bar-tack reinforcement'
    ],
    rating: 4.8,
    reviewCount: 98,
    isFeatured: true,
    inStock: true,
    stockCount: 12,
    tag: 'LIMITED DROP'
  },
  {
    id: 'tx-tee-03',
    name: 'Signature Minimal White Tee',
    price: 59,
    category: 't-shirts',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Pure White', hex: '#F8FAFC', border: true },
      { name: 'Raw Cream', hex: '#E7E5E4' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An architectural baseline. Clean optical white jersey tailored with minimal collar seam and zero external branding for pure aesthetic focus.',
    materials: [
      '100% Pima Long-Staple Cotton (260 GSM)',
      'Silky carbonized hand-feel treatment'
    ],
    features: [
      'Zero shrinkage guarantee',
      'Ultra-refined micro-stitch collar',
      'Flawless geometric silhouette'
    ],
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    stockCount: 25
  },
  {
    id: 'tx-tee-04',
    name: 'Core Cream Vintage Tee',
    price: 64,
    category: 't-shirts',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Raw Cream', hex: '#E5E0D8' },
      { name: 'Mineral Gray', hex: '#71717A' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Mineral-washed vintage ivory tone with subtly distressed collar edges and a dense, luxurious body drape that softens with every wash.',
    materials: ['100% Organic Ring-spun Cotton', 'Natural vegetable dye process'],
    features: ['Custom sun-faded wash effect', 'Subtle raw-edge hems', 'Signature metal brand tag at hem'],
    rating: 4.7,
    reviewCount: 54,
    inStock: true,
    stockCount: 9
  },
  {
    id: 'tx-hoodie-01',
    name: 'Shadow Tech Boxy Hoodie',
    price: 129,
    originalPrice: 155,
    category: 'hoodies',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#101012' },
      { name: 'Washed Charcoal', hex: '#27272A' },
      { name: 'Concrete Gray', hex: '#52525B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Ultra-heavy 480 GSM loopback cotton fleece. Designed with a double-layered structured hood that stands without drawstrings, hidden seam kangaroo pockets, and articulated elbow darting.',
    materials: [
      '100% Heavy Combed Cotton Fleece (480 GSM)',
      'Double-ply crossover hood structure',
      'Thermal micro-fleece inner lining'
    ],
    features: [
      'Crossover drawstring-free architectural hood',
      'Concealed waterproof zip pocket on forearm',
      'Ribbed side gussets for maximum range of motion'
    ],
    rating: 5.0,
    reviewCount: 210,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 14,
    tag: 'ICON PIECE'
  },
  {
    id: 'tx-hoodie-02',
    name: 'Obsidian Minimalist Pullover',
    price: 119,
    category: 'hoodies',
    collection: 'TACTICAL MONOCHROME',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#18181B' },
      { name: 'Pure White', hex: '#F4F4F5', border: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A purist design with clean lines, concealed stitching, and an ergonomic oversized drape. Built for seamless layering under heavy technical jackets.',
    materials: ['85% Organic Cotton, 15% Recycled Polyester (420 GSM)'],
    features: ['Laser-engraved metal eyelets', 'Matte black metal aglets', 'Anti-pilling dense weave'],
    rating: 4.8,
    reviewCount: 88,
    inStock: true,
    stockCount: 22
  },
  {
    id: 'tx-jacket-01',
    name: 'Urban Shell Tech Jacket',
    price: 229,
    originalPrice: 280,
    category: 'jackets',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#09090B' },
      { name: 'Carbon Slate', hex: '#3F3F46' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: '3-layer waterproof and windproof technical shell membrane with fully taped seams, magnetic storm flap closures, Fidlock magnetic chest buckle, and internal sling carrying harness.',
    materials: [
      '3-Ply Technical Gore-Dyneema membrane (20,000mm waterproof / 15,000g breathability)',
      'YKK AquaGuard waterproof zippers',
      'German-engineered Fidlock magnetic fasteners'
    ],
    features: [
      'Internal jacket-sling carry system for hands-free transport',
      '6 modular tactical pockets with concealed storm baffles',
      'Fleece-lined chin guard and helmet-compatible storm hood',
      'Reflective 3M Scotchlite subtle cyber typography'
    ],
    rating: 4.95,
    reviewCount: 164,
    isNew: true,
    isFeatured: true,
    inStock: true,
    stockCount: 8,
    tag: 'FLAGSHIP'
  },
  {
    id: 'tx-jacket-02',
    name: 'Matrix Utility Bomber',
    price: 189,
    category: 'jackets',
    collection: 'TACTICAL MONOCHROME',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#18181B' },
      { name: 'Tactical Olive', hex: '#3F4238' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'A modernized flight jacket silhouette crafted from high-density ballistic nylon with ribbed collar and articulated sleeve shirring.',
    materials: ['100% High-Tenacity Ballistic Nylon', 'Primaloft lightweight insulation'],
    features: ['Sleeve utility zip pocket with detachable brand strap', 'Heavy gauge two-way front zipper', 'Dual internal welt pockets'],
    rating: 4.85,
    reviewCount: 92,
    inStock: true,
    stockCount: 11
  },
  {
    id: 'tx-jacket-03',
    name: 'Sculpted Puffer Gilet',
    price: 169,
    category: 'jackets',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#000000' },
      { name: 'Chalk White', hex: '#E2E8F0', border: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-loft baffle construction filled with cruelty-free thermal insulation. Features a high stand collar and magnetic front enclosure.',
    materials: ['Matte Japanese Ripstop Polyester', '700-fill equivalent EcoDown fill'],
    features: ['Concealed cord-lock hem adjuster', 'Internal zip passport pocket', 'Ultra-lightweight warmth'],
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    stockCount: 15
  },
  {
    id: 'tx-pants-01',
    name: 'Relaxed Tactical Cargo Pants',
    price: 139,
    originalPrice: 165,
    category: 'pants',
    collection: 'TACTICAL MONOCHROME',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#121214' },
      { name: 'Washed Olive', hex: '#374151' },
      { name: 'Sand Khaki', hex: '#D6D3D1' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Ergonomically tailored cargo pants crafted from durable stretch-twill cotton ripstop. Features 8 utility pockets with bellowed storage, adjustable cinch ankles, and an integrated nylon webbing belt.',
    materials: [
      '98% Cotton Ripstop, 2% Elastane Flex-weave',
      'Teflon stain-repellent exterior treatment',
      'Mil-spec nylon tape reinforcement'
    ],
    features: [
      'Articulated knee darts for unrestricted stride',
      'Modular expandable bellow pockets',
      'Magnetic buckle waist adjustment system',
      'Convertible ankle cuff from wide-leg to tapered'
    ],
    rating: 4.9,
    reviewCount: 175,
    isFeatured: true,
    inStock: true,
    stockCount: 19,
    tag: 'POPULAR'
  },
  {
    id: 'tx-pants-02',
    name: 'Signature Obsidian Wide Trousers',
    price: 129,
    category: 'pants',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Pitch Black', hex: '#09090B' },
      { name: 'Heather Charcoal', hex: '#3F3F46' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Pleated front wide-leg trousers that strike the perfect balance between high-tailoring and relaxed streetwear elegance. Luxurious drape with fluid motion.',
    materials: ['70% Polyester, 26% Rayon, 4% Spandex Suiting Blend'],
    features: ['Double front pleats', 'Side elastic waist inserts for comfort', 'Deep trouser pockets'],
    rating: 4.85,
    reviewCount: 64,
    inStock: true,
    stockCount: 16
  },
  {
    id: 'tx-pants-03',
    name: 'Modular Techwear Joggers',
    price: 119,
    category: 'pants',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#18181B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Heavyweight French terry joggers infused with technical nylon knee overlays and waterproof zipper accents.',
    materials: ['100% Organic Cotton Fleece + 100% CORDURA nylon patches'],
    features: ['Deep zippered security pockets', 'Dense ribbed cuffs', 'Custom braided drawstrings'],
    rating: 4.75,
    reviewCount: 82,
    inStock: true,
    stockCount: 20
  },
  {
    id: 'tx-acc-01',
    name: 'THREADX Tactical Crossbody Bag',
    price: 89,
    originalPrice: 110,
    category: 'accessories',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Matte Black', hex: '#09090B' }
    ],
    sizes: ['ONE SIZE'],
    description: 'Engineered from 1000D Cordura ballistic fabric with Fidlock V-buckle magnetic quick-release strap, padded tablet sleeve, and hidden RFID-blocking passport compartment.',
    materials: [
      '1000D CORDURA Ballistic Nylon',
      'German Fidlock magnetic hardware',
      'YKK AquaGuard weather-resistant zips'
    ],
    features: [
      'Rapid-adjust ambidextrous strap',
      'Modular MOLLE webbing attachment points',
      'Internal organizer with key tether'
    ],
    rating: 4.95,
    reviewCount: 130,
    isFeatured: true,
    inStock: true,
    stockCount: 10,
    tag: 'MUST HAVE'
  },
  {
    id: 'tx-acc-02',
    name: 'Hardware Minimalist Belt',
    price: 49,
    category: 'accessories',
    collection: 'TACTICAL MONOCHROME',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Anodized Black', hex: '#18181B' },
      { name: 'Silver Steel', hex: '#E4E4E7' }
    ],
    sizes: ['ONE SIZE (125cm Adjustable)'],
    description: 'Heavy duty nylon webbing with CNC machined aircraft aluminum alloy buckle. Instant push-button release.',
    materials: ['Aircraft-grade 7075 Aluminum', 'High-tensile mil-spec webbing'],
    features: ['Infinitely adjustable without belt holes', 'Laser-etched THREADX serial coordinate'],
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockCount: 30
  },
  {
    id: 'tx-acc-03',
    name: 'Cyber Knit Beanie',
    price: 39,
    category: 'accessories',
    collection: 'CORE 2026',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Pitch Black', hex: '#09090B' },
      { name: 'Raw Cream', hex: '#E7E5E4' },
      { name: 'Signal Orange', hex: '#EA580C' }
    ],
    sizes: ['ONE SIZE'],
    description: 'Double-ribbed merino wool blend beanie with a low-profile crown and removable silicone brand pin.',
    materials: ['50% Merino Wool, 50% Recycled Acrylic'],
    features: ['Thermal regulating knit', 'Itch-free soft interior band'],
    rating: 4.7,
    reviewCount: 65,
    inStock: true,
    stockCount: 28
  },
  {
    id: 'tx-tee-05',
    name: 'Liquid Chrome Graphic Tee',
    price: 65,
    category: 't-shirts',
    collection: 'LIMITED DROP',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#121214' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Special edition tee featuring high-gloss reflective chrome metallic screen print rendering across the back shoulder blade line.',
    materials: ['100% Combed Heavy Cotton (290 GSM)'],
    features: ['Reflective chrome ink print', 'Numbered edition tag', 'Oversized drop shoulder'],
    rating: 4.9,
    reviewCount: 39,
    isNew: true,
    inStock: true,
    stockCount: 6,
    tag: 'LIMITED 500 PCS'
  },
  {
    id: 'tx-hoodie-03',
    name: 'Cybernetic Thermal Zip Hoodie',
    price: 139,
    category: 'hoodies',
    collection: 'CYBER ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Washed Charcoal', hex: '#27272A' },
      { name: 'Obsidian Black', hex: '#101012' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Full-zip tactical hoodie with dual-direction zipper, thumbhole cuffs, and concealed earphone channel.',
    materials: ['100% Heavy Brushed Terry Cotton (450 GSM)'],
    features: ['Double-way front zipper', 'Ribbed articulated side panels', 'Reinforced elbow patches'],
    rating: 4.85,
    reviewCount: 52,
    inStock: true,
    stockCount: 15
  },
  {
    id: 'tx-jacket-04',
    name: 'Distressed Cyber Denim Overcoat',
    price: 219,
    category: 'jackets',
    collection: 'LIMITED DROP',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    hoverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Acid Washed Black', hex: '#2D2D32' }
    ],
    sizes: ['M', 'L', 'XL'],
    description: '14oz rigid Japanese selvedge denim, hand-distressed with subtle abrasive laser detailing and gunmetal hardware.',
    materials: ['100% Japanese Selvedge Cotton Denim (14oz)'],
    features: ['Custom branded shank buttons', 'Raw frayed bottom hem', 'Dual chest cargo slots'],
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
    stockCount: 5,
    tag: 'EXCLUSIVE'
  }
];

export const REVIEWS_DATA: Record<string, import('../../types').Review[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: 'August 14, 2026',
      verified: true,
      title: 'Best heavyweight tee on the market by far',
      comment: 'The collar does not bacon at all. The 280 GSM weight creates the most architectural silhouette I have seen from any luxury streetwear house. Drapes effortlessly.',
      sizePurchased: 'L',
      colorPurchased: 'Obsidian Black'
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      rating: 5,
      date: 'August 22, 2026',
      verified: true,
      title: 'Insane build quality and packaging',
      comment: 'The unboxing felt like purchasing a futuristic luxury tech device. Heavy cotton, clean seams, and fits true to oversized aesthetic.',
      sizePurchased: 'M',
      colorPurchased: 'Pure White'
    },
    {
      id: 'rev-3',
      author: 'Kai Tanaka',
      rating: 5,
      date: 'July 29, 2026',
      verified: true,
      title: 'Worth every single penny',
      comment: 'Washed it 6 times already and zero shrinkage or color fade. The tactile feel is premium. Getting another 2 colors immediately.',
      sizePurchased: 'XL',
      colorPurchased: 'Mineral Gray'
    }
  ]
};

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    tag: '@THREADX_STUDIO',
    likes: '14.2K',
    comments: '342'
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    tag: '#THREADXIDENTITY',
    likes: '9.8K',
    comments: '188'
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    tag: '#CYBERESSENTIALS',
    likes: '22.1K',
    comments: '604'
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    tag: '@TOKYO_DROP',
    likes: '11.5K',
    comments: '219'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    tag: '#TACTICALMONO',
    likes: '18.7K',
    comments: '412'
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    tag: '@THREADX_RUNWAY',
    likes: '15.9K',
    comments: '298'
  }
];
