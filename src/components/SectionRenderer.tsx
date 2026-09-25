import React from 'react';
import { Section, ThemeSettings } from '../types';

interface SectionRendererProps {
  section: Section;
  theme: ThemeSettings;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isPreview?: boolean;
}

export function SectionRenderer({ section, theme, isSelected, onSelect, isPreview }: SectionRendererProps) {
  const { primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, borderRadius, buttonStyle, spacing } = theme;
  const sp = spacing === 'compact' ? '3rem' : spacing === 'spacious' ? '6rem' : '4.5rem';
  const br = buttonStyle === 'pill' ? '9999px' : buttonStyle === 'square' ? '0px' : borderRadius;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect && !isPreview) {
      e.stopPropagation();
      onSelect(section.id);
    }
  };

  const wrapperClass = !isPreview ? `section-highlight ${isSelected ? 'selected' : ''}` : '';

  const content = renderSection(section, { primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, borderRadius: br, spacing: sp });

  if (isPreview) {
    return <div>{content}</div>;
  }

  return (
    <div className={wrapperClass} onClick={handleClick} data-section-id={section.id}>
      {content}
    </div>
  );
}

function renderSection(section: Section, t: { primaryColor: string; secondaryColor: string; backgroundColor: string; textColor: string; fontFamily: string; borderRadius: string; spacing: string }) {
  switch (section.type) {
    case 'navbar': return <NavbarSection config={section.config} t={t} />;
    case 'hero': return <HeroSection config={section.config} t={t} />;
    case 'features': return <FeaturesSection config={section.config} t={t} />;
    case 'about': return <AboutSection config={section.config} t={t} />;
    case 'services': return <ServicesSection config={section.config} t={t} />;
    case 'products': return <ProductsSection config={section.config} t={t} />;
    case 'pricing': return <PricingSection config={section.config} t={t} />;
    case 'testimonials': return <TestimonialsSection config={section.config} t={t} />;
    case 'gallery': return <GallerySection config={section.config} t={t} />;
    case 'team': return <TeamSection config={section.config} t={t} />;
    case 'faq': return <FAQSection config={section.config} t={t} />;
    case 'stats': return <StatsSection config={section.config} t={t} />;
    case 'cta': return <CTASection config={section.config} t={t} />;
    case 'contact': return <ContactSection config={section.config} t={t} />;
    case 'newsletter': return <NewsletterSection config={section.config} t={t} />;
    case 'footer': return <FooterSection config={section.config} t={t} />;
    default: return <div style={{ padding: '2rem', textAlign: 'center' }}>Unknown section: {section.type}</div>;
  }
}

