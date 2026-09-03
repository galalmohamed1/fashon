// 'use client';
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as THREE from 'three';
// import { ZoomIn, ZoomOut, RefreshCw, Layers, Eye, Play, Pause, Compass, Sparkles } from 'lucide-react';
// import { CustomDesignOption } from '../../../types';

// interface TShirt3DProps {
//   colorHex?: string;
//   design?: CustomDesignOption;
//   autoRotate?: boolean;
//   interactive?: boolean;
//   heightClass?: string;
//   showControls?: boolean;
//   className?: string;
// }

// export const TShirt3D: React.FC<TShirt3DProps> = ({
//   colorHex = '#DED4C5',
//   design = 'kiikii-cat',
//   autoRotate = true,
//   interactive = true,
//   heightClass = 'h-[460px] sm:h-[540px] lg:h-[620px]',
//   showControls = true,
//   className = ''
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewAngle, setViewAngle] = useState<'front' | 'angle' | 'side' | 'back' | 'detail'>('front');
//   const [isAutoSpinning, setIsAutoSpinning] = useState(autoRotate);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [wireframeMode, setWireframeMode] = useState(false);
//   const [rotationDegrees, setRotationDegrees] = useState(0);

//   // Three.js instance references
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const garmentGroupRef = useRef<THREE.Group | null>(null);
//   const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
//   const collarMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
//   const labelMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
//   const hemTagMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
//   const animFrameId = useRef<number | null>(null);

//   // Mouse & Touch 360° Drag State
//   const isDragging = useRef(false);
//   const previousPointer = useRef({ x: 0, y: 0 });
//   const targetRotation = useRef({ x: 0.04, y: 0 });
//   const currentRotation = useRef({ x: 0.04, y: 0 });
//   const velocityY = useRef(0);
//   const mouseParallax = useRef({ x: 0, y: 0 });

//   // 1. High-Density Organic Cotton Fabric Bump Texture
//   const createFabricTexture = useCallback(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 512;
//     canvas.height = 512;
//     const ctx = canvas.getContext('2d')!;

//     ctx.fillStyle = '#808080';
//     ctx.fillRect(0, 0, 512, 512);

//     const imgData = ctx.getImageData(0, 0, 512, 512);
//     const data = imgData.data;

//     for (let y = 0; y < 512; y++) {
//       for (let x = 0; x < 512; x++) {
//         const idx = (y * 512 + x) * 4;
//         const knitX = Math.sin((x / 512) * Math.PI * 128);
//         const knitY = Math.cos((y / 512) * Math.PI * 96);
//         const threadWeave = (knitX * 0.5 + knitY * 0.5) * 16;
//         const microNoise = (Math.random() - 0.5) * 12;
//         const wave = Math.sin(x * 0.02 + y * 0.015) * 4;

//         const val = Math.min(255, Math.max(0, 128 + threadWeave + microNoise + wave));
//         data[idx] = val;
//         data[idx + 1] = val;
//         data[idx + 2] = val;
//         data[idx + 3] = 255;
//       }
//     }
//     ctx.putImageData(imgData, 0, 0);

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(12, 12);
//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   // 2. Chunky Ribbed Collar Neckband Bump Texture
//   const createCollarRibTexture = useCallback(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 256;
//     canvas.height = 256;
//     const ctx = canvas.getContext('2d')!;

//     ctx.fillStyle = '#808080';
//     ctx.fillRect(0, 0, 256, 256);

//     for (let x = 0; x < 256; x += 4) {
//       ctx.fillStyle = x % 8 === 0 ? '#585858' : '#a8a8a8';
//       ctx.fillRect(x, 0, 2, 256);
//     }

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(24, 2);
//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   // 3. Exact Japanese Lucky Cat Silk-screen Graphic (Matching photo IMG_1726.jpeg)
//   const drawLuckyCatGraphic = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, baseColorHex: string) => {
//     ctx.save();
//     ctx.translate(centerX, centerY);
//     ctx.scale(scale, scale);

//     const blue = '#0B3EBC'; // High-density royal cobalt ink
//     const bgCutoutColor = baseColorHex; // Dynamic background for cutouts to match the selected garment color

//     const outerW = 470;
//     const outerH = 510;
//     const innerW = 350;
//     const innerH = 380;

//     // 1. Diagonal Striped Outer Perimeter Frame
//     ctx.save();
//     ctx.beginPath();
//     ctx.rect(-outerW / 2, -outerH / 2, outerW, outerH);
//     ctx.rect(-innerW / 2, -innerH / 2, innerW, innerH);
//     ctx.clip('evenodd');

//     ctx.fillStyle = blue;
//     const stripeWidth = 24;
//     const gap = 24;
//     for (let i = -outerW - outerH; i < outerW + outerH; i += stripeWidth + gap) {
//       ctx.beginPath();
//       ctx.moveTo(i, -outerH);
//       ctx.lineTo(i + outerH * 1.2, outerH);
//       ctx.lineTo(i + outerH * 1.2 + stripeWidth, outerH);
//       ctx.lineTo(i + stripeWidth, -outerH);
//       ctx.closePath();
//       ctx.fill();
//     }
//     ctx.restore();

//     // 2. Solid Inner Frame Box
//     ctx.strokeStyle = blue;
//     ctx.lineWidth = 14;
//     ctx.strokeRect(-innerW / 2, -innerH / 2, innerW, innerH);

//     // Inner background fill in Royal Blue
//     ctx.fillStyle = blue;
//     ctx.fillRect(-innerW / 2 + 7, -innerH / 2 + 7, innerW - 14, innerH - 14);

//     // Cutout Window for Cat (garment color negative space)
//     ctx.fillStyle = bgCutoutColor;
//     ctx.fillRect(-innerW / 2 + 42, -innerH / 2 + 38, innerW - 84, innerH - 138);

