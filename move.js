const fs = require('fs');

function moveTestimonials(filepath) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        return;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');

    // Pattern to match testimonials section (with or without comment)
    const pattern = /([ \t]*<!--[^-]*Testimonio[^-]*-->\s*)?(<section class="testimonials-section">[\s\S]*?<\/section>)/i;
    
    const match = content.match(pattern);
    if (!match) {
        console.log(`Testimonials not found in ${filepath}`);
        return;
    }
    
    const block = match[0];
    
    // Remove it
    content = content.replace(block, '');
    
    // Insert before </main>
    const mainEndPattern = /([ \t]*<\/main>)/;
    if (!mainEndPattern.test(content)) {
        console.log(`</main> not found in ${filepath}`);
        return;
    }
    
    const insertBlock = `\n${block}\n`;
    content = content.replace(mainEndPattern, insertBlock + '$1');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Successfully moved testimonials in ${filepath}`);
}

moveTestimonials('index.html');
moveTestimonials('es/index.html');
