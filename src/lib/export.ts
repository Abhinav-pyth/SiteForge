import { WebsiteConfig, Section } from '../types';

function sectionToHTML(section: Section, theme: WebsiteConfig['themeSettings']): string {
  const { primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, borderRadius } = theme;

  switch (section.type) {
    case 'navbar':
      return `
<nav style="display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:${backgroundColor};border-bottom:1px solid #eee;font-family:${fontFamily}">
  <span style="font-size:1.5rem;font-weight:700;color:${primaryColor}">${section.config.brandName}</span>
  <div style="display:flex;gap:2rem">
    ${(section.config.links || []).map((l: string) => `<a href="#" style="color:${textColor};text-decoration:none">${l}</a>`).join('')}
  </div>
  ${section.config.showCTA ? `<button style="background:${primaryColor};color:white;padding:0.5rem 1.5rem;border:none;border-radius:${borderRadius};cursor:pointer">${section.config.ctaText}</button>` : ''}
</nav>`;

    case 'hero':
      return `
<section style="padding:6rem 2rem;text-align:${section.config.alignment || 'left'};background:${section.config.backgroundStyle === 'dark' ? '#1a1a2e' : section.config.backgroundStyle === 'gradient' ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` : backgroundColor};color:${section.config.backgroundStyle === 'dark' || section.config.backgroundStyle === 'gradient' ? 'white' : textColor};font-family:${fontFamily}">
  <div style="max-width:800px;margin:${section.config.alignment === 'center' ? '0 auto' : '0'}">
    <h1 style="font-size:3.5rem;font-weight:800;margin-bottom:1rem;line-height:1.1">${section.config.title}</h1>
    <p style="font-size:1.25rem;opacity:0.85;margin-bottom:2rem">${section.config.subtitle}</p>
    <div style="display:flex;gap:1rem;${section.config.alignment === 'center' ? 'justify-content:center' : ''}">
      <button style="background:${section.config.backgroundStyle === 'dark' || section.config.backgroundStyle === 'gradient' ? 'white' : primaryColor};color:${section.config.backgroundStyle === 'dark' || section.config.backgroundStyle === 'gradient' ? primaryColor : 'white'};padding:1rem 2rem;border:none;border-radius:${borderRadius};font-size:1rem;font-weight:600;cursor:pointer">${section.config.buttonText}</button>
      ${section.config.secondaryButtonText ? `<button style="background:transparent;color:${section.config.backgroundStyle === 'dark' || section.config.backgroundStyle === 'gradient' ? 'white' : primaryColor};padding:1rem 2rem;border:2px solid ${section.config.backgroundStyle === 'dark' || section.config.backgroundStyle === 'gradient' ? 'white' : primaryColor};border-radius:${borderRadius};font-size:1rem;font-weight:600;cursor:pointer">${section.config.secondaryButtonText}</button>` : ''}
    </div>
  </div>
</section>`;

    case 'features':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem">
      ${(section.config.features || []).map((f: any) => `
        <div style="padding:2rem;border-radius:${borderRadius};border:1px solid #eee;text-align:left">
          <div style="width:48px;height:48px;background:${primaryColor}15;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:${primaryColor};font-size:1.5rem">✦</div>
          <h3 style="font-size:1.25rem;font-weight:600;margin-bottom:0.5rem">${f.title}</h3>
          <p style="opacity:0.7">${f.description}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'about':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center">
    <div>
      <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:1rem">${section.config.title}</h2>
      <p style="font-size:1.1rem;opacity:0.8;line-height:1.8;margin-bottom:2rem">${section.config.description}</p>
      <div style="display:flex;gap:2rem">
        ${(section.config.stats || []).map((s: any) => `
          <div><div style="font-size:2rem;font-weight:800;color:${primaryColor}">${s.value}</div><div style="font-size:0.875rem;opacity:0.7">${s.label}</div></div>
        `).join('')}
      </div>
    </div>
    <div style="background:linear-gradient(135deg,${primaryColor}20,${secondaryColor}20);border-radius:${borderRadius};height:400px;display:flex;align-items:center;justify-content:center;font-size:3rem">📸</div>
  </div>
</section>`;

    case 'testimonials':
      return `
<section style="padding:5rem 2rem;background:${secondaryColor}08;font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem">
      ${(section.config.testimonials || []).map((t: any) => `
        <div style="padding:2rem;background:${backgroundColor};border-radius:${borderRadius};box-shadow:0 4px 20px rgba(0,0,0,0.05);text-align:left">
          <p style="font-style:italic;margin-bottom:1.5rem;opacity:0.8">"${t.content}"</p>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <div style="width:40px;height:40px;background:${primaryColor};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600">${t.avatar}</div>
            <div><div style="font-weight:600">${t.name}</div><div style="font-size:0.875rem;opacity:0.6">${t.role}</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'products':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem">
      ${(section.config.products || []).map((p: any) => `
        <div style="border-radius:${borderRadius};overflow:hidden;border:1px solid #eee">
          <div style="height:250px;background:linear-gradient(135deg,${primaryColor}10,${secondaryColor}10);display:flex;align-items:center;justify-content:center;font-size:3rem">🛍️</div>
          <div style="padding:1.5rem;text-align:left">
            ${p.tag ? `<span style="font-size:0.75rem;background:${primaryColor};color:white;padding:0.25rem 0.75rem;border-radius:20px">${p.tag}</span>` : ''}
            <h3 style="font-size:1.1rem;font-weight:600;margin:0.5rem 0">${p.name}</h3>
            ${section.config.showPrice !== false ? `<p style="font-size:1.25rem;font-weight:700;color:${primaryColor}">${p.price}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'pricing':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;align-items:start">
      ${(section.config.plans || []).map((p: any) => `
        <div style="padding:2.5rem;border-radius:${borderRadius};border:${p.highlighted ? `2px solid ${primaryColor}` : '1px solid #eee'};${p.highlighted ? `box-shadow:0 8px 30px ${primaryColor}20` : ''}">
          ${p.highlighted ? `<span style="font-size:0.75rem;background:${primaryColor};color:white;padding:0.25rem 0.75rem;border-radius:20px">Popular</span>` : ''}
          <h3 style="font-size:1.25rem;font-weight:600;margin:1rem 0 0.5rem">${p.name}</h3>
          <div style="font-size:3rem;font-weight:800;color:${primaryColor}">${p.price}<span style="font-size:1rem;opacity:0.6">${p.period}</span></div>
          <ul style="list-style:none;padding:0;margin:1.5rem 0;text-align:left">
            ${p.features.map((f: string) => `<li style="padding:0.5rem 0;border-bottom:1px solid #f0f0f0">✓ ${f}</li>`).join('')}
          </ul>
          <button style="width:100%;padding:0.75rem;background:${p.highlighted ? primaryColor : 'transparent'};color:${p.highlighted ? 'white' : primaryColor};border:${p.highlighted ? 'none' : `2px solid ${primaryColor}`};border-radius:${borderRadius};font-weight:600;cursor:pointer">Get Started</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'cta':
      return `
<section style="padding:5rem 2rem;background:linear-gradient(135deg,${primaryColor},${secondaryColor});font-family:${fontFamily};color:white;text-align:center">
  <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:1rem">${section.config.title}</h2>
  <p style="font-size:1.2rem;opacity:0.9;margin-bottom:2rem;max-width:600px;margin-left:auto;margin-right:auto">${section.config.subtitle}</p>
  <div style="display:flex;gap:1rem;justify-content:center">
    <button style="background:white;color:${primaryColor};padding:1rem 2rem;border:none;border-radius:${borderRadius};font-size:1rem;font-weight:600;cursor:pointer">${section.config.buttonText}</button>
    ${section.config.secondaryText ? `<button style="background:transparent;color:white;padding:1rem 2rem;border:2px solid white;border-radius:${borderRadius};font-size:1rem;font-weight:600;cursor:pointer">${section.config.secondaryText}</button>` : ''}
  </div>
</section>`;

    case 'contact':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:800px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;text-align:left">
      <div>
        <p style="margin-bottom:1rem"><strong>Email:</strong> ${section.config.email}</p>
        <p style="margin-bottom:1rem"><strong>Phone:</strong> ${section.config.phone}</p>
        <p><strong>Address:</strong> ${section.config.address}</p>
      </div>
      ${section.config.showForm ? `
      <div style="display:flex;flex-direction:column;gap:1rem">
        <input type="text" placeholder="Your Name" style="padding:0.75rem;border:1px solid #ddd;border-radius:${borderRadius};font-family:${fontFamily}">
        <input type="email" placeholder="Your Email" style="padding:0.75rem;border:1px solid #ddd;border-radius:${borderRadius};font-family:${fontFamily}">
        <textarea placeholder="Your Message" rows="4" style="padding:0.75rem;border:1px solid #ddd;border-radius:${borderRadius};font-family:${fontFamily}"></textarea>
        <button style="background:${primaryColor};color:white;padding:0.75rem;border:none;border-radius:${borderRadius};font-weight:600;cursor:pointer">Send Message</button>
      </div>` : ''}
    </div>
  </div>
</section>`;

    case 'footer':
      return `
<footer style="padding:4rem 2rem 2rem;background:#1a1a2e;color:white;font-family:${fontFamily}">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem">
    <div>
      <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">${section.config.brandName}</h3>
      <p style="opacity:0.7">${section.config.description}</p>
    </div>
    ${Object.entries(section.config.links || {}).map(([title, items]: [string, any]) => `
      <div>
        <h4 style="font-weight:600;margin-bottom:1rem">${title}</h4>
        <ul style="list-style:none;padding:0">
          ${items.map((item: string) => `<li style="margin-bottom:0.5rem"><a href="#" style="color:white;opacity:0.7;text-decoration:none">${item}</a></li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
  <div style="max-width:1200px;margin:2rem auto 0;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.1);text-align:center;opacity:0.5;font-size:0.875rem">
    © ${new Date().getFullYear()} ${section.config.brandName}. All rights reserved.
  </div>
</footer>`;

    case 'stats':
      return `
<section style="padding:4rem 2rem;background:${primaryColor};color:white;font-family:${fontFamily}">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center">
    ${(section.config.stats || []).map((s: any) => `
      <div><div style="font-size:2.5rem;font-weight:800">${s.value}</div><div style="opacity:0.8;margin-top:0.5rem">${s.label}</div></div>
    `).join('')}
  </div>
</section>`;

    case 'faq':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:800px;margin:0 auto">
    <h2 style="font-size:2.5rem;font-weight:700;text-align:center;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;text-align:center;margin-bottom:3rem">${section.config.subtitle}</p>
    ${(section.config.questions || []).map((q: any) => `
      <div style="border:1px solid #eee;border-radius:${borderRadius};padding:1.5rem;margin-bottom:1rem">
        <h3 style="font-weight:600;margin-bottom:0.5rem">${q.question}</h3>
        <p style="opacity:0.7">${q.answer}</p>
      </div>
    `).join('')}
  </div>
</section>`;

    case 'gallery':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(${section.config.columns || 3},1fr);gap:1rem">
      ${(section.config.images || []).map((_: any, i: number) => `
        <div style="height:250px;background:linear-gradient(135deg,${primaryColor}${(10 + i * 5).toString(16)},${secondaryColor}${(10 + i * 5).toString(16)});border-radius:${borderRadius};display:flex;align-items:center;justify-content:center;font-size:2rem">📷</div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'team':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem">
      ${(section.config.members || []).map((m: any) => `
        <div style="text-align:center">
          <div style="width:100px;height:100px;background:linear-gradient(135deg,${primaryColor},${secondaryColor});border-radius:50%;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;font-weight:700">${m.name[0]}</div>
          <h3 style="font-weight:600">${m.name}</h3>
          <p style="color:${primaryColor};font-size:0.875rem;margin-bottom:0.5rem">${m.role}</p>
          <p style="font-size:0.875rem;opacity:0.7">${m.bio}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case 'newsletter':
      return `
<section style="padding:4rem 2rem;background:${secondaryColor}10;font-family:${fontFamily};color:${textColor};text-align:center">
  <h2 style="font-size:2rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
  <p style="opacity:0.7;margin-bottom:2rem">${section.config.subtitle}</p>
  <div style="display:flex;gap:0.5rem;max-width:400px;margin:0 auto">
    <input type="email" placeholder="${section.config.placeholder}" style="flex:1;padding:0.75rem 1rem;border:1px solid #ddd;border-radius:${borderRadius};font-family:${fontFamily}">
    <button style="background:${primaryColor};color:white;padding:0.75rem 1.5rem;border:none;border-radius:${borderRadius};font-weight:600;cursor:pointer">${section.config.buttonText}</button>
  </div>
</section>`;

    case 'services':
      return `
<section style="padding:5rem 2rem;background:${backgroundColor};font-family:${fontFamily};color:${textColor}">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">${section.config.title}</h2>
    <p style="font-size:1.1rem;opacity:0.7;margin-bottom:3rem">${section.config.subtitle}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem">
      ${(section.config.services || []).map((s: any) => `
        <div style="padding:2rem;border-radius:${borderRadius};background:${secondaryColor}08;text-align:center">
          <div style="width:56px;height:56px;background:${primaryColor};border-radius:50%;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem">✦</div>
          <h3 style="font-size:1.25rem;font-weight:600;margin-bottom:0.5rem">${s.title}</h3>
          <p style="opacity:0.7">${s.description}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    default:
      return `<section style="padding:3rem;text-align:center">Section: ${section.type}</section>`;
  }
}

export function generateFullHTML(website: WebsiteConfig): string {
  const { themeSettings, seo, siteName } = website;
  const sectionsHTML = website.sections.map(s => sectionToHTML(s, themeSettings)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title || siteName}</title>
  <meta name="description" content="${seo.description}">
  <meta property="og:title" content="${seo.ogTitle}">
  <meta property="og:description" content="${seo.ogDescription}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${themeSettings.fontFamily}, sans-serif; }
    @media (max-width: 768px) {
      section > div { grid-template-columns: 1fr !important; }
      nav { flex-direction: column; gap: 1rem; }
      h1 { font-size: 2rem !important; }
    }
  </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;
}

export function generateReactCode(website: WebsiteConfig): string {
  return `// Generated by SiteForge AI
import React from 'react';

export default function Website() {
  return (
    <div className="website">
      ${website.sections.map(s => `{/* ${s.type} section */}`).join('\n      ')}
    </div>
  );
}

// Website: ${website.siteName}
// Industry: ${website.industry}
// Style: ${website.style}
// Sections: ${website.sections.map(s => s.type).join(', ')}`;
}

export function downloadHTML(website: WebsiteConfig) {
  const html = generateFullHTML(website);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${website.siteName.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(website: WebsiteConfig) {
  const json = JSON.stringify(website, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${website.siteName.toLowerCase().replace(/\s+/g, '-')}-config.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadZIP(website: WebsiteConfig) {
  // For MVP, download as HTML since we can't create ZIP in browser without libraries
  downloadHTML(website);
}