//     // 3. Central Maneki-neko (Lucky Cat) in Solid Royal Blue
//     ctx.fillStyle = blue;
//     ctx.strokeStyle = blue;

//     // Cat Body / Torso silhouette
//     ctx.beginPath();
//     ctx.ellipse(0, 32, 82, 88, 0, 0, Math.PI * 2);
//     ctx.fill();

//     // Cat Head
//     ctx.beginPath();
//     ctx.arc(0, -36, 64, 0, Math.PI * 2);
//     ctx.fill();

//     // Cat Ears (Left & Right Pointed)
//     // Left ear
//     ctx.beginPath();
//     ctx.moveTo(-54, -60);
//     ctx.lineTo(-68, -112);
//     ctx.lineTo(-22, -86);
//     ctx.closePath();
//     ctx.fill();

//     // Right ear
//     ctx.beginPath();
//     ctx.moveTo(54, -60);
//     ctx.lineTo(68, -112);
//     ctx.lineTo(22, -86);
//     ctx.closePath();
//     ctx.fill();

//     // Waving Lucky Hand / Raised Paw
//     ctx.beginPath();
//     ctx.ellipse(72, -50, 24, 40, 0.35, 0, Math.PI * 2);
//     ctx.fill();

//     // Paw pads crease
//     ctx.strokeStyle = bgCutoutColor;
//     ctx.lineWidth = 4;
//     ctx.beginPath();
//     ctx.arc(72, -64, 10, 0, Math.PI);
//     ctx.stroke();

//     // Left Arm resting down
//     ctx.fillStyle = blue;
//     ctx.beginPath();
//     ctx.ellipse(-68, 32, 25, 46, -0.3, 0, Math.PI * 2);
//     ctx.fill();

//     // Cat Collar with Ring & Bell
//     ctx.strokeStyle = bgCutoutColor;
//     ctx.lineWidth = 7;
//     ctx.beginPath();
//     ctx.arc(0, 5, 50, 0.2, Math.PI - 0.2);
//     ctx.stroke();

//     // Bell Amulet
//     ctx.fillStyle = bgCutoutColor;
//     ctx.beginPath();
//     ctx.arc(0, 28, 14, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.fillStyle = blue;
//     ctx.beginPath();
//     ctx.arc(0, 28, 5, 0, Math.PI * 2);
//     ctx.fill();

//     // Cat Smiling Face Features
//     ctx.strokeStyle = bgCutoutColor;
//     ctx.lineWidth = 5;
//     ctx.lineCap = 'round';

//     // Happy smiling eyes (^ ^)
//     ctx.beginPath();
//     ctx.arc(-26, -42, 13, Math.PI * 1.15, Math.PI * 1.85);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.arc(26, -42, 13, Math.PI * 1.15, Math.PI * 1.85);
//     ctx.stroke();

//     // Nose & Mouth (= w =)
//     ctx.fillStyle = bgCutoutColor;
//     ctx.beginPath();
//     ctx.ellipse(0, -26, 4, 3, 0, 0, Math.PI * 2);
//     ctx.fill();

//     ctx.beginPath();
//     ctx.arc(-7, -19, 7, 0, Math.PI);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.arc(7, -19, 7, 0, Math.PI);
//     ctx.stroke();

//     // Whiskers (Left & Right)
//     ctx.beginPath();
//     ctx.moveTo(-38, -27);
//     ctx.lineTo(-60, -32);
//     ctx.moveTo(-38, -19);
//     ctx.lineTo(-60, -19);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(38, -27);
//     ctx.lineTo(60, -32);
//     ctx.moveTo(38, -19);
//     ctx.lineTo(60, -19);
//     ctx.stroke();

//     // Belly Brand Text: "KIIKII™"
//     ctx.fillStyle = bgCutoutColor;
//     ctx.font = '900 25px "Syne", "Cabinet Grotesk", sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('KIIKII™', 0, 70);

//     // 4. Japanese Kanji Text Below Inner Box: "神を信じる"
//     ctx.fillStyle = bgCutoutColor;
//     ctx.font = '900 27px sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('神を信じる', 0, innerH / 2 - 26);

//     // 5. Bold "ORIGINAL" Typography Under the Frame
//     ctx.fillStyle = blue;
//     ctx.font = '900 80px "Syne", "Cabinet Grotesk", sans-serif';
//     ctx.textAlign = 'center';
//     ctx.letterSpacing = '4px';
//     ctx.fillText('ORIGINAL', 0, outerH / 2 + 68);

//     // Solid Royal Blue Base Underline Block
//     ctx.fillRect(-outerW / 2 - 10, outerH / 2 + 86, outerW + 20, 50);

//     ctx.restore();
//   }, []);

//   // 4. Decal Generator for Chest Graphics
//   const createDecalTexture = useCallback(
//     (logoType: CustomDesignOption, baseColor: string) => {
//       const canvas = document.createElement('canvas');
//       canvas.width = 1024;
//       canvas.height = 1024;
//       const ctx = canvas.getContext('2d')!;

//       // Fill base garment color
//       ctx.fillStyle = baseColor;
//       ctx.fillRect(0, 0, 1024, 1024);

//       if (logoType === 'kiikii-cat') {
//         drawLuckyCatGraphic(ctx, 512, 530, 0.82, baseColor);
//       } else if (logoType === 'threadx-logo') {
//         const hex = baseColor.replace('#', '');
//         const r = parseInt(hex.substring(0, 2), 16) || 0;
//         const g = parseInt(hex.substring(2, 4), 16) || 0;
//         const b = parseInt(hex.substring(4, 6), 16) || 0;
//         const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
//         const logoColor = isLight ? '#09090b' : '#ffffff';

//         ctx.save();
//         ctx.translate(512, 440);
//         ctx.fillStyle = logoColor;
//         ctx.font = '900 72px "Syne", sans-serif';
//         ctx.textAlign = 'center';
//         ctx.fillText('GM ATELIER', 0, 16);

