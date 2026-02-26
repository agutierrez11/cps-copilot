ïconst path = require('path');

// We manually set argv to tell the bundled CLI what to do
process.argv = [
  process.execPath,
  path.resolve(__dirname, 'node_modules/@graphlab-fr/cosma/dist/back.cjs'),
  'modelize',
  '--config',
  path.resolve(__dirname, 'config.yml')
];

console.log('--- Forced Cosma Export Start ---');
console.log('Targeting:', path.resolve(__dirname, '../'));
console.log('Exporting to:', path.resolve(__dirname, './export'));

try {
  // Clearing the require cache just in case we are in a long-running process
  delete require.cache[require.resolve('./node_modules/@graphlab-fr/cosma/dist/back.cjs')];
  require('./node_modules/@graphlab-fr/cosma/dist/back.cjs');
  console.log('--- CLI Invoked Successfully ---');
} catch (error) {
  console.error('--- CLI Invocation Failed ---');
  console.error(error);
  process.exit(1);
}
Ô *cascade08ÔÕ*cascade08ÕÖ *cascade08ÖÜ*cascade08Üã *cascade08ãë*cascade08ëñ *cascade08ñõ*cascade08õö *cascade08ö÷*cascade08÷ø *cascade08øù*cascade08ùú *cascade08ú‚*cascade08‚ƒ *cascade08ƒ‰*cascade08‰Š *cascade08Š–*cascade08–ï *cascade082ffile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/force_export.js