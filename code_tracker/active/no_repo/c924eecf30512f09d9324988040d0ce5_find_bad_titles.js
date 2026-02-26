€const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global';
const targetDirs = ['Empresas', 'Asociaciones', 'Industrias', 'Paises', 'Regulaciones'];

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Match frontmatter
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
    } catch (err) {
        // console.error(`Error checking ${filePath}:`, err);
    }
}

function walkDir(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const stats = fs.statSync(currentPath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
            walkDir(path.join(currentPath, file));
        });
    } else if (currentPath.endsWith('.md')) {
        checkFile(currentPath);
    }
}

targetDirs.forEach(dir => {
    walkDir(path.join(rootDir, dir));
});
€*cascade082ifile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/find_bad_titles.js