//         ctx.font = '700 14px "JetBrains Mono", monospace';
//         ctx.fillStyle = '#dc2626';
//         ctx.fillText('ARCHIVE EDITION // 2026', 0, 52);

//         ctx.font = '500 11px "JetBrains Mono", monospace';
//         ctx.fillStyle = isLight ? 'rgba(9,9,11,0.5)' : 'rgba(255,255,255,0.5)';
//         ctx.fillText('PARIS // TOKYO // MILANO [ 48.8566° N, 2.3522° E ]', 0, 84);

//         ctx.strokeStyle = isLight ? 'rgba(9, 9, 11, 0.25)' : 'rgba(255, 255, 255, 0.3)';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(-180, -68, 360, 172);
//         ctx.restore();
//       } else if (logoType === 'minimal-logo') {
//         const hex = baseColor.replace('#', '');
//         const r = parseInt(hex.substring(0, 2), 16) || 0;
//         const g = parseInt(hex.substring(2, 4), 16) || 0;
//         const b = parseInt(hex.substring(4, 6), 16) || 0;
//         const isLight = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
//         const logoColor = isLight ? '#09090b' : '#ffffff';

//         ctx.save();
//         ctx.translate(512, 440);
//         ctx.fillStyle = logoColor;
//         ctx.font = '900 64px "Syne", sans-serif';
//         ctx.textAlign = 'center';
//         ctx.fillText('GM', 0, 0);

//         ctx.fillStyle = '#dc2626';
//         ctx.beginPath();
//         ctx.arc(52, -18, 5, 0, Math.PI * 2);
//         ctx.fill();

//         ctx.font = '700 12px "JetBrains Mono", monospace';
//         ctx.fillText('GM ARCHIVE ATELIER', 0, 28);
//         ctx.restore();
//       }

//       const texture = new THREE.CanvasTexture(canvas);
//       texture.wrapS = THREE.ClampToEdgeWrapping;
//       texture.wrapT = THREE.ClampToEdgeWrapping;
//       texture.needsUpdate = true;
//       return texture;
//     },
//     [drawLuckyCatGraphic]
//   );

//   // 5. Inside Collar Woven Brand Label Tag
//   const createInnerLabelTexture = useCallback(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 256;
//     canvas.height = 128;
//     const ctx = canvas.getContext('2d')!;

//     ctx.fillStyle = '#111113';
//     ctx.fillRect(0, 0, 256, 128);

//     ctx.strokeStyle = '#ffffff33';
//     ctx.lineWidth = 1.5;
//     ctx.strokeRect(4, 4, 248, 120);

//     ctx.fillStyle = '#ffffff';
//     ctx.font = 'bold 22px "Syne", sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('KIIKII™', 128, 44);

//     ctx.fillStyle = '#3b82f6';
//     ctx.font = 'bold 12px monospace';
//     ctx.fillText('SIZE M // 100% COMBED COTTON', 128, 72);

//     ctx.fillStyle = '#a1a1aa';
//     ctx.font = '10px monospace';
//     ctx.fillText('ORIGINAL TOKYO / MILANO // 280 GSM', 128, 98);

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   // 6. Hem Clip Woven Tag (Visible on lower left hem)
//   const createHemTagTexture = useCallback(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 128;
//     canvas.height = 128;
//     const ctx = canvas.getContext('2d')!;

//     ctx.fillStyle = '#111113';
//     ctx.fillRect(0, 0, 128, 128);

//     ctx.strokeStyle = '#ffffff44';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(3, 3, 122, 122);

//     ctx.fillStyle = '#ffffff';
//     ctx.font = 'bold 18px "Syne", sans-serif';
//     ctx.textAlign = 'center';
//     ctx.fillText('KIIKII', 64, 46);

//     ctx.fillStyle = '#3b82f6';
//     ctx.font = 'bold 11px monospace';
//     ctx.fillText('ORIGINAL', 64, 76);

//     ctx.fillStyle = '#dc2626';
//     ctx.font = 'bold 9px monospace';
//     ctx.fillText('ARCHIVE', 64, 102);

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   // 7. Watertight, Beautifully Sculpted Photorealistic T-Shirt 3D Mesh
//   const buildRealisticTShirtMesh = useCallback(
//     (
//       frontMaterial: THREE.Material,
//       backMaterial: THREE.Material,
//       collarMaterial: THREE.Material,
//       labelMaterial: THREE.Material,
//       hemTagMaterial: THREE.Material
//     ) => {
//       const garmentGroup = new THREE.Group();

//       // --- TORSO BODY: Smooth Front & Back Panels ---
//       // Front Torso Panel with UVs mapped directly to decal texture
//       const torsoW = 2.4;
//       const torsoH = 2.6;
//       const torsoDepth = 0.46;

//       // Create sculpted front panel
//       const frontGeo = new THREE.PlaneGeometry(torsoW, torsoH, 48, 48);
//       const fPos = frontGeo.attributes.position;
//       const fUv = frontGeo.attributes.uv;

//       for (let i = 0; i < fPos.count; i++) {
//         let x = fPos.getX(i);
//         let y = fPos.getY(i);
//         const normY = y / (torsoH / 2);
//         const normX = x / (torsoW / 2);

//         // Natural garment chest curvature & subtle cloth folds
//         let z = Math.cos(normX * (Math.PI / 2)) * 0.22 * (1 - Math.abs(normY * 0.3));
//         const clothFold = Math.sin(y * 4.5 + x * 2.0) * 0.018 * (1 - Math.abs(normY * 0.6));
//         z += clothFold;

//         // Shoulder slope
//         if (normY > 0.4) {
//           const shoulderSlope = (normY - 0.4) * 0.25;
//           y -= Math.abs(normX) * shoulderSlope * 0.35;
//         }

