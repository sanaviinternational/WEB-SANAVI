document.addEventListener('DOMContentLoaded', () => {
    // Language Selector functionality with Google Translate
    const langToggle = document.getElementById('lang-toggle');
    const currentFlag = document.getElementById('current-flag');
    
    // Read current language from cookie
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return "";
    }
    
    function setCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }

    let currentLang = 'en';
    let gtCookie = getCookie('googtrans');
    if (gtCookie === '/en/es') {
        currentLang = 'es';
        if(currentFlag) currentFlag.src = 'https://flagcdn.com/w40/es.png';
        if(langToggle) langToggle.title = 'Español (Click to change)';
    }

    // Inject Google Translate API
    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'es,en',
            autoDisplay: false,
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    };

    const gtScript = document.createElement('script');
    gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);

    if (langToggle && currentFlag) {
        langToggle.addEventListener('click', () => {
            let selectField = document.querySelector(".goog-te-combo");
            
            if (currentLang === 'en') {
                currentLang = 'es';
                currentFlag.src = 'https://flagcdn.com/w40/es.png';
                langToggle.title = 'Español (Click to change)';
                setCookie('googtrans', '/en/es', 1);
                
                if(selectField) {
                    selectField.value = 'es';
                    selectField.dispatchEvent(new Event("change"));
                } else {
                    location.reload();
                }
            } else {
                currentLang = 'en';
                currentFlag.src = 'https://flagcdn.com/w40/us.png';
                langToggle.title = 'English (Click to change)';
                
                // Clear the cookie completely
                document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                
                // The most reliable way to revert Google Translate without a reload is clicking its internal "Restore" button
                let iframe = document.querySelector('.goog-te-banner-frame');
                let restored = false;
                
                if (iframe) {
                    try {
                        let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                        let buttons = innerDoc.getElementsByTagName('button');
                        for (let i = 0; i < buttons.length; i++) {
                            if (buttons[i].id.indexOf('restore') !== -1) {
                                buttons[i].click();
                                restored = true;
                                break;
                            }
                        }
                    } catch(e) {
                        console.error("Could not access iframe:", e);
                    }
                }
                
                // Fallback if iframe trick doesn't work
                if (!restored) {
                    if (selectField) {
                        selectField.value = '';
                        selectField.dispatchEvent(new Event("change"));
                        // If it still fails to translate back, we force a silent reload
                        setTimeout(() => {
                            if (document.documentElement.lang !== 'en') {
                                location.reload();
                            }
                        }, 300);
                    } else {
                        location.reload();
                    }
                }
            }
        });
    }

    // --- GOOGLE TRANSLATE BAR CLEANER ---
    // This actively looks for and removes the Google Translate bar and resets the body position
    function cleanGoogleTranslateBar() {
        const frames = [
            document.querySelector('.goog-te-banner-frame'),
            document.querySelector('.skiptranslate'),
            document.getElementById(':1.container'),
            document.getElementById(':0.container')
        ];
        
        let found = false;
        frames.forEach(frame => {
            if (frame && frame.style.display !== 'none') {
                frame.style.display = 'none';
                frame.style.visibility = 'hidden';
                found = true;
            }
        });

        if (document.body.style.top !== '0px' && document.body.style.top !== '') {
            document.body.style.top = '0px';
        }
        
        if (document.documentElement.style.marginTop !== '0px' && document.documentElement.style.marginTop !== '') {
            document.documentElement.style.marginTop = '0px';
        }
    }

    // Run cleaner immediately and then periodically
    setInterval(cleanGoogleTranslateBar, 500);
    // Also run on scroll and click to catch it when it appears
    window.addEventListener('scroll', cleanGoogleTranslateBar);
    document.addEventListener('click', cleanGoogleTranslateBar);

    // Site-wide Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchContainer = document.querySelector('.search-container');
    
    if (searchInput && searchContainer) {
        // Create results container
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        searchContainer.appendChild(resultsDiv);

        // English Search Index
        const searchIndexEn = [
            { 
                title: "Prime X Product", url: "product-primex.html", desc: "The ultimate 5-in-1 synergy formula.", 
                keywords: ["prime", "prime x", "supplement", "synergy", "energy", "weight", "metabolism", "product", "bag", "subscribe"],
                content: "Prime X $89.90 5-in-1 Synergy Technology Experience the ultimate fusion of modern science and natural wellness. Our revolutionary formula combines five essential pillars of health into one daily, powerful sachet. Designed to optimize cellular function and unlock your body's true potential: Metabolic Balance Sustained Energy Mental Clarity Immune Support Gut Health One Time Purchase Subscribe to Save Add to Bag"
            },
            { 
                title: "PrimeX Landing Page", url: "primex.html", desc: "Discover the 5 major health challenges and the holistic PrimeX solution.", 
                keywords: ["prime", "primex", "challenges", "holistic", "science", "nutrition", "deficiencies", "inflammation"],
                content: "Sanavi = Simplicity Sanavi represents the next generation of wellness. Our mission is to simplify supplementation by replacing complicated stacks of multiple products with one efficient, intelligently designed solution. Instead of juggling bottles and routines, primeX delivers what your body needs in a single, streamlined formula built for modern health. In a world where health is increasingly weakened by environmental and nutritional factors, it is essential to provide the body with the right materials to function optimally. We have recognized the 5 major health challenges we face today: 1 Nutritional Deficiencies Depleted soils, refined foods, and insufficient intake of essential nutrients. 2 Digestive Imbalances & Disrupted Microbiota Stress, industrial diets, and antibiotics affect digestion and immunity. 3 Chronic Inflammation & Cellular Oxidation Contributing to premature aging and degenerative diseases. 4 Stress & Nervous Fatigue Increased cortisol, sleep disturbances, anxiety, and low energy levels. 5 Metabolic Dysfunction & Weight Gain Difficulty regulating blood sugar and fat storage. primeX is the result of a global vision, balancing modern science with ancestral traditions. By integrating the principles of nutritional immunology, Ayurveda, and Traditional Chinese Medicine, this formula is designed to support overall well-being: physical, mental, and energetic. primeX is a holistic approach for everyone, providing sustainable health benefits and working in perfect synergy with the body's fundamental needs. Product Sheet Sanavi Booklet"
            },
            { 
                title: "Sanavi Shop", url: "shop.html", desc: "Buy Prime X and premium packages.", 
                keywords: ["shop", "store", "buy", "package", "price", "cart", "purchase", "shipping"],
                content: "Sanavi Shop Premium Wellness Solutions for a Better Life Prime X From only $89.90 + shipping View Product"
            },
            { 
                title: "Home", url: "index.html", desc: "Welcome to Sanavi International.", 
                keywords: ["home", "sanavi", "international", "wellness", "health", "community", "results", "stories"],
                content: "5 IN 1 SYNERGY TECHNOLOGY DIGESTIVE AND MICROBIOME SUPPORT Digestive system and microbiota support MICRONUTRIENT COMPLEX Essential and comprehensive micronutrition ANTIOXIDANT AND STEM CELL SUPPORT Cell protection and anti-aging METABOLIC SUPPORT Clean energy for greater activity and regulation MENTAL AND CARDIOVASCULAR SUPPORT Stress relief and mental clarity BUY NOW VIP MEMBER Your journey to a vibrant life begins here. Become a VIP Member to access our most powerful wellness tools and unlock the opportunity to build something even greater. BECOME VIP MEMBER ABOUT US Discover our mission, our science-backed approach, and the team dedicated to your holistic wellness journey. SEE MORE Real Stories, Real Results Hear from the Sanavi community PrimeX completely changed my morning routine. I have sustained energy all day without the crash. Highly recommended! Sarah J. Legacy Member I've tried many supplements, but the 5-in-1 synergy is real. My digestion has never been better and I feel lighter. Michael T. Building my legacy with Sanavi has been life-changing. Not only is my health optimized, but I also have financial freedom. Emma R. The flavor is amazing! It's my daily treat that actually supports my immune system. Love it. David K. As a busy mom, mental clarity is everything. PrimeX gives me the focus I need to manage my day perfectly. Jessica M. I feel 10 years younger. The antioxidant support is noticeable in my skin and my daily vitality. Carlos V. The Legacy program isn't just a business; it's a supportive family. My lifestyle has completely upgraded. Amanda L. Consistent energy, better sleep, and an immune system of steel. This is the only supplement I trust. Robert W. AMARA A dedicated space for women to reconnect with themselves—to heal, grow, and achieve the true fullness of their being. DISCOVER AMARA"
            },
            { 
                title: "VIP Member", url: "vip.html", desc: "Unlock exclusive benefits and discounts.", 
                keywords: ["vip", "member", "membership", "discount", "access", "exclusive", "tools", "vibrant", "legacy"],
                content: "VIP Member At Sanavi, everything begins with your decision to invest in your own wellness. Becoming a VIP Member is your first step toward healing, growth, and living a more vibrant, fulfilling life. It's where you gain access to our most powerful wellness tools—and unlock the opportunity to build something even greater. VIP Membership As a Sanavi VIP Member, you receive: Preferred pricing on all wellness products Legacy Once you're a VIP Member, you unlock Legacy — our business opportunity for anyone, from any background, to grow, earn, and make an impact. You don't need experience to start. If you want to feel better, help others, and create more for your life — you belong here. Legacy is designed to reward you for sharing wellness and building meaningful connections. See the Legacy Share products that make a difference Help others find their path to wellness Build community and connection Create income with purpose"
            },
            { 
                title: "About Us", url: "about.html", desc: "Discover our mission and vision.", 
                keywords: ["about", "us", "mission", "vision", "team", "company", "who", "behind"],
                content: "Welcome to sanavi Sanavi represents the Next Generation of Wellness, Removing the Complexity of Modern Supplementation. BUY NOW The sanavi way The sanavi way is simple we believe when one person heals, a family transforms, when a family transforms, a generation changes. At Sanavi, this belief is at the heart of everything we do. Our mission is to empower individuals to reclaim their health, rediscover their strength, and create lasting change in their lives. Because when a single person chooses healing, the impact extends far beyond themselves—shaping families, communities, and future generations. Our Mission At Sanavi, we create a path where anyone, from any background, can heal, grow, and step into a life of health, happiness, and fulfillment. We ignite the entrepreneurial spirit within every person, empowering them to build a life of purpose, freedom, and lasting legacy. Our Team Meet the passionate leaders driving Sanavi's vision forward. Our diverse team is dedicated to simplifying wellness and empowering communities across the globe. Rocky Garcia Founder and President Sanavi is more than wellness; it's a movement to restore balance and empower families for generations. Oscar Chavarría Director of Marketing We are redefining what it means to be healthy by simplifying the complex and focusing on what truly matters. Jorge Perez Chief Customer Officer Efficiency and purity are at the core of every product we deliver to our community. Isai Tapia Director of Global Sales Nature has all the answers. Our job is simply to bottle them without compromise. Giovanni Coto Director of Latin America A sustainable business model allows us to create lasting impact for everyone who joins our vision. Astrid Gomez Head of US Latin Market Empowering individuals to take control of their health is the most rewarding mission I could ask for. Our Story Growing up in the 80s and 90s watching something that shaped the way I see wellness today. During that time, the network marketing and supplement industries exploded. They promised better health, financial freedom, and a path to a better life. Wellness became complicated. People were encouraged to buy more and more supplements. Business models became complex, built on structures difficult for everyday people to navigate. For decades, the industry repeated the same formula. Sanavi was created to break that cycle. We believe wellness should be simple and honest. Instead of endless supplement stacks, Sanavi focuses on a smarter approach—one efficient solution designed to support the body in a clear, simplified way. Because real wellness shouldn't feel overwhelming. It should feel empowering. Sanavi exists to help individuals reclaim their health with clarity, simplicity, and purpose. This isn't just another company. This is a new way forward."
            },
            { 
                title: "Amara", url: "amara.html", desc: "A space for women to reconnect and grow.", 
                keywords: ["amara", "women", "woman", "heal", "grow", "space", "plenitud", "reconnect"],
                content: "Amara is a space for women to come back to themselves—to heal, grow, and rise into the fullness of who they are meant to be. Rooted in the meaning of eternal and everlasting love, Amara is about nurturing a deep, lasting connection with yourself and stepping into your strength with courage and clarity. This is for women from all backgrounds who are ready for more: more healing, more confidence, more purpose. It's a place where women support women, where growth becomes collective, and no one rises alone. Through wellness, self-care, and inner work, Amara helps women reconnect with their bodies, minds, and hearts. As healing takes root, something powerful emerges—confidence, clarity, and resilience. Leadership in Amara isn't about titles—it's about impact, authenticity, and leading with love, wherever you are. Amara is more than a community— it's a movement. A return to self, a rise into strength, and a step into leadership. It's for women who are ready to feel better, live fully, and lead boldly. Welcome to Amara. Service Healing, rising, and leading is not just personal—it's also about how we lift others. Amara encourages women to put their growth into action through service projects and acts of love. Local Action From volunteering in local communities to creating positive change, every act of service is an opportunity to live the Amara values. Mentorship Mentoring, supporting causes, and empowering others are the hearts of our growth, ensuring no woman rises alone. Collective Impact Through Sanavi's commitment to giving back alongside Amara, we foster a culture of compassion and shared success. Amara is more than a community—it's a movement. A return to self, a rise into strength, and a step into leadership. It's for women who are ready to heal deeply, rise fully, and lead boldly through both their own growth and their service to others."
            }
        ];

        // Spanish Search Index
        const searchIndexEs = [
            { 
                title: "Producto Prime X", url: "product-primex.html", desc: "La fórmula definitiva de sinergia 5 en 1.", 
                keywords: ["prime", "prime x", "suplemento", "sinergia", "energia", "peso", "metabolismo", "producto", "bolsa", "suscribir"],
                content: "Prime X $89.90 Tecnología de Sinergia 5 en 1 Experimenta la fusión definitiva de ciencia moderna y bienestar natural. Nuestra revolucionaria fórmula combina cinco pilares esenciales de la salud en un poderoso sobre diario. Diseñado para optimizar la función celular y desbloquear el verdadero potencial de tu cuerpo: Equilibrio Metabólico Energía Sostenida Claridad Mental Apoyo Inmunológico Salud Intestinal Compra Única Suscríbete y Ahorra Añadir a la Bolsa"
            },
            { 
                title: "Página de PrimeX", url: "primex.html", desc: "Descubre los 5 mayores retos de salud y la solución holística PrimeX.", 
                keywords: ["prime", "primex", "retos", "holistico", "ciencia", "nutricion", "deficiencias", "inflamacion"],
                content: "Sanavi = Simplicidad Sanavi representa la próxima generación del bienestar. Nuestra misión es simplificar la suplementación reemplazando montañas de múltiples productos por una solución eficiente e inteligentemente diseñada. En lugar de lidiar con frascos y rutinas, primeX entrega lo que tu cuerpo necesita en una sola fórmula optimizada construida para la salud moderna. En un mundo donde la salud se ve cada vez más debilitada por factores ambientales y nutricionales, es esencial proporcionar al cuerpo los materiales adecuados para funcionar óptimamente. Hemos reconocido los 5 principales desafíos de salud que enfrentamos hoy: 1 Deficiencias Nutricionales Suelos agotados, alimentos refinados y falta de nutrientes esenciales. 2 Desequilibrios Digestivos y Microbiota Alterada Estrés, dietas industriales y antibióticos afectan la digestión y la inmunidad. 3 Inflamación Crónica y Oxidación Celular Contribuyen al envejecimiento prematuro y enfermedades degenerativas. 4 Estrés y Fatiga Nerviosa Aumento del cortisol, alteraciones del sueño, ansiedad y bajos niveles de energía. 5 Disfunción Metabólica y Aumento de Peso Dificultad para regular el azúcar en sangre y almacenamiento de grasa. primeX es el resultado de una visión global, equilibrando la ciencia moderna con tradiciones ancestrales. Integrando principios de inmunología nutricional, Ayurveda y Medicina Tradicional China, esta fórmula está diseñada para apoyar el bienestar general: físico, mental y energético. primeX es un enfoque holístico para todos, brindando beneficios de salud sostenibles y trabajando en perfecta sinergia con las necesidades fundamentales del cuerpo. Hoja del Producto Folleto Sanavi"
            },
            { 
                title: "Tienda Sanavi", url: "shop.html", desc: "Compra Prime X y paquetes premium.", 
                keywords: ["tienda", "comprar", "paquete", "precio", "carrito", "compra", "envio", "compras"],
                content: "Tienda Sanavi Soluciones Premium de Bienestar para una Vida Mejor Prime X Desde tan solo $89.90 + envío Ver Producto Paquete Profesional Paquete Estándar"
            },
            { 
                title: "Inicio", url: "index.html", desc: "Bienvenido a Sanavi International.", 
                keywords: ["inicio", "sanavi", "internacional", "bienestar", "salud", "comunidad", "resultados", "historias"],
                content: "TECNOLOGÍA DE SINERGIA 5 EN 1 APOYO DIGESTIVO Y DEL MICROBIOMA Apoyo del sistema digestivo y microbiota COMPLEJO DE MICRONUTRIENTES Micronutrición esencial y completa APOYO ANTIOXIDANTE Y CÉLULAS MADRE Protección celular y antienvejecimiento APOYO METABÓLICO Energía limpia para mayor actividad y regulación APOYO MENTAL Y CARDIOVASCULAR Alivio del estrés y claridad mental COMPRAR AHORA MIEMBRO VIP Tu viaje hacia una vida vibrante comienza aquí. Conviértete en Miembro VIP para acceder a nuestras herramientas de bienestar más poderosas y desbloquear la oportunidad de construir algo aún mayor. HAZTE MIEMBRO VIP NOSOTROS Descubre nuestra misión, nuestro enfoque respaldado por la ciencia y el equipo dedicado a tu viaje holístico de bienestar. VER MÁS Historias Reales, Resultados Reales Escucha a la comunidad Sanavi PrimeX cambió por completo mi rutina matutina. Tengo energía sostenida todo el día sin bajones. ¡Altamente recomendado! Sarah J. Miembro Legacy He probado muchos suplementos, pero la sinergia 5-en-1 es real. Mi digestión nunca ha estado mejor y me siento más ligero. Michael T. Construir mi legado con Sanavi ha cambiado mi vida. No solo se optimiza mi salud, sino que también tengo libertad financiera. Emma R. ¡El sabor es increíble! Es mi capricho diario que realmente apoya mi sistema inmunológico. Lo amo. David K. Como mamá ocupada, la claridad mental lo es todo. PrimeX me da el enfoque que necesito para manejar mi día perfectamente. Jessica M. Me siento 10 años más joven. El apoyo antioxidante se nota en mi piel y en mi vitalidad diaria. Carlos V. El programa Legacy no es solo un negocio; es una familia que te apoya. Mi estilo de vida ha mejorado por completo. Amanda L. Energía constante, mejor sueño y un sistema inmunológico de acero. Este es el único suplemento en el que confío. Robert W. AMARA Un espacio dedicado para que las mujeres se reconecten consigo mismas—para sanar, crecer y alcanzar la verdadera plenitud de su ser. DESCUBRE AMARA"
            },
            { 
                title: "Miembro VIP", url: "vip.html", desc: "Desbloquea beneficios y descuentos exclusivos.", 
                keywords: ["vip", "miembro", "membresia", "descuento", "acceso", "exclusivo", "herramientas", "vibrante", "legado"],
                content: "Miembro VIP En Sanavi, todo comienza con tu decisión de invertir en tu propio bienestar. Convertirte en Miembro VIP es tu primer paso hacia la sanación, el crecimiento y una vida más vibrante y plena. Es donde obtienes acceso a nuestras herramientas de bienestar más poderosas—y desbloqueas la oportunidad de construir algo aún mayor. Membresía VIP Como Miembro VIP de Sanavi, recibes: Precios preferenciales en todos los productos de bienestar Legacy Una vez que eres Miembro VIP, desbloqueas Legacy — nuestra oportunidad de negocio para que cualquiera, sin importar su origen, pueda crecer, ganar y hacer un impacto. No necesitas experiencia para empezar. Si quieres sentirte mejor, ayudar a otros y crear más para tu vida — perteneces aquí. Legacy está diseñado para recompensarte por compartir bienestar y construir conexiones significativas. Ver el Legado Comparte productos que hacen la diferencia Ayuda a otros a encontrar su camino hacia el bienestar Construye comunidad y conexión Crea ingresos con propósito"
            },
            { 
                title: "Sobre Nosotros", url: "about.html", desc: "Descubre nuestra misión y visión.", 
                keywords: ["nosotros", "mision", "vision", "equipo", "empresa", "quien", "detras", "historia"],
                content: "Bienvenido a sanavi Sanavi representa la Próxima Generación del Bienestar, Eliminando la Complejidad de la Suplementación Moderna. COMPRAR AHORA La manera sanavi La manera sanavi es simple: creemos que cuando una persona sana, una familia se transforma, cuando una familia se transforma, una generación cambia. En Sanavi, esta creencia está en el corazón de todo lo que hacemos. Nuestra misión es empoderar a las personas para que recuperen su salud, redescubran su fuerza y creen un cambio duradero en sus vidas. Porque cuando una sola persona elige la sanación, el impacto se extiende mucho más allá de sí misma—moldeando familias, comunidades y generaciones futuras. Nuestra Misión En Sanavi, creamos un camino donde cualquiera, de cualquier origen, puede sanar, crecer y entrar en una vida de salud, felicidad y plenitud. Encendemos el espíritu emprendedor dentro de cada persona, empoderándolas para construir una vida de propósito, libertad y un legado duradero. Nuestro Equipo Conoce a los líderes apasionados que impulsan la visión de Sanavi hacia adelante. Nuestro equipo diverso está dedicado a simplificar el bienestar y empoderar comunidades en todo el mundo. Rocky Garcia Fundador y Presidente Sanavi es más que bienestar; es un movimiento para restaurar el equilibrio y empoderar a las familias por generaciones. Oscar Chavarría Director de Marketing Estamos redefiniendo lo que significa ser saludable simplificando lo complejo y enfocándonos en lo que realmente importa. Jorge Perez Director de Atención al Cliente La eficiencia y la pureza son el núcleo de cada producto que entregamos a nuestra comunidad. Isai Tapia Director de Ventas Globales La naturaleza tiene todas las respuestas. Nuestro trabajo es simplemente embotellarlas sin compromisos. Giovanni Coto Director de Latinoamérica Un modelo de negocio sostenible nos permite crear un impacto duradero para todos los que se unen a nuestra visión. Astrid Gomez Jefa del Mercado Latino en EE. UU. Empoderar a las personas para que tomen el control de su salud es la misión más gratificante que podría pedir. Nuestra Historia Crecer en los años 80 y 90 observando algo que moldeó la forma en que veo el bienestar hoy. Durante ese tiempo, las industrias del mercadeo en red y de suplementos explotaron. Prometían mejor salud, libertad financiera y un camino hacia una vida mejor. El bienestar se volvió complicado. Se animaba a la gente a comprar más y más suplementos. Los modelos de negocio se volvieron complejos, construidos sobre estructuras difíciles de navegar para la gente común. Durante décadas, la industria repitió la misma fórmula. Sanavi fue creada para romper ese ciclo. Creemos que el bienestar debe ser simple y honesto. En lugar de interminables pilas de suplementos, Sanavi se enfoca en un enfoque más inteligente—una solución eficiente diseñada para apoyar el cuerpo de una manera clara y simplificada. Porque el verdadero bienestar no debería sentirse abrumador. Debería sentirse empoderador. Sanavi existe para ayudar a las personas a recuperar su salud con claridad, simplicidad y propósito. Esta no es solo otra empresa. Este es un nuevo camino a seguir."
            },
            { 
                title: "Amara", url: "amara.html", desc: "Un espacio para que las mujeres se reconecten y crezcan.", 
                keywords: ["amara", "mujeres", "mujer", "sanar", "crecer", "espacio", "plenitud", "reconectar"],
                content: "Amara es un espacio para que las mujeres vuelvan a sí mismas—para sanar, crecer y elevarse hacia la plenitud de lo que están destinadas a ser. Arraigada en el significado del amor eterno e imperecedero, Amara trata sobre nutrir una conexión profunda y duradera contigo misma y entrar en tu fuerza con coraje y claridad. Esto es para mujeres de todos los orígenes que están listas para más: más sanación, más confianza, más propósito. Es un lugar donde las mujeres apoyan a las mujeres, donde el crecimiento se vuelve colectivo y ninguna se eleva sola. A través del bienestar, el autocuidado y el trabajo interno, Amara ayuda a las mujeres a reconectarse con sus cuerpos, mentes y corazones. A medida que la sanación echa raíces, emerge algo poderoso—confianza, claridad y resiliencia. El liderazgo en Amara no se trata de títulos—se trata de impacto, autenticidad y liderar con amor, dondequiera que estés. Amara es más que una comunidad— es un movimiento. Un regreso al ser, un ascenso hacia la fuerza y un paso hacia el liderazgo. Es para mujeres que están listas para sentirse mejor, vivir plenamente y liderar audazmente. Bienvenida a Amara. Servicio Sanar, crecer y liderar no es solo personal—también se trata de cómo elevamos a los demás. Amara anima a las mujeres a poner su crecimiento en acción a través de proyectos de servicio y actos de amor. Acción Local Desde el voluntariado en comunidades locales hasta la creación de cambios positivos, cada acto de servicio es una oportunidad para vivir los valores de Amara. Mentoría Ser mentora, apoyar causas y empoderar a otras son los corazones de nuestro crecimiento, asegurando que ninguna mujer se eleve sola. Impacto Colectivo A través del compromiso de Sanavi de retribuir junto con Amara, fomentamos una cultura de compasión y éxito compartido. Amara es más que una comunidad—es un movimiento. Un regreso al ser, un ascenso hacia la fuerza y un paso hacia el liderazgo. Es para mujeres que están listas para sanar profundamente, elevarse plenamente y liderar audazmente a través de su propio crecimiento y su servicio a los demás."
            }
        ];

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            resultsDiv.innerHTML = '';
            
            if (query.length < 2) {
                resultsDiv.classList.remove('active');
                return;
            }

            // Determine which index to use based on current site language
            const searchIndex = currentLang === 'es' ? searchIndexEs : searchIndexEn;

            let hasResults = false;

            // Helper to escape regex
            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const safeQuery = escapeRegExp(query);
            const highlightRegex = new RegExp(`(${safeQuery})`, 'gi');

            // 1. GLOBAL CONTENT SEARCH (Finds ALL matches in ANY page)
            const matchedPages = searchIndex.filter(item => {
                return item.title.toLowerCase().includes(query) || 
                       item.desc.toLowerCase().includes(query) || 
                       item.keywords.some(kw => kw.includes(query)) || 
                       item.content.toLowerCase().includes(query);
            });

            if (matchedPages.length > 0) {
                hasResults = true;
                const header = document.createElement('div');
                header.className = 'search-category-header';
                header.innerText = 'Site Results:';
                header.style.padding = '10px 15px 5px';
                header.style.fontSize = '11px';
                header.style.textTransform = 'uppercase';
                header.style.color = '#888';
                header.style.fontWeight = 'bold';
                resultsDiv.appendChild(header);

                matchedPages.forEach(match => {
                    // Find ALL occurrences in the content
                    const contentLower = match.content.toLowerCase();
                    let occurrences = [];
                    let startIndex = 0;
                    
                    while ((startIndex = contentLower.indexOf(query, startIndex)) > -1) {
                        occurrences.push(startIndex);
                        startIndex += query.length;
                        if (occurrences.length >= 3) break; // Limit to max 3 snippets per page to avoid clutter
                    }

                    if (occurrences.length > 0 && !match.title.toLowerCase().includes(query)) {
                        // Create a link for each snippet found in this page
                        occurrences.forEach(idx => {
                            const a = document.createElement('a');
                            a.href = match.url;
                            a.className = 'search-result-item';
                            
                            const start = Math.max(0, idx - 25);
                            const end = Math.min(match.content.length, idx + query.length + 25);
                            let snippet = match.content.substring(start, end);
                            if(start > 0) snippet = "..." + snippet;
                            if(end < match.content.length) snippet = snippet + "...";
                            
                            snippet = snippet.replace(highlightRegex, '<span style="background:var(--accent-lime);color:#000;">$1</span>');
                            
                            a.innerHTML = `
                                <div class="search-result-title">${match.title}</div>
                                <div class="search-result-desc" style="font-size:13px; color:rgba(255,255,255,0.7);">${snippet}</div>
                            `;
                            resultsDiv.appendChild(a);
                        });
                    } else {
                        // Just show the page with its description
                        const a = document.createElement('a');
                        a.href = match.url;
                        a.className = 'search-result-item';
                        let displayDesc = match.desc.replace(highlightRegex, '<span style="background:var(--accent-lime);color:#000;">$1</span>');
                        let displayTitle = match.title.replace(highlightRegex, '<span style="background:var(--accent-lime);color:#000;">$1</span>');
                        
                        a.innerHTML = `
                            <div class="search-result-title">${displayTitle}</div>
                            <div class="search-result-desc" style="font-size:13px; color:rgba(255,255,255,0.7);">${displayDesc}</div>
                        `;
                        resultsDiv.appendChild(a);
                    }
                });
            }

            // 2. IN-PAGE DOM SEARCH (Finds specific text nodes to scroll to)
            // We use a TreeWalker to find actual text nodes, which is much more accurate than querying tags
            const inPageMatches = [];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            
            while ((node = walker.nextNode())) {
                // Skip script/style tags and empty text
                if (node.parentElement && (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE')) continue;
                if (node.nodeValue.trim().length < 2) continue;
                
                const text = node.nodeValue;
                if (text.toLowerCase().includes(query)) {
                    const parentEl = node.parentElement;
                    
                    // Don't highlight inside the search bar itself
                    if (parentEl.closest('.search-container')) continue;
                    
                    if (!parentEl.id) {
                        parentEl.id = 'search-match-' + Math.random().toString(36).substr(2, 9);
                    }
                    
                    const idx = text.toLowerCase().indexOf(query);
                    const start = Math.max(0, idx - 25);
                    const end = Math.min(text.length, idx + query.length + 25);
                    let snippet = text.substring(start, end).replace(/\n/g, ' ').trim();
                    
                    if(start > 0) snippet = "..." + snippet;
                    if(end < text.length) snippet = snippet + "...";
                    
                    snippet = snippet.replace(highlightRegex, '<span style="background:var(--accent-lime);color:#000;">$1</span>');

                    // Avoid duplicate snippets from the same element
                    if (!inPageMatches.some(m => m.id === parentEl.id)) {
                        inPageMatches.push({ id: parentEl.id, snippet: snippet });
                    }
                    
                    if (inPageMatches.length >= 5) break; // Limit local matches
                }
            }

            if (inPageMatches.length > 0) {
                hasResults = true;
                const header2 = document.createElement('div');
                header2.className = 'search-category-header';
                header2.innerText = 'Scroll to on this page:';
                header2.style.padding = '10px 15px 5px';
                header2.style.fontSize = '11px';
                header2.style.textTransform = 'uppercase';
                header2.style.color = '#888';
                header2.style.fontWeight = 'bold';
                if (matchedPages.length > 0) header2.style.borderTop = '1px solid #eee';
                resultsDiv.appendChild(header2);

                inPageMatches.forEach(match => {
                    const a = document.createElement('a');
                    a.href = '#' + match.id;
                    a.className = 'search-result-item';
                    a.innerHTML = `<div class="search-result-desc" style="font-size:13px; color:rgba(255,255,255,0.7);">${match.snippet}</div>`;
                    
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.getElementById(match.id);
                        if(target) {
                            // Add a subtle highlight animation to the target element
                            const originalBg = target.style.backgroundColor;
                            const originalTransition = target.style.transition;
                            target.style.transition = 'background-color 0.5s ease';
                            target.style.backgroundColor = 'rgba(206, 253, 123, 0.3)'; // Brand lime green semi-transparent
                            
                            target.scrollIntoView({behavior: 'smooth', block: 'center'});
                            resultsDiv.classList.remove('active');
                            
                            setTimeout(() => {
                                target.style.backgroundColor = originalBg;
                                setTimeout(() => target.style.transition = originalTransition, 500);
                            }, 2000);
                        }
                    });
                    resultsDiv.appendChild(a);
                });
            }

            if (!hasResults) {
                resultsDiv.innerHTML = '<div class="search-no-results">No results found</div>';
            }
            
            resultsDiv.classList.add('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                resultsDiv.classList.remove('active');
            }
        });

        // Allow reopening dropdown on focus if there's text
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                resultsDiv.classList.add('active');
            }
        });
    }

    // Smooth scroll for nav links (placeholders)
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                // Future smooth scroll implementation
            }
        });
    });

    // Product mockup click to show benefits (useful for mobile)
    const mockupContainer = document.querySelector('.mockup-container');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (mockupContainer && heroVisual) {
        mockupContainer.addEventListener('click', () => {
            heroVisual.classList.toggle('show-benefits');
        });
    }

    // Story Horizontal Scroll Logic
    const storyContainer = document.querySelector('.story-scroll-container');
    const storyTrack = document.querySelector('.story-horizontal-track');
    
    if (storyContainer && storyTrack) {
        window.addEventListener('scroll', () => {
            const containerTop = storyContainer.offsetTop;
            const containerHeight = storyContainer.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            
            // Check if we are inside the scroll container
            if (scrollY >= containerTop && scrollY <= containerTop + containerHeight - windowHeight) {
                // Calculate progress from 0 to 1
                const progress = (scrollY - containerTop) / (containerHeight - windowHeight);
                
                // Translate the track horizontally
                const maxTranslate = storyTrack.scrollWidth - window.innerWidth;
                storyTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
            } else if (scrollY < containerTop) {
                storyTrack.style.transform = `translate3d(0px, 0, 0)`;
            } else {
                const maxTranslate = storyTrack.scrollWidth - window.innerWidth;
                storyTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
            }
        });
    }

    // PrimeX Sticky Scroll Carousel Logic
    const primexScrollWrapper = document.querySelector('.primex-scroll-wrapper');
    const primexTrack = document.querySelector('.primex-horizontal-track');
    
    if (primexScrollWrapper && primexTrack) {
        window.addEventListener('scroll', () => {
            const wrapperTop = primexScrollWrapper.offsetTop;
            const wrapperHeight = primexScrollWrapper.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            
            if (scrollY >= wrapperTop && scrollY <= wrapperTop + wrapperHeight - windowHeight) {
                const progress = (scrollY - wrapperTop) / (wrapperHeight - windowHeight);
                const maxTranslate = primexTrack.scrollWidth - window.innerWidth + 100; // Plus some margin
                primexTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
            } else if (scrollY < wrapperTop) {
                primexTrack.style.transform = `translate3d(0px, 0, 0)`;
            } else {
                const maxTranslate = primexTrack.scrollWidth - window.innerWidth + 100;
                primexTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
            }
        });
    }



    // VIP Benefits Carousel Logic
    const benefits = [
        "Preferred pricing on all wellness products",
        "Exclusive access to premium products and new releases",
        "A guided path to healing and wellness",
        "Ongoing education and support",
        "A like-minded, purpose-driven community",
        "Exclusive access to Legacy (our business opportunity)"
    ];
    
    let currentBenefitIndex = 0;
    const benefitText = document.getElementById('benefit-text');
    const timerProgress = document.getElementById('timer-progress');
    const intervalTime = 4000; // 4 seconds
    
    if (benefitText && timerProgress) {
        const updateBenefit = () => {
            // Fade out
            benefitText.style.opacity = 0;
            benefitText.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                currentBenefitIndex = (currentBenefitIndex + 1) % benefits.length;
                benefitText.innerText = benefits[currentBenefitIndex];
                
                // Fade in
                benefitText.style.opacity = 1;
                benefitText.style.transform = 'translateY(0)';
                
                // Reset timer bar
                timerProgress.style.transition = 'none';
                timerProgress.style.width = '0%';
                
                // Force reflow to ensure reset happens before starting again
                void timerProgress.offsetWidth;
                
                // Start progress
                timerProgress.style.transition = `width ${intervalTime}ms linear`;
                timerProgress.style.width = '100%';
            }, 500);
        };
        
        // Initial timer start
        timerProgress.style.transition = `width ${intervalTime}ms linear`;
        timerProgress.style.width = '100%';
        
        setInterval(updateBenefit, intervalTime);
    }

    // Amara Parallax Effect
    const amaraHero = document.querySelector('.amara-hero');
    if (amaraHero) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.pageYOffset;
            const heroOffset = amaraHero.offsetTop;
            const speed = 0.4;
            
            // Calculate movement
            if (scrollPos > heroOffset - window.innerHeight && scrollPos < heroOffset + amaraHero.offsetHeight) {
                const yPos = (scrollPos - heroOffset) * speed;
                amaraHero.style.backgroundPositionY = `${yPos}px`;
            }
        });
    }

    // Amara Dynamic Image Rotation (Manifesto)
    const amaraImg = document.getElementById('amara-dynamic-img');
    if (amaraImg) {
        let currentPhotoIndex = 1;
        setInterval(() => {
            currentPhotoIndex = (currentPhotoIndex % 5) + 1;
            
            // Fade effect: reduce opacity, change src, then restore
            amaraImg.style.opacity = 0.8;
            setTimeout(() => {
                amaraImg.src = `FOTOS AMARA/${currentPhotoIndex}.jpg`;
                amaraImg.style.opacity = 1;
            }, 300);
        }, 5000);
    }
});

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('mobile-active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinksContainer.classList.remove('mobile-active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
