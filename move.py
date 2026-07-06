import re

def move_testimonials(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the testimonials block including the comment if it exists
    # The block might be preceded by any comment like <!-- Testimonials Section --> or <!-- Sección de Testimonios -->
    pattern = r'([ \t]*<!--[^\-]*Testimonio[^\-]*-->\s*)?(<section class="testimonials-section">.*?</section>)'
    
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if not match:
        print(f"Testimonials not found in {filepath}")
        return
        
    block = match.group(0)
    
    # Remove it from its current position
    new_content = content.replace(block, '', 1)
    
    # Place it right before </main>
    main_end_pattern = r'([ \t]*</main>)'
    if not re.search(main_end_pattern, new_content):
        print(f"</main> not found in {filepath}")
        return
        
    insert_block = f"\n{block}\n"
    new_content = re.sub(main_end_pattern, insert_block + r'\1', new_content, 1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully moved testimonials in {filepath}")

move_testimonials('index.html')
move_testimonials('es/index.html')