//         // Taper towards waist
//         if (normY < 0.2 && normY > -0.7) {
//           x *= 0.96;
//         }

//         fPos.setXYZ(i, x, y, z + torsoDepth / 2);
//       }
//       frontGeo.computeVertexNormals();

//       const frontMesh = new THREE.Mesh(frontGeo, frontMaterial);
//       frontMesh.castShadow = true;
//       frontMesh.receiveShadow = true;
//       garmentGroup.add(frontMesh);

//       // Back Torso Panel (Plain fabric)
//       const backGeo = new THREE.PlaneGeometry(torsoW, torsoH, 48, 48);
//       const bPos = backGeo.attributes.position;
//       for (let i = 0; i < bPos.count; i++) {
//         let x = bPos.getX(i);
//         let y = bPos.getY(i);
//         const normY = y / (torsoH / 2);
//         const normX = x / (torsoW / 2);

//         let z = -Math.cos(normX * (Math.PI / 2)) * 0.18 * (1 - Math.abs(normY * 0.3));
//         const clothFold = Math.sin(y * 4.2 - x * 2.0) * 0.015;
//         z += clothFold;

//         if (normY > 0.4) {
//           const shoulderSlope = (normY - 0.4) * 0.25;
//           y -= Math.abs(normX) * shoulderSlope * 0.35;
//         }

//         if (normY < 0.2 && normY > -0.7) {
//           x *= 0.96;
//         }

//         bPos.setXYZ(i, x, y, z - torsoDepth / 2);
//       }
//       backGeo.rotateY(Math.PI);
//       backGeo.computeVertexNormals();

//       const backMesh = new THREE.Mesh(backGeo, backMaterial);
//       backMesh.castShadow = true;
//       backMesh.receiveShadow = true;
//       garmentGroup.add(backMesh);

//       // --- SIDE CONNECTORS / SEAMS ---
//       const sideGeoL = new THREE.PlaneGeometry(torsoDepth, torsoH * 0.72, 8, 24);
//       sideGeoL.rotateY(-Math.PI / 2);
//       const sideMeshL = new THREE.Mesh(sideGeoL, backMaterial);
//       sideMeshL.position.set(-torsoW / 2 + 0.05, -0.22, 0);
//       garmentGroup.add(sideMeshL);

//       const sideGeoR = new THREE.PlaneGeometry(torsoDepth, torsoH * 0.72, 8, 24);
//       sideGeoR.rotateY(Math.PI / 2);
//       const sideMeshR = new THREE.Mesh(sideGeoR, backMaterial);
//       sideMeshR.position.set(torsoW / 2 - 0.05, -0.22, 0);
//       garmentGroup.add(sideMeshR);

//       // --- CHUNKY RIBBED CREWNECK COLLAR ---
//       const collarGeo = new THREE.TorusGeometry(0.52, 0.075, 24, 64);
//       collarGeo.scale(1.04, 0.74, 1.0);
//       collarGeo.rotateX(Math.PI / 2.15);
//       collarGeo.translate(0, 1.22, 0.02);
//       const collarMesh = new THREE.Mesh(collarGeo, collarMaterial);
//       collarMesh.castShadow = true;
//       garmentGroup.add(collarMesh);

//       // Inside Collar Neck Tape & Brand Label
//       const tapeGeo = new THREE.TorusGeometry(0.48, 0.022, 12, 48);
//       tapeGeo.scale(1.04, 0.74, 1.0);
//       tapeGeo.rotateX(Math.PI / 2.15);
//       tapeGeo.translate(0, 1.18, 0.02);
//       const tapeMesh = new THREE.Mesh(tapeGeo, backMaterial);
//       garmentGroup.add(tapeMesh);

//       const labelGeo = new THREE.PlaneGeometry(0.38, 0.18);
//       const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
//       labelMesh.position.set(0, 1.05, -0.26);
//       labelMesh.rotation.set(-0.15, 0, 0);
//       garmentGroup.add(labelMesh);

//       // --- DOUBLE-NEEDLE BOTTOM HEM BAND ---
//       const hemGeo = new THREE.TorusGeometry(1.18, 0.038, 16, 64);
//       hemGeo.scale(1.0, 0.44, 1.0);
//       hemGeo.rotateX(Math.PI / 2);
//       hemGeo.translate(0, -1.28, 0);
//       const hemMesh = new THREE.Mesh(hemGeo, backMaterial);
//       hemMesh.castShadow = true;
//       garmentGroup.add(hemMesh);

//       // --- WOVEN ARCHIVE CLIP TAG ON HEM ---
//       const hemTagGeo = new THREE.PlaneGeometry(0.18, 0.15);
//       const hemTagMesh = new THREE.Mesh(hemTagGeo, hemTagMaterial);
//       hemTagMesh.position.set(1.06, -1.14, 0.24);
//       hemTagMesh.rotation.set(0, 0.32, 0);
//       garmentGroup.add(hemTagMesh);

//       // --- SHORT SLEEVES (Left & Right with dropped shoulder drape) ---
//       const sleeveRadiusTop = 0.48;
//       const sleeveRadiusBottom = 0.42;
//       const sleeveLength = 1.05;

//       // Left Sleeve
//       const leftSleeveGeo = new THREE.CylinderGeometry(sleeveRadiusTop, sleeveRadiusBottom, sleeveLength, 32, 16, false);
//       const lPos = leftSleeveGeo.attributes.position;
//       for (let i = 0; i < lPos.count; i++) {
//         let x = lPos.getX(i);
//         let y = lPos.getY(i);
//         let z = lPos.getZ(i);
//         z *= 0.72;
//         const fold = Math.sin((y / sleeveLength) * 8.0) * 0.015;
//         z += fold;
//         lPos.setXYZ(i, x, y, z);
//       }
//       leftSleeveGeo.computeVertexNormals();

