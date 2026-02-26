³const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global\\Industrias';

function checkFile(filePath) {
    if (!filePath.endsWith('.md')) return;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fmMatch = content.match(/^---\n([\s\S]+?)\n---\n/);
        if (fmMatch) {
            const head = fmMatch[1];
            const titleMatch = head.match(/^title:\s*"?(.*?)"?\s*$/m);
            console.log(`FILE: ${path.basename(filePath)} | TITLE: [${titleMatch ? titleMatch[1] : 'NONE'}]`);
        } else {
            console.log(`FILE: ${path.basename(filePath)} | NO FRONTMATTER`);
        }
    } catch (err) {
        console.log(`FILE: ${path.basename(filePath)} | ERROR`);
    }
}

const files = fs.readdirSync(targetDir);
files.forEach(file => {
    checkFile(path.join(targetDir, file));
});
³*cascade082efile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/dump_titles.js