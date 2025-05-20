#!/usr/bin/env node
// import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Directory paths
const ICON_DIR = path.resolve(__dirname, 'src/icon');
const OUTPUT_DIR = path.resolve(__dirname, 'png-icons');
const SVG_OUTPUT_DIR = path.resolve(__dirname, 'svg-icons');
const DATA_URI_OUTPUT_FILE = path.resolve(
  __dirname,
  '../react-native-ui-lite/src/icon/iconDataUris.tsx'
);

// Create output directories if they don't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

if (!fs.existsSync(SVG_OUTPUT_DIR)) {
  fs.mkdirSync(SVG_OUTPUT_DIR, { recursive: true });
  console.log(`Created SVG output directory: ${SVG_OUTPUT_DIR}`);
}

// Create the generated directory for data URIs if it doesn't exist
if (!fs.existsSync(path.dirname(DATA_URI_OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(DATA_URI_OUTPUT_FILE), { recursive: true });
  console.log(`Created directory for data URIs: ${path.dirname(DATA_URI_OUTPUT_FILE)}`);
}

// Size for PNG output
const SIZE = 48; // Use a smaller optimized size that works well for all icons

// Install required dependencies if not present
// function ensureDependencies() {
//   try {
//     console.log('Installing required dependencies...');
//     execSync('npm list sharp || npm install --no-save sharp', { stdio: 'inherit' });
//     console.log('Dependencies installed successfully');
//     return true;
//   } catch (error) {
//     console.error('Failed to install dependencies:', error);
//     return false;
//   }
// }

// Helper function to extract viewBox from SVG component
function extractViewBox(componentCode: string): string {
  const viewBoxMatch = componentCode.match(/viewBox="([^"]+)"/);
  return viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
}

// Helper function to extract dimensions from viewBox
function getDimensionsFromViewBox(viewBox: string): { width: number; height: number } {
  const parts = viewBox.split(' ');
  if (parts.length === 4) {
    return {
      width: parseInt(parts[2]),
      height: parseInt(parts[3]),
    };
  }
  return { width: 24, height: 24 };
}

// Helper function to extract width and height from SVG component
function extractDimensions(
  componentCode: string,
  iconName: string
): { width: number; height: number } {
  // For logo icons, prioritize viewBox dimensions to maintain aspect ratio
  if (iconName === 'Logo' || iconName === 'DarkLogo') {
    const viewBox = extractViewBox(componentCode);
    return getDimensionsFromViewBox(viewBox);
  }

  // First try to match numeric literals: width={14}
  let widthMatch = componentCode.match(/width\s*=\s*{\s*(\d+)\s*}/);
  let heightMatch = componentCode.match(/height\s*=\s*{\s*(\d+)\s*}/);

  // If not found, try to match string literals: width="14"
  if (!widthMatch) widthMatch = componentCode.match(/width\s*=\s*"(\d+)"/);
  if (!heightMatch) heightMatch = componentCode.match(/height\s*=\s*"(\d+)"/);

  // Default values for width and height
  const width = widthMatch ? parseInt(widthMatch[1]) : 24;
  const height = heightMatch ? parseInt(heightMatch[1]) : 24;

  return { width, height };
}

// Helper function to convert TypeScript SVG component to SVG file
async function convertComponentToSvg(iconPath: string, iconName: string): Promise<string> {
  try {
    const componentCode = fs.readFileSync(iconPath, 'utf8');

    // Extract SVG content
    const svgMatch = componentCode.match(/<Svg[^>]*>([\s\S]*?)<\/Svg>/);
    if (!svgMatch) {
      throw new Error(`Could not extract SVG content from ${iconPath}`);
    }

    // Extract viewBox and dimensions
    let viewBox = extractViewBox(componentCode);
    const { width, height } = extractDimensions(componentCode, iconName);

    // For CollapseIcon, adjust the viewBox to match its dimensions for proper positioning
    if (iconName === 'CollapseIcon') {
      viewBox = `0 0 ${width} ${height}`;
    }

    // Extract all Path elements
    let paths = '';
    const pathRegex = /<Path[\s\S]*?\/>|<Path[\s\S]*?<\/Path>/g;
    let match;
    while ((match = pathRegex.exec(componentCode)) !== null) {
      // First convert Path to path (standard SVG case)
      let pathStr = match[0].replace(/<Path/g, '<path').replace(/<\/Path>/g, '</path>');

      // Handle fill attributes carefully
      // First try to identify if there's already a fill attribute
      const hasFill = /fill="[^"]*"/i.test(pathStr) || /fill=/i.test(pathStr);

      // Replace React Native SVG specific props with standard SVG attributes
      pathStr = pathStr
        .replace(/fill=\{theme\.color\.[^}]*\}/g, 'fill="black"') // Theme-based fill
        .replace(/fill={[^}]*}/g, 'fill="black"') // JSX expression fill
        .replace(/color={[^}]*}/g, 'fill="black"') // color as fill
        .replace(/fillRule="evenodd"/g, 'fill-rule="evenodd"')
        .replace(/clipRule="evenodd"/g, 'clip-rule="evenodd"');

      // Only add fill if there's no fill attribute after all the replacements
      if (!hasFill && !/fill="[^"]*"/i.test(pathStr)) {
        // If it's a self-closing tag
        if (pathStr.includes('/>')) {
          pathStr = pathStr.replace(/\/>/g, ' fill="black"/>');
        }
        // If it's an opening tag
        else if (pathStr.includes('<path')) {
          pathStr = pathStr.replace(/<path/g, '<path fill="black"');
        }
      }

      paths += pathStr;
    }

    // Create a valid SVG string
    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none">
  ${paths}