//       const leftSleeve = new THREE.Mesh(leftSleeveGeo, backMaterial);
//       leftSleeve.position.set(-1.42, 0.65, 0.0);
//       leftSleeve.rotation.z = Math.PI / 3.4;
//       leftSleeve.rotation.y = -Math.PI / 24;
//       leftSleeve.castShadow = true;
//       leftSleeve.receiveShadow = true;
//       garmentGroup.add(leftSleeve);

//       // Left Sleeve Cuff Ring
//       const lCuffGeo = new THREE.TorusGeometry(sleeveRadiusBottom, 0.028, 12, 32);
//       lCuffGeo.scale(1.0, 1.0, 0.72);
//       const leftCuff = new THREE.Mesh(lCuffGeo, backMaterial);
//       leftCuff.position.set(-1.82, 0.42, 0.0);
//       leftCuff.rotation.z = Math.PI / 3.4;
//       garmentGroup.add(leftCuff);

//       // Right Sleeve
//       const rightSleeveGeo = new THREE.CylinderGeometry(sleeveRadiusTop, sleeveRadiusBottom, sleeveLength, 32, 16, false);
//       const rPos = rightSleeveGeo.attributes.position;
//       for (let i = 0; i < rPos.count; i++) {
//         let x = rPos.getX(i);
//         let y = rPos.getY(i);
//         let z = rPos.getZ(i);
//         z *= 0.72;
//         const fold = Math.sin((y / sleeveLength) * 8.0) * 0.015;
//         z += fold;
//         rPos.setXYZ(i, x, y, z);
//       }
//       rightSleeveGeo.computeVertexNormals();

//       const rightSleeve = new THREE.Mesh(rightSleeveGeo, backMaterial);
//       rightSleeve.position.set(1.42, 0.65, 0.0);
//       rightSleeve.rotation.z = -Math.PI / 3.4;
//       rightSleeve.rotation.y = Math.PI / 24;
//       rightSleeve.castShadow = true;
//       rightSleeve.receiveShadow = true;
//       garmentGroup.add(rightSleeve);

//       // Right Sleeve Cuff Ring
//       const rCuffGeo = new THREE.TorusGeometry(sleeveRadiusBottom, 0.028, 12, 32);
//       rCuffGeo.scale(1.0, 1.0, 0.72);
//       const rightCuff = new THREE.Mesh(rCuffGeo, backMaterial);
//       rightCuff.position.set(1.82, 0.42, 0.0);
//       rightCuff.rotation.z = -Math.PI / 3.4;
//       garmentGroup.add(rightCuff);

//       // --- SMOOTH SHOULDER CAPS ---
//       const shoulderCapGeoL = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI);
//       shoulderCapGeoL.scale(1.0, 0.38, 0.6);
//       const shoulderCapL = new THREE.Mesh(shoulderCapGeoL, backMaterial);
//       shoulderCapL.position.set(-1.05, 0.98, 0.0);
//       shoulderCapL.rotation.z = Math.PI / 10;
//       garmentGroup.add(shoulderCapL);

//       const shoulderCapGeoR = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI);
//       shoulderCapGeoR.scale(1.0, 0.38, 0.6);
//       const shoulderCapR = new THREE.Mesh(shoulderCapGeoR, backMaterial);
//       shoulderCapR.position.set(1.05, 0.98, 0.0);
//       shoulderCapR.rotation.z = -Math.PI / 10;
//       garmentGroup.add(shoulderCapR);

//       return garmentGroup;
//     },
//     []
//   );

//   // Initialize Three.js Scene
//   useEffect(() => {
//     if (!containerRef.current) return;
//     const container = containerRef.current;
//     const width = container.clientWidth || 600;
//     const height = container.clientHeight || 600;

//     // 1. Scene
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     // 2. Perspective Camera
//     const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
//     camera.position.set(0, 0.1, 5.2);
//     cameraRef.current = camera;

//     // 3. WebGL Renderer
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       powerPreference: 'high-performance'
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.3;
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//     container.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // 4. Studio Multi-Point Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
//     scene.add(ambientLight);

//     // Key Light (Warm frontal studio key light)
//     const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.6);
//     keyLight.position.set(3.5, 4.5, 4.5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.bias = -0.0002;
//     scene.add(keyLight);

//     // Cross Fill Light (Soft cool contrast on folds)
//     const fillLight = new THREE.DirectionalLight(0xf0f4f8, 1.8);
//     fillLight.position.set(-4.0, 2.0, 3.5);
//     scene.add(fillLight);

//     // Back / Rim Light for 360 inspection
//     const rimLight = new THREE.DirectionalLight(0xffffff, 2.4);
//     rimLight.position.set(0, 4.0, -4.5);
//     scene.add(rimLight);

//     // Under Bounce Light
//     const bounceLight = new THREE.DirectionalLight(0xe4e4e7, 0.9);
//     bounceLight.position.set(0, -3.5, 2.0);
//     scene.add(bounceLight);

//     // 5. Materials & Maps
//     const fabricBumpMap = createFabricTexture();
//     const collarBumpMap = createCollarRibTexture();
//     const decalMap = createDecalTexture(design, colorHex);
//     const innerLabelMap = createInnerLabelTexture();
//     const hemTagMap = createHemTagTexture();

//     // Front Chest Panel Material (with silkscreen artwork)
//     const frontMaterial = new THREE.MeshStandardMaterial({
//       color: new THREE.Color(0xffffff), // Clean white tint so decal canvas color is 100% true
//       roughness: 0.88,
//       metalness: 0.01,
//       bumpMap: fabricBumpMap,
//       bumpScale: 0.02,
//       map: decalMap,
//       side: THREE.FrontSide
//     });

//     // Plain Fabric Material (for back panel, sleeves, collar base)
//     const plainMaterial = new THREE.MeshStandardMaterial({
//       color: new THREE.Color(colorHex),
//       roughness: 0.88,
//       metalness: 0.01,
//       bumpMap: fabricBumpMap,
//       bumpScale: 0.02,
//       side: THREE.DoubleSide
//     });

