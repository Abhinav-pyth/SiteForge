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

  const cls = !isPreview ? `section-item ${isSelected ? 'selected' : ''}` : '';
  const t = { primaryColor, secondaryColor, backgroundColor, textColor, fontFamily, borderRadius: br, spacing: sp };
  const content = renderSection(section, t);

  if (isPreview) return <div>{content}</div>;
  return <div className={cls} onClick={handleClick} data-section-id={section.id}>{content}</div>;
}

function renderSection(section: Section, t: any) {
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
    default: return <div style={{ padding: '2rem', textAlign: 'center' }}>{section.type}</div>;
  }
}

function NavbarSection({ config, t }: any) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: t.backgroundColor, borderBottom: '1px solid #f0f0f0', fontFamily: t.fontFamily }}>
      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: t.primaryColor }}>{config.brandName}</span>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {(config.links || []).map((l: string, i: number) => (
          <a key={i} href="#" style={{ color: t.textColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>{l}</a>
        ))}
      </div>
      {config.showCTA && (
        <button style={{ background: t.primaryColor, color: '#fff', padding: '0.4rem 1.2rem', border: 'none', borderRadius: t.borderRadius, cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem' }}>{config.ctaText}</button>
      )}
    </nav>
  );
}

function HeroSection({ config, t }: any) {
  const isDark = config.backgroundStyle === 'dark';
  const isGradient = config.backgroundStyle === 'gradient';
  const bg = isDark ? '#111827' : isGradient ? t.primaryColor : t.backgroundColor;
  const fg = isDark || isGradient ? '#ffffff' : t.textColor;

  return (
    <section style={{ padding: `${t.spacing} 2rem`, textAlign: config.alignment || 'left', background: bg, color: fg, fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '800px', margin: config.alignment === 'center' ? '0 auto' : '0' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{config.title}</h1>
        <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', opacity: 0.75, marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '550px' }}>{config.subtitle}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: config.alignment === 'center' ? 'center' : 'flex-start' }}>
          <button style={{ background: isDark || isGradient ? '#fff' : t.primaryColor, color: isDark || isGradient ? t.primaryColor : '#fff', padding: '0.7rem 1.5rem', border: 'none', borderRadius: t.borderRadius, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>{config.buttonText}</button>
          {config.secondaryButtonText && (
            <button style={{ background: 'transparent', color: fg, padding: '0.7rem 1.5rem', border: `1.5px solid ${isDark || isGradient ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}`, borderRadius: t.borderRadius, fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>{config.secondaryButtonText}</button>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {(config.features || []).map((f: any, i: number) => (
            <div key={i} style={{ padding: '1.5rem', borderRadius: t.borderRadius, border: '1px solid #f3f4f6', textAlign: 'left' }}>
              <div style={{ width: '36px', height: '36px', background: `${t.primaryColor}10`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', fontSize: '1rem' }}>✦</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{f.title}</h3>
              <p style={{ opacity: 0.6, lineHeight: 1.5, fontSize: '0.85rem' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>{config.title}</h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.7, marginBottom: '1.5rem' }}>{config.description}</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {(config.stats || []).map((s: any, i: number) => (
              <div key={i}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.primaryColor }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#f9fafb', borderRadius: t.borderRadius, height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏢</div>
      </div>
    </section>
  );
}

function ServicesSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {(config.services || []).map((s: any, i: number) => (
            <div key={i} style={{ padding: '1.5rem', borderRadius: t.borderRadius, background: '#f9fafb', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', background: t.primaryColor, borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>✦</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{s.title}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.5 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {(config.products || []).map((p: any, i: number) => (
            <div key={i} style={{ borderRadius: t.borderRadius, overflow: 'hidden', border: '1px solid #f3f4f6', textAlign: 'left' }}>
              <div style={{ height: '180px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🛍️</div>
              <div style={{ padding: '1rem' }}>
                {p.tag && <span style={{ fontSize: '0.65rem', background: t.primaryColor, color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 500 }}>{p.tag}</span>}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0.35rem 0 0.2rem' }}>{p.name}</h3>
                {config.showPrice !== false && <p style={{ fontSize: '1.05rem', fontWeight: 700, color: t.primaryColor }}>{p.price}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {(config.plans || []).map((p: any, i: number) => (
            <div key={i} style={{ padding: '2rem', borderRadius: t.borderRadius, border: p.highlighted ? `2px solid ${t.primaryColor}` : '1px solid #f3f4f6', textAlign: 'left' }}>
              {p.highlighted && <span style={{ fontSize: '0.65rem', background: t.primaryColor, color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 500 }}>Popular</span>}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: p.highlighted ? '0.75rem 0 0.4rem' : '0 0 0.4rem' }}>{p.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: t.primaryColor }}>{p.price}<span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 400 }}>{p.period}</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.25rem 0' }}>
                {p.features.map((f: string, j: number) => (
                  <li key={j} style={{ padding: '0.4rem 0', borderBottom: '1px solid #f9fafb', fontSize: '0.8rem' }}>✓ {f}</li>
                ))}
              </ul>
              <button style={{ width: '100%', padding: '0.6rem', background: p.highlighted ? t.primaryColor : 'transparent', color: p.highlighted ? '#fff' : t.primaryColor, border: p.highlighted ? 'none' : `1.5px solid ${t.primaryColor}`, borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: '#f9fafb', fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {(config.testimonials || []).map((test: any, i: number) => (
            <div key={i} style={{ padding: '1.5rem', background: t.backgroundColor, borderRadius: t.borderRadius, border: '1px solid #f3f4f6', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '1rem', opacity: 0.7, lineHeight: 1.6, fontSize: '0.9rem' }}>"{test.content}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', background: t.primaryColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.75rem' }}>{test.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{test.name}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${config.columns || 3}, 1fr)`, gap: '0.75rem' }}>
          {(config.images || []).map((_: any, i: number) => (
            <div key={i} style={{ height: '180px', background: '#f3f4f6', borderRadius: t.borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {(config.members || []).map((m: any, i: number) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', background: t.primaryColor, borderRadius: '50%', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{m.name[0]}</div>
              <h3 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.name}</h3>
              <p style={{ color: t.primaryColor, fontSize: '0.75rem', marginBottom: '0.3rem' }}>{m.role}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, textAlign: 'center', marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, textAlign: 'center', marginBottom: '2.5rem' }}>{config.subtitle}</p>
        {(config.questions || []).map((q: any, i: number) => (
          <div key={i} style={{ borderBottom: '1px solid #f3f4f6', padding: '1rem 0' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.9rem' }}>{q.question}</h3>
            <p style={{ opacity: 0.6, lineHeight: 1.5, fontSize: '0.85rem' }}>{q.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection({ config, t }: any) {
  return (
    <section style={{ padding: '3rem 2rem', background: t.primaryColor, color: '#fff', fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
        {(config.stats || []).map((s: any, i: number) => (
          <div key={i}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ opacity: 0.75, marginTop: '0.25rem', fontSize: '0.8rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.primaryColor, color: '#fff', fontFamily: t.fontFamily, textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.75rem' }}>{config.title}</h2>
      <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>{config.subtitle}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{ background: '#fff', color: t.primaryColor, padding: '0.7rem 1.5rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>{config.buttonText}</button>
        {config.secondaryText && (
          <button style={{ background: 'transparent', color: '#fff', padding: '0.7rem 1.5rem', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: t.borderRadius, fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>{config.secondaryText}</button>
        )}
      </div>
    </section>
  );
}

function ContactSection({ config, t }: any) {
  return (
    <section style={{ padding: t.spacing + ' 2rem', background: t.backgroundColor, fontFamily: t.fontFamily, color: t.textColor }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2.5rem' }}>{config.subtitle}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', textAlign: 'left' }}>
          <div>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}><strong>Email:</strong> {config.email}</p>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}><strong>Phone:</strong> {config.phone}</p>
            <p style={{ fontSize: '0.85rem' }}><strong>Address:</strong> {config.address}</p>
          </div>
          {config.showForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="text" placeholder="Name" style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.8rem' }} />
              <input type="email" placeholder="Email" style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.8rem' }} />
              <textarea placeholder="Message" rows={3} style={{ padding: '0.6rem', border: '1px solid #e5e7eb', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.8rem', resize: 'vertical' }} />
              <button style={{ background: t.primaryColor, color: '#fff', padding: '0.6rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Send</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ config, t }: any) {
  return (
    <section style={{ padding: '3rem 2rem', background: '#f9fafb', fontFamily: t.fontFamily, color: t.textColor, textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>{config.title}</h2>
      <p style={{ opacity: 0.6, marginBottom: '1.25rem', fontSize: '0.9rem' }}>{config.subtitle}</p>
      <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '380px', margin: '0 auto' }}>
        <input type="email" placeholder={config.placeholder} style={{ flex: 1, padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: t.borderRadius, fontFamily: t.fontFamily, fontSize: '0.8rem' }} />
        <button style={{ background: t.primaryColor, color: '#fff', padding: '0.6rem 1.25rem', border: 'none', borderRadius: t.borderRadius, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{config.buttonText}</button>
      </div>
    </section>
  );
}

function FooterSection({ config, t }: any) {
  return (
    <footer style={{ padding: '3rem 2rem 1.5rem', background: '#111827', color: '#fff', fontFamily: t.fontFamily }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{config.brandName}</h3>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', lineHeight: 1.6 }}>{config.description}</p>
        </div>
        {Object.entries(config.links || {}).map(([title, items]: [string, any], i: number) => (
          <div key={i}>
            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.85rem' }}>{title}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {items.map((item: string, j: number) => (
                <li key={j} style={{ marginBottom: '0.4rem' }}>
                  <a href="#" style={{ color: '#fff', opacity: 0.6, textDecoration: 'none', fontSize: '0.8rem' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: '1100px', margin: '1.5rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} {config.brandName}. All rights reserved.
      </div>
    </footer>
  );
}
