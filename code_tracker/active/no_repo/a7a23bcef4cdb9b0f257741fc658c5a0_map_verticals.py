á
import os
import re

dir_path = 'Empresas_cosma'

def process_files():
    files = [f for f in os.listdir(dir_path) if f.endswith('.md')]
    count = 0
    for filename in files:
        path = os.path.join(dir_path, filename)
        try:
            with open(path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            
            if 'types:' in content:
                continue

            # Extract Vertical
            match = re.search(r'Vertical:\s*(.+)', content)
            if match:
                vertical = match.group(1).strip()
                # Clean up: remove emojis, brackets, etc.
                vertical = vertical.replace('[[', '').replace(']]', '').replace('üëæ', '').replace('üöÄ', '').replace('üåê', '').strip()
                
                # Insert types field below ---
                new_content = re.sub(r'---\n', f'---\ntypes: ["{vertical}"]\n', content, count=1)
                
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                if count % 100 == 0:
                    print(f"Processed {count} files...")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    
    print(f"Finished. Updated {count} files.")

if __name__ == "__main__":
    process_files()
á*cascade082gfile:///c:/Users/Antonio/OneDrive/Escritorio/Ecosistema_Fintech_Global/cosma_workspace/map_verticals.py