//     // Collar Material (Ribbed Cotton)
//     const collarMaterial = new THREE.MeshStandardMaterial({
//       color: new THREE.Color(colorHex),
//       roughness: 0.92,
//       metalness: 0.01,
//       bumpMap: collarBumpMap,
//       bumpScale: 0.045
//     });

//     const labelMaterial = new THREE.MeshBasicMaterial({
//       map: innerLabelMap,
//       side: THREE.DoubleSide
//     });

//     const hemTagMaterial = new THREE.MeshBasicMaterial({
//       map: hemTagMap,
//       side: THREE.DoubleSide
//     });

//     materialsRef.current = [frontMaterial, plainMaterial];
//     collarMaterialRef.current = collarMaterial;
//     labelMaterialRef.current = labelMaterial;
//     hemTagMaterialRef.current = hemTagMaterial;

//     // 6. Build the Sculpted Realistic T-Shirt
//     const garmentGroup = buildRealisticTShirtMesh(frontMaterial, plainMaterial, collarMaterial, labelMaterial, hemTagMaterial);
//     garmentGroupRef.current = garmentGroup;
//     scene.add(garmentGroup);

//     // 7. Soft Ground Ambient Shadow
//     const shadowGeo = new THREE.PlaneGeometry(4.4, 4.4);
//     const shadowCanvas = document.createElement('canvas');
//     shadowCanvas.width = 512;
//     shadowCanvas.height = 512;
//     const sCtx = shadowCanvas.getContext('2d')!;
//     const grad = sCtx.createRadialGradient(256, 256, 20, 256, 256, 230);
//     grad.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
//     grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.16)');
//     grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.03)');
//     grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
//     sCtx.fillStyle = grad;
//     sCtx.fillRect(0, 0, 512, 512);

//     const shadowTex = new THREE.CanvasTexture(shadowCanvas);
//     const shadowMat = new THREE.MeshBasicMaterial({
//       map: shadowTex,
//       transparent: true,
//       opacity: 0.85,
//       depthWrite: false
//     });
//     const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
//     shadowPlane.rotation.x = -Math.PI / 2;
//     shadowPlane.position.y = -1.65;
//     scene.add(shadowPlane);

//     // Resize Observer
//     const handleResize = () => {
//       if (!container || !rendererRef.current || !cameraRef.current) return;
//       const w = container.clientWidth;
//       const h = container.clientHeight;
//       cameraRef.current.aspect = w / h;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(w, h);
//     };

//     const resizeObserver = new ResizeObserver(handleResize);
//     resizeObserver.observe(container);

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 300);

//     // 8. Render & 360 Physics Loop
//     const clock = new THREE.Clock();

//     const animate = () => {
//       animFrameId.current = requestAnimationFrame(animate);
//       const elapsedTime = clock.getElapsedTime();

//       // Apply inertia / velocity decay when not dragging
//       if (!isDragging.current) {
//         if (isAutoSpinning) {
//           targetRotation.current.y += 0.006;
//         } else if (Math.abs(velocityY.current) > 0.0001) {
//           targetRotation.current.y += velocityY.current;
//           velocityY.current *= 0.92; // Friction deceleration
//         }
//       }

//       // Smooth rotation lerp
//       currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.085;
//       currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.085;

//       // Update rotation degrees indicator
//       const normalizedRad = ((currentRotation.current.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
//       const deg = Math.round((normalizedRad / (Math.PI * 2)) * 360);
//       setRotationDegrees(deg);

//       if (garmentGroupRef.current) {
//         garmentGroupRef.current.rotation.y = currentRotation.current.y + mouseParallax.current.x * 0.18;
//         garmentGroupRef.current.rotation.x = currentRotation.current.x + mouseParallax.current.y * 0.12;

//         // Subtle organic breathing float
//         const floatOffset = Math.sin(elapsedTime * 1.6) * 0.035;
//         garmentGroupRef.current.position.y = floatOffset;
//         shadowPlane.scale.set(1 + floatOffset * 0.35, 1 + floatOffset * 0.35, 1);
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
//       resizeObserver.disconnect();
//       if (renderer.domElement && container.contains(renderer.domElement)) {
//         container.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//       scene.clear();
//     };
//   }, [
//     buildRealisticTShirtMesh,
//     createCollarRibTexture,
//     createDecalTexture,
//     createFabricTexture,
//     createHemTagTexture,
//     createInnerLabelTexture,
//     isAutoSpinning
//   ]);

//   // Update Color & Decal on prop change
//   useEffect(() => {
//     if (!materialsRef.current.length || !collarMaterialRef.current) return;

//     const targetCol = new THREE.Color(colorHex);
//     // Plain back material
//     materialsRef.current[1].color.copy(targetCol);
//     materialsRef.current[1].wireframe = wireframeMode;
//     materialsRef.current[1].needsUpdate = true;

//     // Collar material
//     collarMaterialRef.current.color.copy(targetCol);
//     collarMaterialRef.current.wireframe = wireframeMode;
//     collarMaterialRef.current.needsUpdate = true;

//     // Front decal material
//     materialsRef.current[0].wireframe = wireframeMode;
//     const newDecal = createDecalTexture(design, colorHex);
//     materialsRef.current[0].map = newDecal;
//     materialsRef.current[0].needsUpdate = true;
//   }, [colorHex, design, wireframeMode, createDecalTexture]);

//   // Preset Angle Buttons
//   const handleAngleChange = (angle: 'front' | 'angle' | 'side' | 'back' | 'detail') => {
//     setViewAngle(angle);
//     setIsAutoSpinning(false);
//     velocityY.current = 0;
//     if (!cameraRef.current) return;

