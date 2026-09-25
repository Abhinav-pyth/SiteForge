import { WebsiteConfig, Section, SectionType, ThemeSettings, THEME_PRESETS } from '../types';

let idCounter = 0;
function generateId(): string {
  return `section_${Date.now()}_${++idCounter}`;
}

function detectIndustry(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe') || lower.includes('coffee')) return 'Restaurant';
  if (lower.includes('saas') || lower.includes('software') || lower.includes('app') || lower.includes('startup')) return 'SaaS';
  if (lower.includes('portfolio') || lower.includes('personal') || lower.includes('freelance')) return 'Portfolio';
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shop') || lower.includes('store') || lower.includes('product')) return 'E-commerce';
  if (lower.includes('agency') || lower.includes('studio') || lower.includes('design')) return 'Agency';
  if (lower.includes('blog') || lower.includes('magazine') || lower.includes('news')) return 'Blog';
  if (lower.includes('real estate') || lower.includes('property') || lower.includes('villa') || lower.includes('home')) return 'Real Estate';
  if (lower.includes('education') || lower.includes('school') || lower.includes('course') || lower.includes('learn')) return 'Education';
  if (lower.includes('fashion') || lower.includes('footwear') || lower.includes('clothing') || lower.includes('brand')) return 'Fashion';
  if (lower.includes('health') || lower.includes('medical') || lower.includes('doctor') || lower.includes('clinic')) return 'Healthcare';
  if (lower.includes('event') || lower.includes('conference') || lower.includes('wedding')) return 'Event';
  return 'Business';
}

function detectStyle(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('luxury') || lower.includes('premium') || lower.includes('elegant')) return 'Luxury';
  if (lower.includes('modern') || lower.includes('contemporary') || lower.includes('clean')) return 'Modern';
  if (lower.includes('minimal') || lower.includes('simple') || lower.includes('clean')) return 'Minimal';
  if (lower.includes('bold') || lower.includes('strong') || lower.includes('dark')) return 'Bold';
  if (lower.includes('creative') || lower.includes('artistic') || lower.includes('colorful')) return 'Creative';
  if (lower.includes('professional') || lower.includes('corporate') || lower.includes('business')) return 'Corporate';
  if (lower.includes('playful') || lower.includes('fun') || lower.includes('youthful')) return 'Playful';
  return 'Modern';
}

function detectTheme(prompt: string): string {
  const style = detectStyle(prompt);
  const map: Record<string, string> = {
    'Luxury': 'luxury',
    'Modern': 'modern',
    'Minimal': 'minimal',
    'Bold': 'bold',
    'Creative': 'creative',
    'Corporate': 'corporate',
    'Playful': 'modern',
  };
  return map[style] || 'modern';
}