</svg>`;

    // Save SVG file
    const svgPath = path.join(SVG_OUTPUT_DIR, `${iconName}.svg`);
    fs.writeFileSync(svgPath, svgContent);

    console.log(`Created SVG file for ${iconName}`);
    return svgPath;
  } catch (error) {
    console.error(`Error creating SVG for ${iconName}:`, error);
    throw error;
  }
}

// Define special cases for icon sizes to maintain proper aspect ratios
interface IconSizeMap {
  [key: string]: {
    width: number;
    height: number;
    scale: number;
  };
}

// Special cases for icons with non-standard dimensions
const iconSizeMap: IconSizeMap = {
  // Using the original dimensions with appropriate scale factor
  Logo: { width: 300, height: 60, scale: 2 }, // Increased size for Logo
  DarkLogo: { width: 200, height: 40, scale: 1 }, // DarkLogo works fine as is
  CollapseIcon: { width: 8, height: 8, scale: 8 }, // Increased scaling for tiny icon for better visibility
};

// Default scale factor for all icons (2x)
const DEFAULT_SCALE = 2;

// Function to determine the correct size for an icon
function getIconSize(iconName: string, size: number): { width: number; height: number } {
  // If this is a special case icon with custom dimensions
  if (iconName in iconSizeMap) {
    const specialCase = iconSizeMap[iconName];
    const aspectRatio = specialCase.width / specialCase.height;

    // For special cases, maintain the aspect ratio
    if (aspectRatio > 1) {
      // Wider than tall
      return {
        width: size,
        height: Math.round(size / aspectRatio),
      };
    } else {
      // Taller than wide or square
      return {
        width: Math.round(size * aspectRatio),
        height: size,
      };
    }
  } else {
    // Standard square icon
    return {
      width: size,
      height: size,
    };
  }
}

// Function to generate SVGs for all icon components
async function generateSVGs(): Promise<Map<string, string>> {
  const svgPaths = new Map<string, string>();

  // Get all .tsx files in the icon directory
  const files = fs.readdirSync(ICON_DIR).filter((file) => file.endsWith('.tsx'));
  console.log(`Found ${files.length} icon files`);

  for (const file of files) {
    const iconPath = path.join(ICON_DIR, file);
    const iconName = path.basename(file, '.tsx');

    try {
      // Convert component to SVG
      const svgPath = await convertComponentToSvg(iconPath, iconName);
      svgPaths.set(iconName, svgPath);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  return svgPaths;
}

// Interface for data URIs collection
interface IconDataURIs {
  [iconName: string]: string; // Base64 PNG data
}

// Interface for default icon sizes
interface IconDefaultSizes {
  [iconName: string]: { width: number; height: number };
}

// Interface for theme usage in components
interface ThemeUsage {
  [iconName: string]: boolean;
}

// Function to check if component uses theme
function checkThemeUsage(): ThemeUsage {
  const themeUsage: ThemeUsage = {};

  // Get all .tsx files in the icon directory
  const files = fs.readdirSync(ICON_DIR).filter((file) => file.endsWith('.tsx'));

  for (const file of files) {
    const iconPath = path.join(ICON_DIR, file);
    const iconName = path.basename(file, '.tsx');
    const componentCode = fs.readFileSync(iconPath, 'utf8');

    // Check if the component uses theming
    const usesTheme =
      componentCode.includes('useTheme') ||
      componentCode.includes('theme.color') ||
      componentCode.includes('theme.') ||
      componentCode.includes('@storybook/react-native-theming');

    themeUsage[iconName] = usesTheme;
  }

  return themeUsage;
}

// Function to extract default sizes from icon components
function extractDefaultSizes(): IconDefaultSizes {
  const defaultSizes: IconDefaultSizes = {};

  // Get all .tsx files in the icon directory
  const files = fs.readdirSync(ICON_DIR).filter((file) => file.endsWith('.tsx'));

  for (const file of files) {
    const iconPath = path.join(ICON_DIR, file);
    const iconName = path.basename(file, '.tsx');
    const componentCode = fs.readFileSync(iconPath, 'utf8');

    // Extract default width and height from component props
    let width = 24;
    let height = 24;

    // Try to match width = X pattern
    const widthMatch = componentCode.match(/width\s*=\s*{?\s*(\d+)\s*}?/i);
    if (widthMatch) width = parseInt(widthMatch[1]);

    // Try to match height = X pattern
    const heightMatch = componentCode.match(/height\s*=\s*{?\s*(\d+)\s*}?/i);
    if (heightMatch) height = parseInt(heightMatch[1]);

    defaultSizes[iconName] = { width, height };
  }

  return defaultSizes;
}
async function convertWithSharp() {
  try {
    // Generate SVGs from component files
    const svgPaths = await generateSVGs();

    // Dynamically import sharp (after ensuring it's installed)
    const sharp = require('sharp');

    // Object to store all data URIs
    const dataURIs: IconDataURIs = {};

    // Process each SVG
    for (const [iconName, originalSvgPath] of svgPaths.entries()) {
      // Create a mutable copy of the path in case we need to use a fixed version
      let svgPath = originalSvgPath;
      console.log(`Converting ${iconName} to PNGs...`);

      // Read the SVG file
      let svgBuffer = fs.readFileSync(svgPath);

      // Create PNG at the optimal size
      // Determine the correct dimensions based on the icon
      // Use a larger size for Logo and DarkLogo
      const iconSize = iconName === 'Logo' || iconName === 'DarkLogo' ? 200 : SIZE;
      const { width, height } = getIconSize(iconName, iconSize);
      const outputPath = path.join(OUTPUT_DIR, `${iconName}.png`);

      // For Logo, use the fixed SVG file
      if (iconName === 'Logo') {
        const fixedSvgPath = path.join(SVG_OUTPUT_DIR, 'Logo-fixed.svg');
        if (fs.existsSync(fixedSvgPath)) {
          console.log(`Using fixed SVG for ${iconName}`);
          svgPath = fixedSvgPath;
          svgBuffer = fs.readFileSync(fixedSvgPath);
        }
      }

      try {
        // Apply appropriate scaling to icons while preserving their aspect ratio

        // Get the actual scale factor to use (default or special case)
        const actualScaleFactor =
          iconName in iconSizeMap ? iconSizeMap[iconName].scale : DEFAULT_SCALE;

        // Calculate the final dimensions
        let finalWidth, finalHeight;

        // For logos, use their actual width/height from the SVG viewBox without additional scaling
        if (iconName === 'Logo' || iconName === 'DarkLogo') {
          // Preserve the original aspect ratio from the viewBox
          const aspectRatio = width / height;
          // Use a reasonable width that fits well in the UI
          finalWidth = 300;
          finalHeight = Math.round(finalWidth / aspectRatio);
        } else {
          // For other icons, apply the scaling factor
          finalWidth = Math.round(width * actualScaleFactor);
          finalHeight = Math.round(height * actualScaleFactor);
        }

        let pngBuffer: Buffer;

        // Create the PNG for data URI
        if (iconName === 'Logo' || iconName === 'DarkLogo') {
          // Two-step approach for logos to get better quality:
          // 1. First render at 2x the target size
          // 2. Then downscale to the final size with high-quality settings
          const upscaledWidth = finalWidth * 2;
          const upscaledHeight = finalHeight * 2;

          // Step 1: Create higher resolution version first
          const upscaledBuffer = await sharp(svgBuffer)
            .resize(upscaledWidth, upscaledHeight, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png({
              compressionLevel: 0, // No compression for interim step
              quality: 100,
            })
            .toBuffer();

          // Step 2: Downscale with high-quality settings
          pngBuffer = await sharp(upscaledBuffer)
            .resize(finalWidth, finalHeight, {
              fit: 'inside',
              kernel: 'lanczos3', // Highest quality resampling
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png({
              compressionLevel: 4, // Balance between quality and size
              adaptiveFiltering: true,
              palette: false, // Avoid color palette optimization
              quality: 100,
            })
            .toBuffer();

          // Save to file
          fs.writeFileSync(outputPath, pngBuffer);
        } else {
          // Scale up to appropriate quality (384px max dimension)
          finalWidth = Math.min(384, finalWidth);
          finalHeight = Math.min(384, finalHeight);

          pngBuffer = await sharp(svgBuffer)
            .resize(finalWidth, finalHeight, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
            })
            .png({ quality: 100 }) // Use maximum quality for PNG to avoid artifacts
            .toBuffer();

          // Save to file
          fs.writeFileSync(outputPath, pngBuffer);
        }

        // Create data URI
        const base64Data = pngBuffer.toString('base64');
        const dataURI = `data:image/png;base64,${base64Data}`;

        // Store in our data URIs object
        dataURIs[iconName] = dataURI;

        console.log(`Created ${outputPath} (${width}x${height})`);
      } catch (error) {
        console.error(`Error creating ${outputPath}:`, error);
      }
    }

    // Generate TypeScript file with data URIs
    await generateDataURIsFile(dataURIs);

    console.log('PNG generation complete!');
    console.log(`SVG files are available in: ${SVG_OUTPUT_DIR}`);
    console.log(`Data URIs are available in: ${DATA_URI_OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error processing icons:', error);
  }
}

