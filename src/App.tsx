import { useState, useEffect, useRef } from 'react';
import { generateWebsite, modifyWebsite, generateAIResponse, generateSection } from './lib/ai';
import { templates, examplePrompts } from './lib/templates';
import { WebsiteConfig, Section, SectionType, Project, ChatMessage, ViewMode, ThemeSettings, THEME_PRESETS } from './types';
import {
  getState, subscribe, setState, initializeStore, pushHistory, undo, redo,
  saveProject, deleteProject, duplicateProject, renameProject, updateWebsite,
  selectSection, setView, setViewMode, updateTheme, addToast, autoSave
} from './lib/store';
import { generateFullHTML, generateReactCode, downloadHTML, downloadJSON } from './lib/export';
import { SectionRenderer } from './components/SectionRenderer';
import { TemplatePreview } from './components/TemplatePreview';
import {
  Sparkles, Monitor, Tablet, Smartphone, Code, Download, Send, Plus,
  Undo2, Redo2, Save, Trash2, Copy, ChevronUp, ChevronDown, X, Check,
  Palette, Settings, Globe, Layout, Layers, ArrowLeft, ArrowRight, GripVertical,
  Rocket, FileCode, Grid3X3, CreditCard, MessageCircle,
  FolderOpen, Edit3, Clock, CheckCircle2, AlertCircle, Info, Zap, MessageSquare
} from 'lucide-react';

function useStore() {
  const [state, setLocalState] = useState(getState());
  useEffect(() => {
    return subscribe(() => setLocalState({ ...getState() }));
  }, []);
  return state;
}

export default function App() {
  const state = useStore();

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); saveProject(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {state.view === 'landing' && <LandingView />}
      {state.view === 'builder' && <BuilderView />}
      {state.view === 'dashboard' && <DashboardView />}
      {state.view === 'templates' && <TemplatesView />}
      {state.view === 'pricing' && <PricingView />}
      <Toasts />
      {state.showAuthModal && <AuthModal />}
      {state.isGenerating && <GeneratingOverlay />}
      {state.isPublishing && <PublishingOverlay />}
      {state.view === 'builder' && state.showAddSection && <AddSectionModal />}
      {state.view === 'builder' && state.showThemePanel && <ThemePanel />}
      {state.view === 'builder' && state.showExportMenu && <ExportModal />}
    </div>
  );
}

