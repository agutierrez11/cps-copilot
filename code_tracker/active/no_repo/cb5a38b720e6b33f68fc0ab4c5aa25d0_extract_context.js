Œconst fs = require('fs');
const content = fs.readFileSync('dist/back.cjs', 'utf8');
const index = content.indexOf('empty title');
if (index !== -1) {
    console.log(content.substring(index - 200, index + 200));
} else {
    console.log('String not found');
}
z *cascade08z€*cascade08€Ä *cascade08ÄÅ*cascade08ÅÑ *cascade08ÑÒ*cascade08ÒŒ *cascade082‰file:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/node_modules/@graphlab-fr/cosma/extract_context.js