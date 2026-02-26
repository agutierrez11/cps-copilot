ñ
const fs = require('fs');
const path = require('path');

const directoryPath = 'c:\\Users\\Antonio\\OneDrive\\Escritorio\\Ecosistema_Fintech_Global\\Empresas_cosma';

const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract Vertical
    const verticalMatch = content.match(/Vertical:\s*(.+)/);
    if (verticalMatch) {
        let vertical = verticalMatch[1].trim();
        // Clean up the value (remove brackets if any)
        vertical = vertical.replace(/^\[\[/, '').replace(/\]\]$/, '');

        // Add types field if not present
        if (!content.includes('\ntypes:')) {
            content = content.replace(/---\s*\n/, `---\ntypes: ["${vertical}"]\n`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated types for ${file}: ${vertical}`);
        }
    }
});
ñ*cascade082pfile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/map_verticals_to_types.js