// ============ LANDING VIEW ============
function LandingView() {
  const [prompt, setPrompt] = useState('');
  const state = useStore();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setState({ isGenerating: true, generationStep: 0 });
    simulateGeneration(prompt);
  };

  const handleExampleClick = (example: string) => {
    const template = templates.find(t => t.name === example);
    setPrompt(template?.prompt || `Create a ${example.toLowerCase()} website.`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('landing')} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-semibold">SiteForge AI</span>
              </button>
              <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => setView('dashboard')} className="text-sm text-neutral-600 hover:text-black transition">
                  Projects
                </button>
                <button onClick={() => setView('templates')} className="text-sm text-neutral-600 hover:text-black transition">
                  Templates
                </button>
                <button onClick={() => setView('pricing')} className="text-sm text-neutral-600 hover:text-black transition">
                  Pricing
                </button>
              </nav>
            </div>
            <button onClick={() => setState({ showAuthModal: true })} className="btn-primary text-sm">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-700 mb-8">
              <Sparkles size={14} />
              AI Website Builder
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build websites<br />with a sentence
            </h1>
            <p className="text-xl text-neutral-600 mb-12 leading-relaxed">
              Describe your idea. SiteForge AI turns it into a beautiful, responsive website in minutes.
            </p>

            {/* Prompt Box */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-2 shadow-lg max-w-2xl mx-auto">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Create a modern website for a luxury women's footwear brand with hero section, products, testimonials..."
                className="w-full p-4 text-base resize-none outline-none min-h-[120px] rounded-xl"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <div className="flex items-center justify-between p-2 border-t border-neutral-100">
                <button onClick={() => setView('templates')} className="text-sm text-neutral-600 hover:text-black flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition">
                  <Layout size={14} />
                  Browse Templates
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={16} />
                  Generate Website
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mt-12">
              <p className="text-sm text-neutral-500 mb-4">Try an example:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {examplePrompts.map((ep) => (
                  <button
                    key={ep}
                    onClick={() => handleExampleClick(ep)}
                    className="px-4 py-2 text-sm border border-neutral-200 rounded-full hover:border-neutral-400 hover:bg-white transition"
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white border-t border-neutral-200">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
            <p className="text-xl text-neutral-600">Powerful features to build your website in minutes</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: 'Instant Generation', desc: 'Describe your idea and generate a complete website in seconds' },
              { icon: Palette, title: 'AI Design', desc: 'AI automatically creates layouts, typography, colors and sections' },
              { icon: Layout, title: 'Visual Editing', desc: 'Modify sections and content without writing code' },
              { icon: MessageSquare, title: 'AI Editing', desc: 'Tell the AI what to change and instantly update the website' },
              { icon: Smartphone, title: 'Responsive Design', desc: 'Generate websites that work across desktop, tablet and mobile' },
              { icon: Download, title: 'Export Anywhere', desc: 'Download your website or prepare it for deployment' },
            ].map((feature, i) => (
              <div key={i} className="card p-8">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-neutral-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-24 border-t border-neutral-200">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Start with a template</h2>
            <p className="text-xl text-neutral-600">Choose from professionally designed templates</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {templates.slice(0, 6).map((template) => (
              <div key={template.id} className="card overflow-hidden group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <TemplatePreview templateId={template.id} className="group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{template.description}</p>
                  <button className="w-full btn-secondary text-sm">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setView('templates')}
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All Templates
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="container-page">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="font-semibold">SiteForge AI</span>
            </div>
            <p className="text-sm text-neutral-500">
              © 2024 SiteForge AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============ BUILDER VIEW ============
function BuilderView() {
  const state = useStore();
  if (!state.currentProject) return null;

  return (
    <div className="h-screen flex flex-col">
      <BuilderHeader />
      <div className="flex-1 flex overflow-hidden">
        <ChatPanel />
        <PreviewPanel />
        <PropertiesPanel />
      </div>
    </div>
  );
}

function BuilderHeader() {
  const state = useStore();
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-neutral-100 rounded-lg transition">
          <ArrowLeft size={18} />
        </button>
        <div className="h-6 w-px bg-neutral-200" />
        <button onClick={undo} className="p-2 hover:bg-neutral-100 rounded-lg transition" title="Undo">
          <Undo2 size={16} />
        </button>
        <button onClick={redo} className="p-2 hover:bg-neutral-100 rounded-lg transition" title="Redo">
          <Redo2 size={16} />
        </button>
        <button onClick={() => saveProject()} className="p-2 hover:bg-neutral-100 rounded-lg transition" title="Save">
          <Save size={16} />
        </button>
        <div className="h-6 w-px bg-neutral-200" />
        <span className="font-medium text-sm">{state.currentProject?.name || 'Untitled Project'}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setState({ showAddSection: true })} className="btn-secondary text-sm flex items-center gap-2">
          <Plus size={14} />
          Section
        </button>
        <button onClick={() => setState({ showThemePanel: true })} className="btn-secondary text-sm flex items-center gap-2">
          <Palette size={14} />
          Theme
        </button>
        <button onClick={() => setState({ showCodeView: !state.showCodeView })} className={`btn-secondary text-sm flex items-center gap-2 ${state.showCodeView ? 'bg-black text-white' : ''}`}>
          <Code size={14} />
          Code
        </button>
        <button onClick={() => setState({ showExportMenu: true })} className="btn-secondary text-sm flex items-center gap-2">
          <Download size={14} />
          Export
        </button>
        <button onClick={() => { setState({ isPublishing: true, publishStep: 0 }); simulatePublish(); }} className="btn-primary text-sm flex items-center gap-2">
          <Rocket size={14} />
          Publish
        </button>
      </div>
    </header>
  );
}

// Continue with remaining components...
// (Due to length, I'll create the rest in the next file)

function simulateGeneration(prompt: string) {
  const steps = 6;
  let step = 0;
  const interval = setInterval(() => {
    step++;
    setState({ generationStep: step });
    if (step >= steps) {
      clearInterval(interval);
      const website = generateWebsite(prompt);
      const project: Project = {
        id: `project_${Date.now()}`,
        name: website.siteName,
        description: prompt,
        website,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };
      const projects = [...getState().projects, project];
      setState({
        isGenerating: false,
        generationStep: 0,
        currentProject: project,
        projects,
        view: 'builder',
        chatMessages: [{ id: 'welcome', role: 'assistant', content: `I've created your website for "${website.siteName}". Ask me to make any changes.`, timestamp: new Date().toISOString() }],
        history: [{ website: JSON.parse(JSON.stringify(website)), timestamp: new Date().toISOString(), label: 'Initial generation' }],
        historyIndex: 0,
        selectedSectionId: null,
      });
      saveProject();
    }
  }, 450);
}

function simulatePublish() {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    setState({ publishStep: step });
    if (step >= 5) {
      clearInterval(interval);
      if (getState().currentProject) {
        const updated = { ...getState().currentProject!, status: 'published' as const };
        setState({ currentProject: updated });
        saveProject();
      }
    }
  }, 700);
}

// Placeholder components for modals and overlays
function Toasts() {
  const state = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {state.toasts.map(toast => (
        <div key={toast.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-black text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-white'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function AuthModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setState({ showAuthModal: false })}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <p className="text-neutral-600 mb-6">Welcome back to SiteForge AI</p>
        <button onClick={() => setState({ showAuthModal: false })} className="w-full btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}

function GeneratingOverlay() {
  const state = useStore();
  const steps = ['Understanding your idea', 'Planning structure', 'Creating sections', 'Designing layout', 'Generating content', 'Preparing preview'];
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Building your website</h2>
          <p className="text-sm text-neutral-500">This will take a moment...</p>
        </div>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-2.5 py-1.5 text-sm ${i <= state.generationStep ? 'text-black' : 'text-neutral-300'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < state.generationStep ? 'bg-black' : i === state.generationStep ? 'bg-black animate-pulse' : 'bg-neutral-200'}`}>
                {i < state.generationStep && <Check size={10} className="text-white" />}
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishingOverlay() {
  const state = useStore();
  const steps = ['Preparing website', 'Building project', 'Optimizing assets', 'Publishing', 'Done!'];
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="max-w-xs w-full px-6 text-center">
        {state.publishStep < steps.length - 1 ? (
          <>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
              <Rocket size={20} className="text-white" />
            </div>
            <h2 className="text-base font-semibold mb-1">Publishing</h2>
            <p className="text-xs text-neutral-500 mb-5">{steps[state.publishStep]}...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <h2 className="text-base font-semibold mb-1">Website is live!</h2>
            <button onClick={() => setState({ isPublishing: false, publishStep: 0 })} className="btn-primary mt-4">
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AddSectionModal() {
  const state = useStore();
  if (!state.showAddSection || !state.currentProject) return null;
  const sectionTypes: { type: SectionType; label: string; icon: string }[] = [
    { type: 'hero', label: 'Hero', icon: '🏔️' }, { type: 'features', label: 'Features', icon: '⭐' },
    { type: 'about', label: 'About', icon: 'ℹ️' }, { type: 'services', label: 'Services', icon: '🔧' },
    { type: 'products', label: 'Products', icon: '🛍️' }, { type: 'pricing', label: 'Pricing', icon: '💰' },
    { type: 'testimonials', label: 'Testimonials', icon: '💬' }, { type: 'gallery', label: 'Gallery', icon: '🖼️' },
    { type: 'team', label: 'Team', icon: '👥' }, { type: 'faq', label: 'FAQ', icon: '❓' },
    { type: 'stats', label: 'Stats', icon: '📊' }, { type: 'cta', label: 'CTA', icon: '📢' },
    { type: 'contact', label: 'Contact', icon: '📧' }, { type: 'newsletter', label: 'Newsletter', icon: '📰' },
  ];
  const addSection = (type: SectionType) => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    const newSection = generateSection(type, website.siteName, website.industry);
    website.sections.splice(website.sections.length - 1, 0, newSection);
    updateWebsite(website);
    pushHistory(website, `Add ${type} section`);
    setState({ showAddSection: false });
    addToast(`${type} added`, 'success');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setState({ showAddSection: false })}>
      <div className="bg-white rounded-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold">Add Section</h2>
          <button onClick={() => setState({ showAddSection: false })} className="p-1 hover:bg-neutral-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
          {sectionTypes.map(st => (
            <button key={st.type} onClick={() => addSection(st.type)} className="p-3 rounded-lg border border-neutral-200 hover:border-black hover:bg-neutral-50 transition text-center">
              <span className="text-2xl block mb-1">{st.icon}</span>
              <span className="text-xs font-medium text-neutral-600">{st.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePanel() {
  const state = useStore();
  if (!state.showThemePanel || !state.currentProject) return null;
  const theme = state.currentProject.website.themeSettings;
  const updateThemeSetting = (key: keyof ThemeSettings, value: any) => {
    updateTheme({ ...theme, [key]: value });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setState({ showThemePanel: false })}>
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-semibold">Theme</h2>
          <button onClick={() => setState({ showThemePanel: false })} className="p-1 hover:bg-neutral-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-2 block">Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                <button key={key} onClick={() => updateTheme(preset)} className={`p-2 rounded-lg border text-xs font-medium ${theme.preset === key ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                  <div className="w-full h-3 rounded-sm mb-1" style={{ background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})` }} />
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportModal() {
  const state = useStore();
  if (!state.showExportMenu || !state.currentProject) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setState({ showExportMenu: false })}>
      <div className="bg-white rounded-2xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold">Export</h2>
          <button onClick={() => setState({ showExportMenu: false })} className="p-1 hover:bg-neutral-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-2 space-y-1">
          <button onClick={() => { downloadHTML(state.currentProject!.website); setState({ showExportMenu: false }); addToast('Downloaded!', 'success'); }} className="w-full p-3 rounded-lg hover:bg-neutral-50 flex items-center gap-3 transition text-left">
            <FileCode size={18} className="text-neutral-600" />
            <div><p className="text-sm font-medium">Download HTML</p><p className="text-xs text-neutral-400">Standalone file</p></div>
          </button>
          <button onClick={() => { downloadJSON(state.currentProject!.website); setState({ showExportMenu: false }); addToast('Downloaded!', 'success'); }} className="w-full p-3 rounded-lg hover:bg-neutral-50 flex items-center gap-3 transition text-left">
            <Code size={18} className="text-neutral-600" />
            <div><p className="text-sm font-medium">Download JSON</p><p className="text-xs text-neutral-400">Configuration</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD VIEW ============
function DashboardView() {
  const state = useStore();
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('landing')} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-semibold">SiteForge AI</span>
              </button>
              <nav className="flex items-center gap-8">
                <button className="text-sm font-medium">Projects</button>
                <button onClick={() => setView('templates')} className="text-sm text-neutral-600 hover:text-black transition">Templates</button>
                <button onClick={() => setView('pricing')} className="text-sm text-neutral-600 hover:text-black transition">Pricing</button>
              </nav>
            </div>
            <button onClick={() => setState({ showAuthModal: true })} className="btn-primary text-sm">Sign In</button>
          </div>
        </div>
      </header>
      <main className="container-page py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-neutral-600">Manage your websites</p>
          </div>
          <button onClick={() => setView('landing')} className="btn-primary flex items-center gap-2">
            <Sparkles size={16} />
            New Project
          </button>
        </div>
        {state.projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-neutral-600 mb-6">Create your first website with AI</p>
            <button onClick={() => setView('landing')} className="btn-primary">Create Website</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.projects.map((project) => (
              <div key={project.id} className="card overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                  <span className="text-5xl">{project.website.industry === 'Restaurant' ? '🍽️' : '🌐'}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1">{project.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{new Date(project.updatedAt).toLocaleDateString()}</p>
                  <button onClick={() => setState({ view: 'builder', currentProject: project })} className="w-full btn-secondary text-sm">Open</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ============ TEMPLATES VIEW ============
function TemplatesView() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('landing')} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-semibold">SiteForge AI</span>
              </button>
              <nav className="flex items-center gap-8">
                <button onClick={() => setView('dashboard')} className="text-sm text-neutral-600 hover:text-black transition">Projects</button>
                <button className="text-sm font-medium">Templates</button>
                <button onClick={() => setView('pricing')} className="text-sm text-neutral-600 hover:text-black transition">Pricing</button>
              </nav>
            </div>
            <button onClick={() => setState({ showAuthModal: true })} className="btn-primary text-sm">Sign In</button>
          </div>
        </div>
      </header>
      <main className="container-page py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Templates</h1>
          <p className="text-xl text-neutral-600">Start with a professionally designed template</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="card overflow-hidden group cursor-pointer">
              <div className="h-48 overflow-hidden">
                <TemplatePreview templateId={template.id} className="group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600">{template.category}</span>
                </div>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{template.description}</p>
                <button className="w-full btn-secondary text-sm">Use Template</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ============ PRICING VIEW ============
function PricingView() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('landing')} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-semibold">SiteForge AI</span>
              </button>
              <nav className="flex items-center gap-8">
                <button onClick={() => setView('dashboard')} className="text-sm text-neutral-600 hover:text-black transition">Projects</button>
                <button onClick={() => setView('templates')} className="text-sm text-neutral-600 hover:text-black transition">Templates</button>
                <button className="text-sm font-medium">Pricing</button>
              </nav>
            </div>
            <button onClick={() => setState({ showAuthModal: true })} className="btn-primary text-sm">Sign In</button>
          </div>
        </div>
      </header>
      <main className="container-page py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-neutral-600">Choose the plan that's right for you</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Free', price: '$0', period: '/month', features: ['3 projects', 'AI generation', 'Basic templates'], cta: 'Get Started', highlighted: false },
            { name: 'Pro', price: '$19', period: '/month', features: ['Unlimited projects', 'Advanced AI', 'Custom domains', 'Code export'], cta: 'Start Pro Trial', highlighted: true },
            { name: 'Business', price: '$49', period: '/month', features: ['Everything in Pro', 'Team collaboration', 'Advanced publishing'], cta: 'Contact Sales', highlighted: false },
          ].map((plan, i) => (
            <div key={i} className={`card p-8 ${plan.highlighted ? 'bg-black text-white border-black' : ''}`}>
              {plan.highlighted && <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs mb-4">Most Popular</span>}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? 'text-white/60' : 'text-neutral-500'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check size={16} className={plan.highlighted ? 'text-white' : 'text-green-500'} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-medium text-sm transition ${plan.highlighted ? 'bg-white text-black hover:bg-neutral-100' : 'btn-primary'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ============ BUILDER COMPONENTS ============
function ChatPanel() {
  const state = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages]);

  const handleSend = () => {
    if (!input.trim() || !state.currentProject) return;
    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString() };
    setState({ chatMessages: [...state.chatMessages, userMsg] });
    setInput('');

    setTimeout(() => {
      const modified = modifyWebsite(state.currentProject!.website, input);
      const response = generateAIResponse(input, state.currentProject!.website);
      const aiMsg: ChatMessage = { id: `msg_${Date.now() + 1}`, role: 'assistant', content: response, timestamp: new Date().toISOString() };
      updateWebsite(modified);
      pushHistory(modified, `AI: ${input}`);
      setState({ chatMessages: [...getState().chatMessages, aiMsg] });
    }, 800);
  };

  return (
    <aside className="w-80 border-r border-neutral-200 bg-white flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <h3 className="font-semibold mb-1">AI Assistant</h3>
        <p className="text-sm text-neutral-600">Ask me to modify your website</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {state.chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask AI..."
            className="input-field flex-1"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="btn-primary px-4 disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function PreviewPanel() {
  const state = useStore();
  if (!state.currentProject) return null;

  if (state.showCodeView) {
    const code = generateFullHTML(state.currentProject.website);
    return (
      <main className="flex-1 bg-neutral-900 overflow-auto p-6">
        <pre className="text-sm text-neutral-300 font-mono">{code}</pre>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-100 overflow-auto p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="h-10 bg-neutral-50 border-b border-neutral-200 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white border border-neutral-200 rounded px-3 py-1 text-xs text-neutral-400 text-center max-w-sm mx-auto">
              {state.currentProject.website.seo.canonicalUrl || 'localhost:3000'}
            </div>
          </div>
        </div>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {state.currentProject.website.sections.map(section => (
            <SectionRenderer
              key={section.id}
              section={section}
              theme={state.currentProject!.website.themeSettings}
              isSelected={state.selectedSectionId === section.id}
              onSelect={(id) => selectSection(state.selectedSectionId === id ? null : id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function PropertiesPanel() {
  const state = useStore();
  const selectedSection = state.currentProject?.website.sections.find(s => s.id === state.selectedSectionId);

  return (
    <aside className="w-80 border-l border-neutral-200 bg-white overflow-y-auto scrollbar-thin">
      <div className="p-4 border-b border-neutral-200">
        <h3 className="font-semibold">Properties</h3>
        <p className="text-sm text-neutral-600 mt-1">Select a section to edit</p>
      </div>
      {selectedSection ? (
        <div className="p-4">
          <p className="text-sm text-neutral-600 mb-4">Editing: {selectedSection.type}</p>
          <div className="space-y-3">
            {Object.entries(selectedSection.config).slice(0, 5).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">{key}</label>
                <input type="text" value={typeof value === 'string' ? value : ''} className="input-field text-sm" readOnly />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center py-12 text-neutral-400">
          <Layout size={32} className="mx-auto mb-2" />
          <p className="text-sm">No section selected</p>
        </div>
      )}
    </aside>
  );
}