// Function to generate TypeScript file with data URIs and React components
async function generateDataURIsFile(dataURIs: IconDataURIs): Promise<void> {
  try {
    // Get default sizes from original icon components
    const defaultSizes = extractDefaultSizes();

    // Get theme usage information
    const themeUsage = checkThemeUsage();

    // Create components for each icon
    const iconComponents = Object.keys(dataURIs)
      .map((iconName) => {
        const defaultSize = defaultSizes[iconName] || { width: 24, height: 24 };
        const usesTheme = themeUsage[iconName] || false;

        // Different component templates based on whether the original used theming
        if (usesTheme) {
          return `
export function ${iconName}({
  color,
  width = ${defaultSize.width},
  height = ${defaultSize.height},
  size,
}: {
  color?: string;
  width?: number;
  height?: number;
  size?: number;
}) {
  const theme = useTheme();

  // Use theme color if no specific color provided
  const fillColor = useMemo(() => {
    return color ?? theme.color.defaultText;
  }, [color, theme.color.defaultText]);

  return (
    <Image
      source={{ uri: getIconDataURI('${iconName}') }}
      style={{ width: size || width, height: size || height, tintColor: fillColor }}
    />
  );
}`;
        } else {
          return `
export function ${iconName}({
  color,
  width = ${defaultSize.width},
  height = ${defaultSize.height},
  size,
}: {
  color?: string;
  width?: number;
  height?: number;
  size?: number;
}) {
  return (
    <Image
      source={{ uri: getIconDataURI('${iconName}') }}
      style={{ width: size || width, height: size || height, tintColor: color }}
    />
  );
}`;
        }
      })
      .join('\n');

    // Create the TypeScript content with React components
    const tsContent = `/**
 * Auto-generated file with icon data URIs
 * Generated on: ${new Date().toISOString()}
 * Do not modify manually
 */
import { useMemo } from 'react';
import { Image } from 'react-native';
import { useTheme } from '@storybook/react-native-theming';

// Icon data URIs for React Native Image component
export interface IconDataURIs {
  [iconName: string]: string;  // Base64 PNG data
}

// Export all icon data URIs
export const iconDataURIs: IconDataURIs = ${JSON.stringify(dataURIs, null, 2)};

// Convenience function to get an icon by name
export function getIconDataURI(iconName: string): string {
  if (!iconDataURIs[iconName]) {
    console.warn("Icon '" + iconName + "' not found");
    return '';
  }
  
  return iconDataURIs[iconName];
}
${iconComponents}
`;

    // Write the TypeScript file
    fs.writeFileSync(DATA_URI_OUTPUT_FILE, tsContent);
    console.log(`Generated data URI TypeScript file at: ${DATA_URI_OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating data URI file:', error);
  }
}

// Run the conversion
convertWithSharp().catch(console.error);