function NavbarSection({ config, t }: { config: any; t: any }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: t.backgroundColor, borderBottom: '1px solid #eee', fontFamily: t.fontFamily, position: 'sticky', top: 0, zIndex: 50 }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: t.primaryColor }}>{config.brandName}</span>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {(config.links || []).map((l: string, i: number) => (
          <a key={i} href="#" style={{ color: t.textColor, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{l}</a>
        ))}
      </div>
      {config.showCTA && (
        <button style={{ background: t.primaryColor, color: 'white', padding: '0.5rem 1.5rem', border: 'none', borderRadius: t.borderRadius, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>{config.ctaText}</button>
      )}
    </nav>
  );
}

function HeroSection({ config, t }: { config: any; t: any }) {
  const isDark = config.backgroundStyle === 'dark';
  const isGradient = config.backgroundStyle === 'gradient';
  const bg = isDark ? '#1a1a2e' : isGradient ? `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` : t.backgroundColor;
  const fg = isDark || isGradient ? 'white' : t.textColor;

  return (
    <section style={{ padding: `${t.spacing} 2rem`, textAlign: config.alignment || 'left', background: bg, color: fg, fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '900px', margin: config.alignment === 'center' ? '0 auto' : '0' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{config.title}</h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', opacity: 0.85, marginBottom: '2rem', lineHeight: 1.6, maxWidth: '600px' }}>{config.subtitle}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: config.alignment === 'center' ? 'center' : 'flex-start' }}>
          <button style={{ background: isDark || isGradient ? 'white' : t.primaryColor, color: isDark || isGradient ? t.primaryColor : 'white', padding: '0.875rem 2rem', border: 'none', borderRadius: t.borderRadius, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>{config.buttonText}</button>
          {config.secondaryButtonText && (
            <button style={{ background: 'transparent', color: fg, padding: '0.875rem 2rem', border: `2px solid ${isDark || isGradient ? 'rgba(255,255,255,0.5)' : t.primaryColor}`, borderRadius: t.borderRadius, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>{config.secondaryButtonText}</button>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {(config.features || []).map((f: any, i: number) => (
            <div key={i} style={{ padding: '2rem', borderRadius: t.borderRadius, border: '1px solid #f0f0f0', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ width: '48px', height: '48px', background: `${t.primaryColor}12`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.25rem' }}>✦</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.95rem' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>{config.title}</h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.8, lineHeight: 1.8, marginBottom: '2rem' }}>{config.description}</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {(config.stats || []).map((s: any, i: number) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: t.primaryColor }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${t.primaryColor}15, ${t.secondaryColor}15)`, borderRadius: t.borderRadius, height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏢</div>
      </div>
    </section>
  );
}

function ServicesSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {(config.services || []).map((s: any, i: number) => (
            <div key={i} style={{ padding: '2rem', borderRadius: t.borderRadius, background: `${t.secondaryColor}08`, textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: t.primaryColor, borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>✦</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {(config.products || []).map((p: any, i: number) => (
            <div key={i} style={{ borderRadius: t.borderRadius, overflow: 'hidden', border: '1px solid #f0f0f0', textAlign: 'left' }}>
              <div style={{ height: '220px', background: `linear-gradient(135deg, ${t.primaryColor}10, ${t.secondaryColor}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🛍️</div>
              <div style={{ padding: '1.25rem' }}>
                {p.tag && <span style={{ fontSize: '0.7rem', background: t.primaryColor, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 500 }}>{p.tag}</span>}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0.5rem 0 0.25rem' }}>{p.name}</h3>
                {config.showPrice !== false && <p style={{ fontSize: '1.2rem', fontWeight: 700, color: t.primaryColor }}>{p.price}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {(config.plans || []).map((p: any, i: number) => (
            <div key={i} style={{ padding: '2.5rem', borderRadius: t.borderRadius, border: p.highlighted ? `2px solid ${t.primaryColor}` : '1px solid #eee', boxShadow: p.highlighted ? `0 8px 30px ${t.primaryColor}15` : 'none', textAlign: 'left' }}>
              {p.highlighted && <span style={{ fontSize: '0.7rem', background: t.primaryColor, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 500 }}>Most Popular</span>}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: p.highlighted ? '1rem 0 0.5rem' : '0 0 0.5rem' }}>{p.name}</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 800, color: t.primaryColor }}>{p.price}<span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 400 }}>{p.period}</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0' }}>
                {p.features.map((f: string, j: number) => (
                  <li key={j} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' }}>✓ {f}</li>
                ))}
              </ul>
              <button style={{ width: '100%', padding: '0.75rem', background: p.highlighted ? t.primaryColor : 'transparent', color: p.highlighted ? 'white' : t.primaryColor, border: p.highlighted ? 'none' : `2px solid ${t.primaryColor}`, borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: `${t.secondaryColor}06`, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(config.testimonials || []).map((test: any, i: number) => (
            <div key={i} style={{ padding: '2rem', background: t.backgroundColor, borderRadius: t.borderRadius, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', opacity: 0.8, lineHeight: 1.7 }}>"{test.content}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', background: t.primaryColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{test.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{test.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${config.columns || 3}, 1fr)`, gap: '1rem' }}>
          {(config.images || []).map((_: any, i: number) => (
            <div key={i} style={{ height: '220px', background: `linear-gradient(135deg, ${t.primaryColor}15, ${t.secondaryColor}15)`, borderRadius: t.borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📷</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {(config.members || []).map((m: any, i: number) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '90px', height: '90px', background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 700 }}>{m.name[0]}</div>
              <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{m.name}</h3>
              <p style={{ color: t.primaryColor, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{m.role}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, textAlign: 'center', marginBottom: '3rem' }}>{config.subtitle}</p>
        {(config.questions || []).map((q: any, i: number) => (
          <div key={i} style={{ border: '1px solid #f0f0f0', borderRadius: t.borderRadius, padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>{q.question}</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.95rem' }}>{q.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: '3.5rem 2rem', background: t.primaryColor, color: 'white', fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        {(config.stats || []).map((s: any, i: number) => (
          <div key={i}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, color: 'white', fontFamily: t.fontFamily, textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>{config.title}</h2>
      <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>{config.subtitle}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{ background: 'white', color: t.primaryColor, padding: '0.875rem 2rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>{config.buttonText}</button>
        {config.secondaryText && (
          <button style={{ background: 'transparent', color: 'white', padding: '0.875rem 2rem', border: '2px solid rgba(255,255,255,0.5)', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>{config.secondaryText}</button>
        )}
      </div>
    </section>
  );
}

function ContactSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', textAlign: 'left' }}>
          <div>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}><strong>Email:</strong> {config.email}</p>
            <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}><strong>Phone:</strong> {config.phone}</p>
            <p style={{ fontSize: '0.95rem' }}><strong>Address:</strong> {config.address}</p>
          </div>
          {config.showForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Your Name" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.9rem' }} />
              <input type="email" placeholder="Your Email" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.9rem' }} />
              <textarea placeholder="Your Message" rows={4} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.9rem', resize: 'vertical' }} />
              <button style={{ background: t.primaryColor, color: 'white', padding: '0.75rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer' }}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ config, t }: { config: any; t: any }) {
  return (
    <section style={{ padding: '3.5rem 2rem', background: `${t.secondaryColor}08`, fontFamily: t.fontFamily, color: t.textColor, textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>{config.subtitle}</p>
      <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px', margin: '0 auto' }}>
        <input type="email" placeholder={config.placeholder} style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.9rem' }} />
        <button style={{ background: t.primaryColor, color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{config.buttonText}</button>
      </div>
    </section>
  );
}

function FooterSection({ config, t }: { config: any; t: any }) {
  return (
    <footer style={{ padding: '4rem 2rem 2rem', background: '#1a1a2e', color: 'white', fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
        <div style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{config.brandName}</h3>
          <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>{config.description}</p>
        </div>
        {Object.entries(config.links || {}).map(([title, items]: [string, any], i: number) => (
          <div key={i}>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>{title}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {items.map((item: string, j: number) => (
                <li key={j} style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '0.875rem' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} {config.brandName}. All rights reserved.
      </div>
    </footer>
  );
}
