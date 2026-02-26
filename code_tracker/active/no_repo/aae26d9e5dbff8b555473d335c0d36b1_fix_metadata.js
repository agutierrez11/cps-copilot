 const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global';
// Include ALL relevant subdirectories
const targetDirs = ['Empresas', 'Empresas_Core', 'Asociaciones', 'Industrias', 'Paises', 'Regulaciones'];

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, '.md');

        if (content.trim() === '') return;

        // Remove BOM
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        // Check if starts with YAML frontmatter
        if (!content.startsWith('---\n')) {
            console.log(`Fixing (no frontmatter): ${filePath}`);
            let title = fileName;
            const h1Match = content.match(/^#\s+(.+)$/m);
            if (h1Match) {
                title = h1Match[1].trim();
            }

            const frontmatter = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntypes:\n  - undefined\n---\n\n`;
            fs.writeFileSync(filePath, frontmatter + content);
            return true;
        } else {
            const firstEnd = content.indexOf('\n---\n', 4);
            if (firstEnd !== -1) {
                const head = content.substring(0, firstEnd);
                if (!head.includes('title:')) {
                    console.log(`Fixing (missing title): ${filePath}`);
                    const newHead = head.replace('---\n', `---\ntitle: "${fileName.replace(/"/g, '\\"')}"\n`);
                    fs.writeFileSync(filePath, newHead + content.substring(firstEnd));
                    return true;
                }
            }
        }
    } catch (err) { }
    return false;
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
        processFile(currentPath);
    }
}

console.log('--- Starting Final Comprehensive Metadata Fix ---');
targetDirs.forEach(dir => {
    const fullPath = path.join(rootDir, dir);
    console.log(`Scanning: ${fullPath}`);
    walkDir(fullPath);
});
console.log('--- Final Fix Complete ---');
< *cascade08<” *cascade08”¼*cascade08¼Ù *cascade08Ùê*cascade08êÈ *cascade08ÈÌ *cascade08Ìú*cascade08úô *cascade08ôœ *cascade08œž*cascade08žŸ *cascade08Ÿ¡*cascade08¡§ *cascade08§¨*cascade08¨© *cascade08©ª*cascade08ªÃ *cascade08ÃÄ*cascade08ÄÅ *cascade08ÅÇ*cascade08ÇÈ *cascade08ÈÊ*cascade08Êæ *cascade08æê*cascade08êñ *cascade08ñó*cascade08óô *cascade08ôõ*cascade08õú *cascade08úû*cascade08ûü *cascade08ü€*cascade08€ *cascade08Ž*cascade08Ž *cascade08—*cascade08—™ *cascade08™›*cascade08›œ *cascade08œ*cascade08ž *cascade08ž¢*cascade08¢£ *cascade08£¥*cascade08¥¸ *cascade08¸¹*cascade08¹º *cascade08º¼*cascade08¼¿ *cascade08¿Á*cascade08ÁÂ *cascade08ÂÇ*cascade08ÇÈ *cascade08ÈË*cascade08ËÌ *cascade08ÌÍ*cascade08ÍÎ *cascade08ÎÏ*cascade08ÏÐ *cascade08ÐÔ*cascade08Ôæ *cascade08æé*cascade08éë *cascade08ëï*cascade08ïñ *cascade08ñò*cascade08òõ *cascade08õö*cascade08ö÷ *cascade08÷ú*cascade08ú’ *cascade08’*cascade08ž *cascade08ž£*cascade08£§ *cascade08§®*cascade08®» *cascade08»Ä*cascade08ÄÎ *cascade08ÎÒ*cascade08ÒÓ *cascade08ÓÙ*cascade08Ù‚ *cascade08‚ƒ*cascade08ƒ„ *cascade08„‰*cascade08‰¶ *cascade08¶· *cascade08·Æ*cascade08ÆÇ *cascade08ÇÉ*cascade08ÉÊ *cascade08Êó *cascade08óÛ*cascade08Ûâ *cascade08âð*cascade08ð… *cascade08…ˆ*cascade08ˆ‰ *cascade08‰Š*cascade08Š  *cascade082ffile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/fix_metadata.js