//     if (angle === 'front') {
//       targetRotation.current = { x: 0.04, y: 0 };
//       cameraRef.current.position.set(0, 0.1, 5.2);
//     } else if (angle === 'angle') {
//       targetRotation.current = { x: 0.08, y: Math.PI / 4 };
//       cameraRef.current.position.set(0, 0.1, 5.2);
//     } else if (angle === 'side') {
//       targetRotation.current = { x: 0.04, y: Math.PI / 2 };
//       cameraRef.current.position.set(0, 0.1, 5.2);
//     } else if (angle === 'back') {
//       targetRotation.current = { x: 0.04, y: Math.PI };
//       cameraRef.current.position.set(0, 0.1, 5.2);
//     } else if (angle === 'detail') {
//       targetRotation.current = { x: 0.06, y: 0.02 };
//       cameraRef.current.position.set(0, 0.35, 2.9);
//     }
//     cameraRef.current.updateProjectionMatrix();
//   };

//   // Zoom Handling
//   const handleZoom = (direction: 'in' | 'out' | 'reset') => {
//     if (!cameraRef.current) return;
//     let newZoom = zoomLevel;
//     if (direction === 'in') newZoom = Math.min(zoomLevel + 0.25, 1.85);
//     if (direction === 'out') newZoom = Math.max(zoomLevel - 0.25, 0.75);
//     if (direction === 'reset') newZoom = 1;

//     setZoomLevel(newZoom);
//     cameraRef.current.position.z = 5.2 / newZoom;
//     cameraRef.current.updateProjectionMatrix();
//   };

//   // Mouse & Touch 360° Drag Handlers
//   const handlePointerDown = (clientX: number, clientY: number) => {
//     if (!interactive) return;
//     isDragging.current = true;
//     setIsAutoSpinning(false);
//     velocityY.current = 0;
//     previousPointer.current = { x: clientX, y: clientY };
//   };

//   const handlePointerMove = (clientX: number, clientY: number) => {
//     if (!interactive || !containerRef.current) return;

//     const rect = containerRef.current.getBoundingClientRect();
//     const normX = ((clientX - rect.left) / rect.width - 0.5) * 2;
//     const normY = ((clientY - rect.top) / rect.height - 0.5) * 2;
//     mouseParallax.current = { x: normX * 0.15, y: normY * 0.1 };

//     if (!isDragging.current) return;

//     const deltaX = clientX - previousPointer.current.x;
//     const deltaY = clientY - previousPointer.current.y;

//     const rotSpeed = 0.009;
//     targetRotation.current.y += deltaX * rotSpeed;
//     targetRotation.current.x = Math.max(-0.35, Math.min(0.35, targetRotation.current.x + deltaY * rotSpeed));
//     velocityY.current = deltaX * rotSpeed * 0.4; // Store release momentum

//     previousPointer.current = { x: clientX, y: clientY };
//   };

//   const handlePointerUp = () => {
//     isDragging.current = false;
//   };

//   return (
//     <div
//       className={`relative w-full ${heightClass} flex items-center justify-center select-none overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm ${className}`}
//       onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
//       onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
//       onMouseUp={handlePointerUp}
//       onMouseLeave={handlePointerUp}
//       onTouchStart={(e) => e.touches.length > 0 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
//       onTouchMove={(e) => e.touches.length > 0 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
//       onTouchEnd={handlePointerUp}
//       style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
//       role="region"
//       aria-label="Interactive 360° 3D Real-Time T-Shirt Visualizer"
//     >
//       {/* Three.js Canvas */}
//       <div ref={containerRef} className="w-full h-full absolute inset-0 z-10" />

//       {/* Subtle Studio Radial Background */}
//       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.025)_0%,transparent_70%)] z-0" />

//       {/* Loading State */}
//       {isLoading && (
//         <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white transition-opacity duration-500">
//           <div className="relative w-14 h-14 flex items-center justify-center mb-4">
//             <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
//             <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin" />
//             <span className="font-display text-xs tracking-widest font-black text-black">GM</span>
//           </div>
//           <p className="font-mono text-[11px] tracking-[0.25em] text-zinc-600 font-bold uppercase">
//             LOADING 360° GARMENT…
//           </p>
//         </div>
//       )}

//       {/* Top Left: 360° Real-time Status Badge */}
//       <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
//         <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center gap-2 shadow-xs">
//           <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
//           <span className="font-mono text-[10px] tracking-wider uppercase text-black font-bold">
//             360° INTERACTIVE GARMENT
//           </span>
//           <span className="text-zinc-300">|</span>
//           <span className="font-mono text-[10px] uppercase text-zinc-600 font-medium">
//             280 GSM COMBED COTTON
//           </span>
//         </div>

//         {/* Current Angle Degree Indicator */}
//         <div className="px-2.5 py-1.5 rounded-full bg-zinc-900 text-white flex items-center gap-1.5 shadow-xs">
//           <Compass className="w-3 h-3 text-red-500" />
//           <span className="font-mono text-[10px] font-bold tracking-wider">
//             {rotationDegrees}° {rotationDegrees < 45 || rotationDegrees > 315 ? '[FRONT]' : rotationDegrees >= 135 && rotationDegrees <= 225 ? '[BACK]' : '[SIDE]'}
//           </span>
//         </div>
//       </div>

//       {/* Top Right: 360° Auto-Rotate Toggle */}
//       <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
//         <button
//           onClick={() => setIsAutoSpinning(!isAutoSpinning)}
//           className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer backdrop-blur-md border ${
//             isAutoSpinning
//               ? 'bg-black text-white border-black'
//               : 'bg-white/90 text-zinc-700 border-zinc-200 hover:text-black hover:bg-white'
//           }`}
//           title={isAutoSpinning ? 'Pause 360° Auto-Spin' : 'Start 360° Auto-Spin'}
//         >
//           {isAutoSpinning ? <Pause className="w-3 h-3 text-red-500" /> : <Play className="w-3 h-3 text-blue-600" />}
//           <span>{isAutoSpinning ? '360° SPIN ON' : 'AUTO SPIN'}</span>
//         </button>
//       </div>