function extractSiteName(prompt: string): string {
  const patterns = [
    /(?:brand|company|called|named|for)\s+([A-Z][a-zA-Z]+)/i,
    /(?:for|at)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) return match[1];
  }
  const industries: Record<string, string[]> = {
    'Restaurant': ['Saffron Kitchen', 'The Golden Plate', 'Spice Route'],
    'SaaS': ['CloudFlow', 'DataSync', 'NexGen AI'],
    'Portfolio': ['Alex Chen', 'Sarah Miller', 'John Developer'],
    'E-commerce': ['ShopVibe', 'TrendMart', 'StyleHub'],
    'Agency': ['Pixel Studio', 'Creative Co', 'Design Lab'],
    'Fashion': ['Zivbelle', 'Luxe Wear', 'Elegance'],
    'Real Estate': ['Prestige Homes', 'Luxury Estates', 'Prime Properties'],
    'Education': ['LearnHub', 'EduPro', 'Skill Academy'],
    'Healthcare': ['MediCare Plus', 'HealthFirst', 'Wellness Clinic'],
    'Event': ['EventPro', 'Grand Celebrations', 'MomentMakers'],
    'Blog': ['The Daily Digest', 'Thought Hub', 'Insight Journal'],
    'Business': ['Apex Solutions', 'Prime Corp', 'Elite Business'],
  };
  const industry = detectIndustry(prompt);
  const names = industries[industry] || industries['Business'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateHeroSection(siteName: string, industry: string, style: string): Section {
  const headlines: Record<string, string[]> = {
    'Fashion': [`Elevate Your Style`, `Redefining Elegance`, `Luxury Redefined`],
    'Restaurant': [`A Culinary Journey`, `Taste the Extraordinary`, `Where Flavor Meets Art`],
    'SaaS': [`Transform Your Workflow`, `The Future of ${industry}`, `Build Smarter, Ship Faster`],
    'Portfolio': [`Crafting Digital Experiences`, `Creative Developer & Designer`, `Building the Future`],
    'E-commerce': [`Discover Amazing Products`, `Shop the Latest Trends`, `Your Style, Delivered`],
    'Agency': [`We Build Brands That Matter`, `Creative Excellence`, `Design. Develop. Deliver.`],
    'Real Estate': [`Find Your Dream Home`, `Luxury Living Awaits`, `Premium Properties`],
    'Education': [`Learn Without Limits`, `Unlock Your Potential`, `Education Reimagined`],
    'Healthcare': [`Your Health, Our Priority`, `Caring for You`, `Wellness Starts Here`],
    'Event': [`Create Unforgettable Moments`, `Events That Inspire`, `Celebrations Perfected`],
    'Blog': [`Insights That Matter`, `Stories Worth Reading`, `Knowledge Shared`],
    'Business': [`Driving Innovation Forward`, `Excellence in Every Detail`, `Your Success Partner`],
  };

  const subtitles: Record<string, string[]> = {
    'Fashion': [`Curated collections for the modern woman who demands elegance and sophistication in every step.`, `Handcrafted pieces that celebrate individuality and timeless beauty.`],
    'Restaurant': [`Experience authentic flavors crafted with passion and the finest ingredients.`, `Where every dish tells a story of tradition and innovation.`],
    'SaaS': [`Streamline your operations with our intelligent platform designed for modern teams.`, `The all-in-one solution that scales with your business needs.`],
    'Portfolio': [`Full-stack developer passionate about creating beautiful, functional web experiences.`, `Turning ideas into reality through code and creativity.`],
    'E-commerce': [`Discover products that combine quality, style, and value.`, `Shop the latest trends with confidence and convenience.`],
    'Agency': [`We combine strategy, design, and technology to create impactful brand experiences.`, `Partnering with ambitious brands to tell their story.`],
    'Real Estate': [`Discover exceptional properties in the world's most desirable locations.`, `Your gateway to luxury living and premium investments.`],
    'Education': [`World-class courses designed by industry experts to accelerate your career.`, `Learn at your own pace with cutting-edge curriculum.`],
    'Healthcare': [`Comprehensive healthcare services with a personal touch.`, `Advanced medical care in a comfortable, welcoming environment.`],
    'Event': [`From intimate gatherings to grand celebrations, we make every moment special.`, `Professional event planning that exceeds expectations.`],
    'Blog': [`Thoughtful articles on technology, design, and the future of digital.`, `Curated insights for the curious mind.`],
    'Business': [`Empowering businesses with innovative solutions and strategic expertise.`, `Partner with us to unlock your full potential.`],
  };

  const h = headlines[industry] || headlines['Business'];
  const s = subtitles[industry] || subtitles['Business'];

  return {
    id: generateId(),
    type: 'hero',
    config: {
      title: h[Math.floor(Math.random() * h.length)],
      subtitle: s[Math.floor(Math.random() * s.length)],
      buttonText: industry === 'E-commerce' ? 'Shop Now' : industry === 'Restaurant' ? 'View Menu' : 'Get Started',
      secondaryButtonText: 'Learn More',
      alignment: style === 'Luxury' ? 'center' : 'left',
      showImage: true,
      backgroundStyle: style === 'Bold' ? 'dark' : style === 'Luxury' ? 'gradient' : 'light',
    },
  };
}

function generateNavbar(siteName: string): Section {
  return {
    id: generateId(),
    type: 'navbar',
    config: {
      brandName: siteName,
      links: ['Home', 'About', 'Services', 'Contact'],
      showCTA: true,
      ctaText: 'Get Started',
    },
  };
}

function generateFooter(siteName: string): Section {
  return {
    id: generateId(),
    type: 'footer',
    config: {
      brandName: siteName,
      description: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
      links: {
        Company: ['About', 'Careers', 'Press', 'Blog'],
        Product: ['Features', 'Pricing', 'Security', 'Updates'],
        Support: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact'],
      },
    },
  };
}

function generateSectionsForIndustry(industry: string, style: string): SectionType[] {
  const sectionMap: Record<string, SectionType[]> = {
    'Fashion': ['hero', 'products', 'features', 'about', 'testimonials', 'newsletter', 'cta', 'footer'],
    'Restaurant': ['hero', 'features', 'about', 'gallery', 'testimonials', 'contact', 'footer'],
    'SaaS': ['hero', 'features', 'stats', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
    'Portfolio': ['hero', 'about', 'services', 'gallery', 'testimonials', 'contact', 'footer'],
    'E-commerce': ['hero', 'products', 'features', 'testimonials', 'newsletter', 'footer'],
    'Agency': ['hero', 'services', 'about', 'team', 'testimonials', 'cta', 'footer'],
    'Real Estate': ['hero', 'products', 'features', 'stats', 'testimonials', 'contact', 'footer'],
    'Education': ['hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
    'Healthcare': ['hero', 'services', 'about', 'team', 'testimonials', 'contact', 'footer'],
    'Event': ['hero', 'features', 'gallery', 'testimonials', 'pricing', 'contact', 'footer'],
    'Blog': ['hero', 'features', 'newsletter', 'footer'],
    'Business': ['hero', 'features', 'about', 'services', 'testimonials', 'cta', 'footer'],
  };
  return sectionMap[industry] || sectionMap['Business'];
}

function generateSectionConfig(type: SectionType, siteName: string, industry: string): Section {
  const configs: Record<SectionType, () => Record<string, any>> = {
    hero: () => generateHeroSection(siteName, industry, 'Modern').config,
    navbar: () => generateNavbar(siteName).config,
    features: () => ({
      title: 'Why Choose Us',
      subtitle: 'Everything you need to succeed',
      features: [
        { icon: 'zap', title: 'Lightning Fast', description: 'Optimized performance that keeps your users engaged and satisfied.' },
        { icon: 'shield', title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime guarantee.' },
        { icon: 'heart', title: 'Built with Care', description: 'Crafted with attention to every detail for the best experience.' },
        { icon: 'star', title: 'Premium Quality', description: 'Top-tier quality standards that exceed industry benchmarks.' },
      ],
      layout: 'grid',
    }),
    about: () => ({
      title: 'About Us',
      subtitle: 'Our story and mission',
      description: `At ${siteName}, we believe in delivering excellence. Founded with a passion for innovation, we've grown to become a trusted name in ${industry.toLowerCase()}. Our team of dedicated professionals works tirelessly to bring your vision to life.`,
      image: 'about',
      stats: [
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Happy Clients' },
        { value: '1000+', label: 'Projects Done' },
      ],
    }),
    services: () => ({
      title: 'Our Services',
      subtitle: 'What we offer',
      services: [
        { icon: 'palette', title: 'Design', description: 'Beautiful, intuitive designs that captivate your audience.' },
        { icon: 'code', title: 'Development', description: 'Robust, scalable solutions built with modern technology.' },
        { icon: 'megaphone', title: 'Marketing', description: 'Strategic campaigns that drive growth and engagement.' },
        { icon: 'headphones', title: 'Support', description: '24/7 dedicated support to keep you running smoothly.' },
      ],
    }),
    products: () => ({
      title: industry === 'Real Estate' ? 'Featured Properties' : industry === 'E-commerce' ? 'Best Sellers' : 'Our Products',
      subtitle: 'Discover our latest collection',
      products: [
        { name: 'Premium Collection', price: '$299', image: 'product1', tag: 'New' },
        { name: 'Classic Edition', price: '$199', image: 'product2', tag: 'Popular' },
        { name: 'Limited Series', price: '$449', image: 'product3', tag: 'Exclusive' },
        { name: 'Essential Pack', price: '$149', image: 'product4', tag: 'Sale' },
      ],
      showPrice: industry !== 'Real Estate',
    }),
    pricing: () => ({
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your needs',
      plans: [
        { name: 'Starter', price: '$9', period: '/month', features: ['5 Projects', 'Basic Analytics', 'Email Support', '1GB Storage'], highlighted: false },
        { name: 'Professional', price: '$29', period: '/month', features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', '50GB Storage', 'Custom Domain', 'API Access'], highlighted: true },
        { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom Integrations', 'Unlimited Storage', 'SLA Guarantee', 'Team Management'], highlighted: false },
      ],
    }),
    testimonials: () => ({
      title: 'What Our Clients Say',
      subtitle: 'Trusted by hundreds of happy customers',
      testimonials: [
        { name: 'Sarah Johnson', role: 'CEO, TechStart', content: 'Absolutely transformed our online presence. The results exceeded all our expectations.', avatar: 'S' },
        { name: 'Michael Chen', role: 'Founder, DesignLab', content: 'Professional, creative, and incredibly responsive. They truly understand our vision.', avatar: 'M' },
        { name: 'Emily Rodriguez', role: 'Marketing Director', content: 'The best investment we made this year. Our conversion rates have doubled since launch.', avatar: 'E' },
      ],
    }),
    gallery: () => ({
      title: 'Our Work',
      subtitle: 'A showcase of our finest projects',
      images: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Project ${i + 1}`, category: industry })),
      columns: 3,
    }),
    team: () => ({
      title: 'Meet Our Team',
      subtitle: 'The talented people behind our success',
      members: [
        { name: 'Alex Thompson', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years of industry experience.' },
        { name: 'Maria Garcia', role: 'Creative Director', bio: 'Award-winning designer passionate about user experience.' },
        { name: 'David Kim', role: 'Lead Developer', bio: 'Full-stack engineer building scalable solutions.' },
        { name: 'Lisa Wang', role: 'Marketing Head', bio: 'Growth strategist driving brand awareness and engagement.' },
      ],
    }),
    faq: () => ({
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know',
      questions: [
        { question: 'How do I get started?', answer: 'Simply sign up for an account and choose a plan that fits your needs. You can start building immediately.' },
        { question: 'Is there a free trial?', answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.' },
        { question: 'Can I cancel anytime?', answer: 'Absolutely. You can cancel your subscription at any time with no hidden fees or penalties.' },
        { question: 'Do you offer custom solutions?', answer: 'Yes, our Enterprise plan includes custom integrations and dedicated support for unique requirements.' },
      ],
    }),
    stats: () => ({
      stats: [
        { value: '10K+', label: 'Active Users' },
        { value: '99.9%', label: 'Uptime' },
        { value: '150+', label: 'Countries' },
        { value: '24/7', label: 'Support' },
      ],
    }),
    cta: () => ({
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of satisfied customers and take your business to the next level.',
      buttonText: 'Start Free Trial',
      secondaryText: 'Contact Sales',
    }),
    contact: () => ({
      title: 'Get in Touch',
      subtitle: 'We\'d love to hear from you',
      email: 'hello@' + siteName.toLowerCase().replace(/\s+/g, '') + '.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Suite 100, San Francisco, CA 94102',
      showForm: true,
    }),
    newsletter: () => ({
      title: 'Stay Updated',
      subtitle: 'Subscribe to our newsletter for the latest updates and offers.',
      buttonText: 'Subscribe',
      placeholder: 'Enter your email address',
    }),
    footer: () => generateFooter(siteName).config,
  };

  return {
    id: generateId(),
    type,
    config: configs[type](),
  };
}

export function generateWebsite(prompt: string): WebsiteConfig {
  const industry = detectIndustry(prompt);
  const style = detectStyle(prompt);
  const theme = detectTheme(prompt);
  const siteName = extractSiteName(prompt);
  const sectionTypes = generateSectionsForIndustry(industry, style);

  const sections: Section[] = [
    generateNavbar(siteName),
    ...sectionTypes.map(type => generateSectionConfig(type, siteName, industry)),
  ];

  return {
    siteName,
    industry,
    style,
    theme,
    description: prompt,
    sections,
    seo: {
      title: `${siteName} - ${industry} Website`,
      description: `Welcome to ${siteName}. ${prompt}`,
      ogTitle: siteName,
      ogDescription: prompt,
      favicon: '',
      canonicalUrl: `https://${siteName.toLowerCase().replace(/\s+/g, '')}.com`,
    },
    themeSettings: { ...THEME_PRESETS[theme] },
  };
}

export function modifyWebsite(current: WebsiteConfig, instruction: string): WebsiteConfig {
  const lower = instruction.toLowerCase();
  const modified = JSON.parse(JSON.stringify(current)) as WebsiteConfig;

  // Theme changes
  if (lower.includes('dark') && (lower.includes('background') || lower.includes('mode') || lower.includes('theme'))) {
    modified.themeSettings.mode = 'dark';
    modified.themeSettings.backgroundColor = '#0f0f23';
    modified.themeSettings.textColor = '#e2e8f0';
  } else if (lower.includes('light') && (lower.includes('background') || lower.includes('mode') || lower.includes('theme'))) {
    modified.themeSettings.mode = 'light';
    modified.themeSettings.backgroundColor = '#ffffff';
    modified.themeSettings.textColor = '#1a1a1a';
  }

  // Color changes
  if (lower.includes('blue')) {
    modified.themeSettings.primaryColor = '#3b82f6';
  } else if (lower.includes('red')) {
    modified.themeSettings.primaryColor = '#ef4444';
  } else if (lower.includes('green')) {
    modified.themeSettings.primaryColor = '#22c55e';
  } else if (lower.includes('purple') || lower.includes('violet')) {
    modified.themeSettings.primaryColor = '#8b5cf6';
  } else if (lower.includes('pink')) {
    modified.themeSettings.primaryColor = '#ec4899';
  } else if (lower.includes('orange')) {
    modified.themeSettings.primaryColor = '#f97316';
  } else if (lower.includes('gold') || lower.includes('golden')) {
    modified.themeSettings.primaryColor = '#c9a96e';
    modified.themeSettings.secondaryColor = '#1a1a2e';
  }

  // Font changes
  if (lower.includes('modern font') || lower.includes('modern style font')) {
    modified.themeSettings.fontFamily = 'Inter';
  } else if (lower.includes('serif') || lower.includes('elegant font')) {
    modified.themeSettings.fontFamily = 'Playfair Display';
  }

  // Border radius
  if (lower.includes('rounded') || lower.includes('round')) {
    modified.themeSettings.buttonStyle = 'pill';
    modified.themeSettings.borderRadius = '16px';
  } else if (lower.includes('sharp') || lower.includes('square')) {
    modified.themeSettings.buttonStyle = 'square';
    modified.themeSettings.borderRadius = '0px';
  }

  // Add section
  if (lower.includes('add') && lower.includes('section')) {
    const sectionTypes: SectionType[] = ['testimonials', 'faq', 'pricing', 'gallery', 'team', 'stats', 'newsletter', 'cta', 'contact', 'features'];
    for (const type of sectionTypes) {
      if (lower.includes(type)) {
        const newSection = generateSectionConfig(type, modified.siteName, modified.industry);
        const footerIdx = modified.sections.findIndex(s => s.type === 'footer');
        if (footerIdx >= 0) {
          modified.sections.splice(footerIdx, 0, newSection);
        } else {
          modified.sections.push(newSection);
        }
        break;
      }
    }
    // Generic add
    if (!sectionTypes.some(t => lower.includes(t))) {
      if (lower.includes('testimonial')) {
        const newSection = generateSectionConfig('testimonials', modified.siteName, modified.industry);
        modified.sections.splice(modified.sections.length - 1, 0, newSection);
      } else if (lower.includes('faq')) {
        const newSection = generateSectionConfig('faq', modified.siteName, modified.industry);
        modified.sections.splice(modified.sections.length - 1, 0, newSection);
      } else if (lower.includes('contact')) {
        const newSection = generateSectionConfig('contact', modified.siteName, modified.industry);
        modified.sections.splice(modified.sections.length - 1, 0, newSection);
      } else if (lower.includes('gallery')) {
        const newSection = generateSectionConfig('gallery', modified.siteName, modified.industry);
        modified.sections.splice(modified.sections.length - 1, 0, newSection);
      }
    }
  }

  // Remove section
  if (lower.includes('remove') || lower.includes('delete')) {
    const sectionTypes: SectionType[] = ['testimonials', 'faq', 'pricing', 'gallery', 'team', 'stats', 'newsletter', 'cta', 'contact', 'features', 'about', 'services', 'products'];
    for (const type of sectionTypes) {
      if (lower.includes(type)) {
        modified.sections = modified.sections.filter(s => s.type !== type);
        break;
      }
    }
  }

  // Change headline
  if (lower.includes('headline') || lower.includes('title') || lower.includes('heading')) {
    const heroSection = modified.sections.find(s => s.type === 'hero');
    if (heroSection) {
      const match = instruction.match(/(?:headline|title|heading)\s+(?:to|as|:)\s*["']?([^"']+?)["']?$/i);
      if (match) {
        heroSection.config.title = match[1].trim();
      } else {
        heroSection.config.title = heroSection.config.title + ' ✨';
      }
    }
  }

  // Premium/luxury style
  if (lower.includes('premium') || lower.includes('luxury') || lower.includes('more elegant')) {
    modified.themeSettings.preset = 'luxury';
    modified.themeSettings.fontFamily = 'Playfair Display';
    modified.themeSettings.spacing = 'spacious';
    modified.themeSettings.primaryColor = '#1a1a2e';
    modified.themeSettings.secondaryColor = '#c9a96e';
    const hero = modified.sections.find(s => s.type === 'hero');
    if (hero) {
      hero.config.alignment = 'center';
      hero.config.backgroundStyle = 'gradient';
    }
  }

  // Professional
  if (lower.includes('professional') || lower.includes('corporate')) {
    modified.themeSettings.preset = 'corporate';
    modified.themeSettings.fontFamily = 'Inter';
    modified.themeSettings.primaryColor = '#1e40af';
    modified.themeSettings.secondaryColor = '#3b82f6';
  }

  // Mobile improvements
  if (lower.includes('mobile')) {
    modified.themeSettings.spacing = 'compact';
    modified.sections.forEach(s => {
      if (s.type === 'hero') {
        s.config.alignment = 'center';
      }
    });
  }

  // Spacing
  if (lower.includes('more space') || lower.includes('spacious') || lower.includes('breathing room')) {
    modified.themeSettings.spacing = 'spacious';
  } else if (lower.includes('compact') || lower.includes('less space') || lower.includes('tighter')) {
    modified.themeSettings.spacing = 'compact';
  }

  return modified;
}

export function generateAIResponse(instruction: string, website: WebsiteConfig): string {
  const lower = instruction.toLowerCase();

  if (lower.includes('dark') && (lower.includes('background') || lower.includes('mode'))) {
    return "I've switched your website to a dark theme. The background is now dark with light text for better contrast and a modern look.";
  }
  if (lower.includes('light') && (lower.includes('background') || lower.includes('mode'))) {
    return "I've switched to a light theme. Clean and bright for a professional appearance.";
  }
  if (lower.includes('color') || lower.includes('blue') || lower.includes('red') || lower.includes('green') || lower.includes('purple') || lower.includes('pink') || lower.includes('orange') || lower.includes('gold')) {
    const color = ['blue', 'red', 'green', 'purple', 'pink', 'orange', 'gold'].find(c => lower.includes(c)) || 'primary';
    return `I've updated the color scheme to ${color}. The primary accent color now reflects this throughout your website.`;
  }
  if (lower.includes('add') && lower.includes('section')) {
    return "I've added the new section to your website. You can see it in the preview and customize it further if needed.";
  }
  if (lower.includes('remove') || lower.includes('delete')) {
    return "I've removed that section from your website. The layout has been adjusted accordingly.";
  }
  if (lower.includes('premium') || lower.includes('luxury')) {
    return "I've elevated the design with a more premium feel — using elegant typography, luxurious spacing, and refined color palette.";
  }
  if (lower.includes('professional') || lower.includes('corporate')) {
    return "I've updated the design to look more professional and corporate — clean typography, structured layout, and business-appropriate colors.";
  }
  if (lower.includes('mobile')) {
    return "I've optimized the mobile experience with better spacing, centered content, and improved touch targets.";
  }
  if (lower.includes('rounded') || lower.includes('round')) {
    return "I've made the buttons and elements more rounded for a softer, modern appearance.";
  }
  if (lower.includes('font') || lower.includes('typography')) {
    return "I've updated the typography. The new font style gives your website a fresh, modern feel.";
  }
  if (lower.includes('headline') || lower.includes('title')) {
    return "I've updated the headline. It now better captures your brand's message.";
  }
  if (lower.includes('modern') || lower.includes('saas')) {
    return "I've given your website a modern SaaS look with clean lines, bold typography, and a contemporary color scheme.";
  }

  return "I've made the changes you requested. Take a look at the preview to see the updates. Let me know if you'd like any further adjustments!";
}

export function generateSection(type: SectionType, siteName: string, industry: string): Section {
  return generateSectionConfig(type, siteName, industry);
}
