import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const moves = {
  'src/utils': 'src/lib/utils',
  'src/config': 'src/lib/config',
  'src/context': 'src/lib/context',
  'src/data': 'src/lib/data',
  'src/styles': 'src/lib/styles',
  'src/features/products/ProductCard': 'src/components/shared/ProductCard',
  'src/features/products/ProductCard.tsx': 'src/components/shared/ProductCard.tsx'
};

function walk(dir, callback) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file, callback);
    } else {
      callback(file);
    }
  });
}

const importRegex = /(from\s+['"])([^'"]+)(['"])|(import\s+['"])([^'"]+)(['"])/g;

function fixImports(file) {
  if (!/\.(ts|tsx|js|jsx|css)$/.test(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  content = content.replace(importRegex, (match, p1, p2, p3, p4, p5, p6) => {
    const isFrom = !!p1;
    const prefix = isFrom ? p1 : p4;
    const suffix = isFrom ? p3 : p6;
    const importPath = isFrom ? p2 : p5;

    // Check if relative
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      const absImportPath = path.resolve(dir, importPath);
      let relativeToRoot = path.relative(process.cwd(), absImportPath).replace(/\\/g, '/');
      
      // if it points to index.ts, it might not have the file name
      // Try to match against `moves`
      let newRelativeTarget = null;
      
      for (const [oldPath, newPath] of Object.entries(moves)) {
        if (relativeToRoot === oldPath || relativeToRoot.startsWith(oldPath + '/')) {
          newRelativeTarget = relativeToRoot.replace(oldPath, newPath);
          break;
        }
      }

      if (newRelativeTarget) {
        let newImportPath = path.relative(dir, path.resolve(process.cwd(), newRelativeTarget)).replace(/\\/g, '/');
        if (!newImportPath.startsWith('.')) {
          newImportPath = './' + newImportPath;
        }
        changed = true;
        return `${prefix}${newImportPath}${suffix}`;
      }
    }
    
    // Check if @/ alias is used
    if (importPath.startsWith('@/src/')) {
        let relativeToRoot = importPath.replace('@/', ''); // e.g. src/utils/...
        let newRelativeTarget = null;
        for (const [oldPath, newPath] of Object.entries(moves)) {
          if (relativeToRoot === oldPath || relativeToRoot.startsWith(oldPath + '/')) {
            newRelativeTarget = relativeToRoot.replace(oldPath, newPath);
            break;
          }
        }
        if (newRelativeTarget) {
            changed = true;
            return `${prefix}@/${newRelativeTarget}${suffix}`;
        }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
}

walk(srcDir, fixImports);
console.log("Import fix completed.");
