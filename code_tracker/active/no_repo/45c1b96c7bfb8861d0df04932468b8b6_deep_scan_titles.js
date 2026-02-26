¿const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global';
const excludeDirs = ['.obsidian', 'node_modules', 'cosma_workspace', 'export', '.cosma', '.git'];

function checkFile(filePath) {
    if (!filePath.endsWith('.md')) return;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.trim() === '') return;

        const fmMatch = content.match(/^---\n([\s\S]+?)\n---\n/);
        if (!fmMatch) {
            console.log(`NO_FRONTMATTER: ${filePath}`);
            return;
        }

        const head = fmMatch[1];
        const titleLine = head.split('\n').find(line => line.trim().startsWith('title:'));

        if (!titleLine) {
            console.log(`NO_TITLE_FIELD: ${filePath}`);
            return;
        }

        const titleValue = titleLine.split(':')[1].trim();
        if (!titleValue || titleValue === '""' || titleValue === "''") {
            console.log(`EMPTY_TITLE_VALUE: ${filePath}`);
        }
    } catch (err) { }
}

function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
        const fullPath = path.join(currentDir, file);
        if (excludeDirs.includes(file)) return;

        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            scan(fullPath);
        } else {
            checkFile(fullPath);
        }
    });
}

console.log('--- Deep Scan Start ---');
scan(rootDir);
console.log('--- Deep Scan End ---');
¿*cascade082jfile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/deep_scan_titles.js