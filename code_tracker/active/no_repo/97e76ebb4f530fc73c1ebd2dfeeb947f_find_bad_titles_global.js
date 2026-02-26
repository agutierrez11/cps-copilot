Îconst fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global';
const excludeDirs = ['.obsidian', 'node_modules', 'cosma_workspace', 'export', '.cosma'];

function checkFile(filePath) {
    try {
        if (filePath.endsWith('.md')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.trim() === '') return; // Skip empty files

            const fmMatch = content.match(/^---\n([\s\S]+?)\n---\n/);
            if (!fmMatch) {
                console.log(`MISSING_FRONTMATTER: ${filePath}`);
                return;
            }

            const head = fmMatch[1];
            const titleMatch = head.match(/^title:\s*(.*)$/m);
            if (!titleMatch || !titleMatch[1].trim() || titleMatch[1].trim() === '""' || titleMatch[1].trim() === "''") {
                console.log(`BAD_TITLE: ${filePath}`);
            }
        } else if (filePath.endsWith('.csv')) {
            console.log(`CSV_FOUND: ${filePath}`);
            // Cosma might be trying to parse a CSV and failing if it lacks a 'title' column or has empty rows
        }
    } catch (err) { }
}

function walkDir(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const baseName = path.basename(currentPath);
    if (excludeDirs.includes(baseName)) return;

    const stats = fs.statSync(currentPath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
            walkDir(path.join(currentPath, file));
        });
    } else if (currentPath.endsWith('.md') || currentPath.endsWith('.csv')) {
        checkFile(currentPath);
    }
}

console.log('--- Starting Global Title Diagnostic ---');
walkDir(rootDir);
console.log('--- Diagnostic Complete ---');
Î*cascade082pfile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/find_bad_titles_global.js