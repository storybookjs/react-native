import { mkdirSync, readdirSync, existsSync, rmSync } from 'fs';
import path from 'path';
import looksSame from 'looks-same';

export interface ComparisonOptions {
  screenshotsDir: string;
  baselineDir: string;
  diffsDir: string;
  tolerance?: number;
  strict?: boolean;
}

export interface ComparisonResult {
  total: number;
  matches: number;
  differences: number;
  missingBaselines: number;
  details: Array<{
    filename: string;
    status: 'match' | 'differ' | 'missing-baseline';
    diffPath?: string;
  }>;
}

export async function compareScreenshots(options: ComparisonOptions): Promise<ComparisonResult> {
  const { screenshotsDir, baselineDir, diffsDir, tolerance = 2.5, strict = false } = options;

  // Ensure diffs directory exists
  mkdirSync(diffsDir, { recursive: true });

  const result: ComparisonResult = {
    total: 0,
    matches: 0,
    differences: 0,
    missingBaselines: 0,
    details: [],
  };

  try {
    const screenshots = readdirSync(screenshotsDir).filter(
      (file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    );

    result.total = screenshots.length;

    for (const screenshot of screenshots) {
      const currentPath = path.join(screenshotsDir, screenshot);
      const baselinePath = path.join(baselineDir, screenshot);
      const diffPath = path.join(diffsDir, `diff_${screenshot}`);

      if (!existsSync(baselinePath)) {
        console.log(`⚠️  No baseline for: ${screenshot}`);
        result.missingBaselines++;
        result.details.push({
          filename: screenshot,
          status: 'missing-baseline',
        });
        continue;
      }

      try {
        const comparisonResult = await looksSame(baselinePath, currentPath, {
          strict,
          tolerance,
          createDiffImage: true,
        });

        if (!comparisonResult.equal) {
          await comparisonResult.diffImage?.save(diffPath);
          console.log(`❌ ${screenshot}: Differs`);
          result.differences++;
          result.details.push({
            filename: screenshot,
            status: 'differ',
            diffPath,
          });
        } else {
          console.log(`✅ ${screenshot}: Match`);
          result.matches++;
          result.details.push({
            filename: screenshot,
            status: 'match',
          });
        }
      } catch (error) {
        console.error(`Error comparing ${screenshot}:`, error);
        result.differences++;
        result.details.push({
          filename: screenshot,
          status: 'differ',
        });
      }
    }
  } catch (error) {
    console.error('Error reading screenshots:', error);
    throw error;
  }

  return result;
}

export async function updateBaseline(screenshotsDir: string, baselineDir: string): Promise<void> {
  console.log('Updating baseline screenshots...');

  mkdirSync(baselineDir, { recursive: true });

  const screenshots = readdirSync(screenshotsDir).filter(
    (file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  for (const screenshot of screenshots) {
    const sourcePath = path.join(screenshotsDir, screenshot);
    const destPath = path.join(baselineDir, screenshot);

    // Use native Node.js copy
    const { copyFileSync } = await import('fs');
    copyFileSync(sourcePath, destPath);
    console.log(`📋 Copied: ${screenshot}`);
  }

  console.log(`✅ Updated ${screenshots.length} baseline screenshots`);
}

export function clearDirectory(dirPath: string): void {
  if (existsSync(dirPath)) {
    console.log(`🧹 Clearing directory: ${dirPath}`);
    const files = readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      rmSync(filePath, { recursive: true, force: true });
    }
    console.log(`✅ Cleared ${files.length} files from ${dirPath}`);
  }
}

export async function generateHtmlReport(
  result: ComparisonResult,
  options: ComparisonOptions
): Promise<string> {
  const { screenshotsDir, baselineDir, diffsDir } = options;
  const reportPath = path.join(path.dirname(diffsDir), 'screenshot-comparison-report.html');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenshot Comparison Report</title>
    <style>
        :root {
            --color-primary: #FF4785;
            --color-secondary: #1EA7FD;
            --color-positive: #66BF3C;
            --color-negative: #FF4400;
            --color-warning: #E69D00;
            --color-dark: #333333;
            --color-darker: #1A1A1A;
            --color-medium: #999999;
            --color-mediumlight: #EEEEEE;
            --color-light: #F6F9FC;
            --color-lightest: #FFFFFF;
            --border-radius: 4px;
            --spacing-xs: 6px;
            --spacing-sm: 10px;
            --spacing-md: 15px;
            --spacing-lg: 20px;
            --typography-size-s1: 12px;
            --typography-size-s2: 14px;
            --typography-size-s3: 16px;
            --typography-size-m1: 20px;
            --typography-weight-regular: 400;
            --typography-weight-bold: 600;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: var(--color-light);
            color: var(--color-dark);
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .header {
            background: var(--color-lightest);
            padding: var(--spacing-md) var(--spacing-lg);
            border-bottom: 1px solid var(--color-mediumlight);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: var(--spacing-md);
            flex-shrink: 0;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .header h1 {
            margin: 0;
            font-size: var(--typography-size-m1);
            font-weight: var(--typography-weight-bold);
            color: var(--color-darker);
        }

        .header p {
            margin: 0;
            color: var(--color-medium);
            font-size: var(--typography-size-s2);
        }

        .controls {
            display: flex;
            gap: var(--spacing-md);
            align-items: center;
            flex-wrap: wrap;
        }

        .control-group {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .control-group label {
            font-weight: var(--typography-weight-bold);
            color: var(--color-dark);
            font-size: var(--typography-size-s2);
        }

        .filter-btn {
            padding: var(--spacing-xs) var(--spacing-sm);
            border: 1px solid var(--color-mediumlight);
            border-radius: var(--border-radius);
            background: var(--color-lightest);
            cursor: pointer;
            font-size: var(--typography-size-s1);
            font-weight: var(--typography-weight-bold);
            transition: all 0.15s ease;
            color: var(--color-dark);
        }

        .filter-btn:hover {
            background: rgba(30, 167, 253, 0.1);
        }

        .filter-btn.active {
            background: var(--color-secondary);
            color: var(--color-lightest);
            border-color: var(--color-secondary);
        }

        .navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--spacing-md);
        }

        .nav-info {
            font-weight: var(--typography-weight-bold);
            color: var(--color-dark);
            font-size: var(--typography-size-s2);
        }

        .nav-buttons {
            display: flex;
            gap: var(--spacing-xs);
        }

        .nav-btn {
            padding: var(--spacing-xs) var(--spacing-sm);
            border: 1px solid var(--color-mediumlight);
            border-radius: var(--border-radius);
            background: var(--color-lightest);
            cursor: pointer;
            font-size: var(--typography-size-s2);
            font-weight: var(--typography-weight-bold);
            transition: all 0.15s ease;
            color: var(--color-dark);
        }

        .nav-btn:hover:not(:disabled) {
            background: rgba(30, 167, 253, 0.1);
        }

        .nav-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .main-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .comparison-item {
            background: var(--color-lightest);
            border: 1px solid var(--color-mediumlight);
            border-radius: var(--border-radius);
            margin: var(--spacing-md);
            display: flex;
            flex-direction: column;
            height: calc(100vh - 120px);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .comparison-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-md) var(--spacing-lg);
            border-bottom: 1px solid var(--color-mediumlight);
            flex-shrink: 0;
            background: var(--color-light);
        }

        .filename {
            font-weight: var(--typography-weight-bold);
            font-size: var(--typography-size-s3);
            color: var(--color-darker);
            font-family: "Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace;
        }

        .status-badge {
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--border-radius);
            font-size: var(--typography-size-s1);
            font-weight: var(--typography-weight-bold);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-match {
            background: rgba(102, 191, 60, 0.1);
            color: var(--color-positive);
            border: 1px solid rgba(102, 191, 60, 0.2);
        }

        .status-differ {
            background: rgba(255, 68, 0, 0.1);
            color: var(--color-negative);
            border: 1px solid rgba(255, 68, 0, 0.2);
        }

        .status-missing {
            background: rgba(230, 157, 0, 0.1);
            color: var(--color-warning);
            border: 1px solid rgba(230, 157, 0, 0.2);
        }

        .images-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
            flex: 1;
            overflow: hidden;
            background: var(--color-mediumlight);
        }

        .images-container.with-diff {
            grid-template-columns: 1fr 1fr 1fr;
        }

        .image-section {
            background: var(--color-lightest);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .image-label {
            font-weight: var(--typography-weight-bold);
            padding: var(--spacing-sm) var(--spacing-md);
            color: var(--color-dark);
            background: var(--color-light);
            border-bottom: 1px solid var(--color-mediumlight);
            text-align: center;
            font-size: var(--typography-size-s2);
            flex-shrink: 0;
        }

        .image-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: var(--color-lightest);
            position: relative;
        }

        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
        }

        .no-image {
            padding: var(--spacing-lg);
            color: var(--color-medium);
            font-style: italic;
            text-align: center;
            font-size: var(--typography-size-s2);
        }

        .diff-section {
            display: flex;
        }

        .hidden {
            display: none !important;
        }

        @media (max-width: 768px) {
            body {
                height: auto;
                overflow: auto;
            }

            .comparison-item {
                height: auto;
                min-height: 80vh;
            }

            .images-container,
            .images-container.with-diff {
                grid-template-columns: 1fr;
                gap: var(--spacing-sm);
            }

            .header {
                flex-direction: column;
                align-items: stretch;
                gap: var(--spacing-sm);
            }

            .header-left {
                justify-content: center;
            }

            .controls {
                flex-direction: column;
                align-items: stretch;
                gap: var(--spacing-sm);
            }

            .navigation {
                flex-direction: column;
                gap: var(--spacing-xs);
            }

            .image-container {
                min-height: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <h1>Screenshot Comparison Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>Filter:</label>
                <button class="filter-btn" data-filter="all">All</button>
                <button class="filter-btn active" data-filter="differ">Differences Only</button>
                <button class="filter-btn" data-filter="missing">Missing Baselines</button>
            </div>
            <div class="navigation">
                <div class="nav-info">
                    <span id="currentItem">1</span> of <span id="totalItems">${result.total}</span>
                </div>
                <div class="nav-buttons">
                    <button class="nav-btn" id="prevBtn">← Previous</button>
                    <button class="nav-btn" id="nextBtn">Next →</button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div id="comparisonContainer">
        ${result.details
          .map((detail, index) => {
            const baselinePath = path.join(baselineDir, detail.filename);
            const currentPath = path.join(screenshotsDir, detail.filename);
            const diffPath = detail.diffPath;

            // Convert absolute paths to relative paths for HTML
            const relativeBaseline = path.relative(path.dirname(reportPath), baselinePath);
            const relativeCurrent = path.relative(path.dirname(reportPath), currentPath);
            const relativeDiff = diffPath ? path.relative(path.dirname(reportPath), diffPath) : null;

            let statusClass: string;
            let statusText: string;
            switch (detail.status) {
              case 'match':
                statusClass = 'status-match';
                statusText = '✅ Match';
                break;
              case 'differ':
                statusClass = 'status-differ';
                statusText = '❌ Different';
                break;
              case 'missing-baseline':
                statusClass = 'status-missing';
                statusText = '⚠️ Missing Baseline';
                break;
              default:
                statusClass = 'status-missing';
                statusText = '❓ Unknown';
                break;
            }

            const hasDiff = detail.status === 'differ' && diffPath && existsSync(diffPath);

            return `
            <div class="comparison-item hidden" data-status="${detail.status}" data-index="${index}">
                <div class="comparison-header">
                    <div class="filename">${detail.filename}</div>
                    <div class="status-badge ${statusClass}">${statusText}</div>
                </div>
                <div class="images-container ${hasDiff ? 'with-diff' : ''}">
                    <div class="image-section">
                        <div class="image-label">Baseline</div>
                        <div class="image-container">
                            ${
                              existsSync(baselinePath)
                                ? `<img src="${relativeBaseline}" alt="Baseline: ${detail.filename}">`
                                : '<div class="no-image">No baseline image</div>'
                            }
                        </div>
                    </div>
                    <div class="image-section">
                        <div class="image-label">Current</div>
                        <div class="image-container">
                            ${
                              existsSync(currentPath)
                                ? `<img src="${relativeCurrent}" alt="Current: ${detail.filename}">`
                                : '<div class="no-image">No current image</div>'
                            }
                        </div>
                    </div>
                    ${
                      hasDiff
                        ? `
                    <div class="image-section diff-section">
                        <div class="image-label">Diff</div>
                        <div class="image-container">
                            <img src="${relativeDiff}" alt="Diff: ${detail.filename}">
                        </div>
                    </div>`
                        : ''
                    }
                </div>
            </div>`;
          })
          .join('')}
        </div>
    </div>

    <script>
        let currentIndex = 0;
        let filteredItems = [];
        
        function updateFilteredItems() {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            const allItems = Array.from(document.querySelectorAll('.comparison-item'));
            
            filteredItems = allItems.filter(item => {
                if (activeFilter === 'all') return true;
                if (activeFilter === 'differ') return item.dataset.status === 'differ';
                if (activeFilter === 'missing') return item.dataset.status === 'missing-baseline';
                return item.dataset.status === activeFilter;
            });
            
            currentIndex = 0;
            updateDisplay();
        }
        
        function updateDisplay() {
            const allItems = document.querySelectorAll('.comparison-item');
            allItems.forEach(item => item.classList.add('hidden'));
            
            if (filteredItems.length > 0) {
                filteredItems[currentIndex].classList.remove('hidden');
            }
            
            document.getElementById('currentItem').textContent = filteredItems.length > 0 ? currentIndex + 1 : 0;
            document.getElementById('totalItems').textContent = filteredItems.length;
            
            document.getElementById('prevBtn').disabled = currentIndex === 0;
            document.getElementById('nextBtn').disabled = currentIndex >= filteredItems.length - 1;
        }
        
        
        // Event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateFilteredItems();
            });
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            }
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentIndex < filteredItems.length - 1) {
                currentIndex++;
                updateDisplay();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            } else if (e.key === 'ArrowRight' && currentIndex < filteredItems.length - 1) {
                currentIndex++;
                updateDisplay();
            }
        });
        
        // Initialize
        updateFilteredItems();
    </script>
</body>
</html>`;

  const { writeFileSync } = await import('fs');
  writeFileSync(reportPath, html);

  return reportPath;
}
