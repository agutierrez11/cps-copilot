# Cosma Installation Walkthrough

Cosma has been successfully installed globally on your system. This means you can run the `cosma` command from any terminal without needing to install it inside specific folders.

## Verification

The installation was verified by running the version check command:

```powershell
cosma --version
```

**Output:**
```
2.6.0
```

## Addressing your Obsidian issue

You mentioned that a previous attempt to install Cosma "desconfiguró un archivo de Obsidian". This likely happened if `npm install` was run inside your Obsidian vault, which adds folders like `node_modules`.

### Recommendations:

1.  **Global Installation (Done):** We have now installed Cosma **globally** using the `-g` flag. You do **not** need to run `npm install` inside your Obsidian vault or any other project folder again.
2.  **Using Cosma with Obsidian:**
    *   To use Cosma with your Obsidian notes, you should point Cosma to your vault folder using a **configuration file** or CLI arguments, rather than installing npm packages inside the vault.
    *   If you find a `node_modules` folder or `package.json` / `package-lock.json` files inside your Obsidian vault that you didn't put there intentionally, you can safely delete them to restore Obsidian's normal behavior.

## Next Steps
You can now start using Cosma to visualize your notes. For example, you can create a test project:
```powershell
mkdir cosma-test
cd cosma-test
cosma config
```