//       {/* Floating 360 Drag Hint */}
//       <div className="absolute top-16 left-1/2 -translate-x-1/2 z-15 pointer-events-none opacity-80 transition-opacity">
//         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200 shadow-xs">
//           <Sparkles className="w-3 h-3 text-blue-600" />
//           <span className="font-mono text-[9px] tracking-wider text-zinc-700 uppercase font-bold">
//             DRAG TO ROTATE 360° FREE
//           </span>
//         </div>
//       </div>

//       {/* Interactive Controls Overlay at Bottom */}
//       {showControls && (
//         <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between pointer-events-auto gap-2">
//           {/* Preset Camera View Angles */}
//           <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-sm">
//             <button
//               onClick={() => handleAngleChange('front')}
//               className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
//                 viewAngle === 'front' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
//               }`}
//               title="Front View (0°)"
//             >
//               FRONT
//             </button>
//             <button
//               onClick={() => handleAngleChange('angle')}
//               className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
//                 viewAngle === 'angle' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
//               }`}
//               title="45° Hero View"
//             >
//               45° HERO
//             </button>
//             <button
//               onClick={() => handleAngleChange('side')}
//               className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
//                 viewAngle === 'side' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
//               }`}
//               title="Side Profile (90°)"
//             >
//               SIDE
//             </button>
//             <button
//               onClick={() => handleAngleChange('back')}
//               className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
//                 viewAngle === 'back' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
//               }`}
//               title="Back View (180°)"
//             >
//               BACK
//             </button>
//             <button
//               onClick={() => handleAngleChange('detail')}
//               className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
//                 viewAngle === 'detail' ? 'bg-black text-white shadow-xs' : 'text-zinc-600 hover:text-black'
//               }`}
//               title="Inspect Graphic Silkscreen & Collar"
//             >
//               <Eye className="w-3 h-3" /> <span className="hidden sm:inline">PRINT</span> DETAIL
//             </button>
//           </div>

//           {/* Quick Utility Tools (Zoom, Wireframe, Reset) */}
//           <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-sm">
//             <button
//               onClick={() => handleZoom('in')}
//               className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
//               title="Zoom In"
//               aria-label="Zoom In"
//             >
//               <ZoomIn className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => handleZoom('out')}
//               className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
//               title="Zoom Out"
//               aria-label="Zoom Out"
//             >
//               <ZoomOut className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setWireframeMode(!wireframeMode)}
//               className={`p-2 rounded-xl transition-colors cursor-pointer ${
//                 wireframeMode ? 'text-black bg-zinc-200 font-bold' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
//               }`}
//               title="Toggle Wireframe Anatomy"
//               aria-label="Toggle Wireframe"
//             >
//               <Layers className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 handleAngleChange('front');
//                 handleZoom('reset');
//               }}
//               className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
//               title="Reset View (0°)"
//               aria-label="Reset View"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

'use client';
import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
 
interface TShirtPhotoProps {
  /** Path to the product photo (put kiikii-tshirt.png next to your other public assets) */
  src?: string;
  alt?: string;
  heightClass?: string;
  showControls?: boolean;
  className?: string;
}
 
/**
 * TShirtPhoto
 * -------------------------------------------------------------------------
 * Drop-in replacement for <TShirt3D />. All the Three.js scene building,
 * mesh sculpting, texture generation, and 360° drag logic has been removed.
 * Instead this renders the real product photo, with a light zoom/pan
 * interaction so it still feels alive on the product page.
 * -------------------------------------------------------------------------
 */
export const TShirtPhoto: React.FC<TShirtPhotoProps> = ({
  src = '/kiikii-tshirt.png',
  alt = 'KIIKII Original Lucky Cat T-Shirt',
  heightClass = 'h-[460px] sm:h-[540px] lg:h-[620px]',
  showControls = true,
  className = ''
}) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
 
  const clampZoom = (z: number) => Math.min(2.2, Math.max(1, z));
 
  const handleZoom = (dir: 'in' | 'out' | 'reset') => {
    if (dir === 'reset') {
      setZoom(1);
      setPos({ x: 0, y: 0 });
      return;
    }
    setZoom((z) => {
      const next = clampZoom(z + (dir === 'in' ? 0.25 : -0.25));
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  };
 
  const onPointerDown = (x: number, y: number) => {
    if (zoom === 1) return;
    isDragging.current = true;
    lastPointer.current = { x, y };
  };
 
  const onPointerMove = (x: number, y: number) => {
    if (!isDragging.current) return;
    const dx = x - lastPointer.current.x;
    const dy = y - lastPointer.current.y;
    lastPointer.current = { x, y };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
 
  const onPointerUp = () => {
    isDragging.current = false;
  };
 
  return (
    <div
      className={`relative w-full ${heightClass} flex items-center justify-center overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm select-none ${className}`}
      onMouseDown={(e) => onPointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={(e) => e.touches.length > 0 && onPointerDown(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => e.touches.length > 0 && onPointerMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={onPointerUp}
      style={{ cursor: zoom > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default' }}
      role="region"
      aria-label="KIIKII product photo"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="max-w-full max-h-full object-contain transition-transform duration-150 ease-out"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})` }}
      />
 
      {/* Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center gap-2 shadow-xs">
          <span className="font-mono text-[10px] tracking-wider uppercase text-black font-bold">
            KIIKII ORIGINAL
          </span>
          <span className="text-zinc-300">|</span>
          <span className="font-mono text-[10px] uppercase text-zinc-600 font-medium">
            280 GSM COMBED COTTON
          </span>
        </div>
      </div>
 
      {/* Zoom controls */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-sm">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Reset View"
            aria-label="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};