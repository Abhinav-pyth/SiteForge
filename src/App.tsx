import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Monitor, Tablet, Smartphone, Code, Eye, Download, Send, Plus,
  Undo2, Redo2, Save, Trash2, Copy, ChevronUp, ChevronDown, X, Check,
  Palette, Settings, Globe, Layout, Layers, Zap, ArrowLeft,
  Rocket, FileCode, Grid3X3, CreditCard,
  FolderOpen, Edit3,
  Clock, CheckCircle2, AlertCircle, Info, Moon, Sun
} from 'lucide-react';
import {
  WebsiteConfig, Section, SectionType, Project, ChatMessage,
  ViewMode, ThemeSettings, THEME_PRESETS
} from './types';
import { generateWebsite, modifyWebsite, generateAIResponse, generateSection } from './lib/ai';
import {
  getState, subscribe, setState, initializeStore, pushHistory, undo, redo,
  saveProject, deleteProject, duplicateProject, renameProject, updateWebsite,
  selectSection, setView, setViewMode, updateTheme, addToast
} from './lib/store';
import { generateFullHTML, generateReactCode, downloadHTML, downloadJSON } from './lib/export';
import { templates, examplePrompts } from './lib/templates';
import { SectionRenderer } from './components/SectionRenderer';

// ============ HOOK ============
function useStore() {
  const [state, setLocalState] = useState(getState());
  useEffect(() => {
    return subscribe(() => setLocalState({ ...getState() }));
  }, []);
  return state;
}

// ============ MAIN APP ============
export default function App() {
  const state = useStore();

  useEffect(() => {
    initializeStore();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden bg-[#f8fafc]">
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

// ============ NAVBAR ============
function TopNav() {
  const state = useStore();
  return (
    <header className="h-14 border-b border-[#e2e8f0] bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-6">
        <button onClick={() => setView('landing')} className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-[#1e293b]">SiteForge</span>
          <span className="text-indigo-500">AI</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          <button onClick={() => setView('dashboard')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${state.view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-[#64748b] hover:text-[#1e293b] hover:bg-gray-50'}`}>
            <span className="flex items-center gap-1.5"><FolderOpen size={14} />Projects</span>
          </button>
          <button onClick={() => setView('templates')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${state.view === 'templates' ? 'bg-indigo-50 text-indigo-600' : 'text-[#64748b] hover:text-[#1e293b] hover:bg-gray-50'}`}>
            <span className="flex items-center gap-1.5"><Grid3X3 size={14} />Templates</span>
          </button>
          <button onClick={() => setView('pricing')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${state.view === 'pricing' ? 'bg-indigo-50 text-indigo-600' : 'text-[#64748b] hover:text-[#1e293b] hover:bg-gray-50'}`}>
            <span className="flex items-center gap-1.5"><CreditCard size={14} />Pricing</span>
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {state.currentProject && state.view === 'builder' && (
          <span className="text-sm text-[#64748b] hidden sm:block">{state.currentProject.name}</span>
        )}
        <button onClick={() => setState({ showAuthModal: true })} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          U
        </button>
      </div>
    </header>
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

  const handleTemplateClick = (template: typeof templates[0]) => {
    setPrompt(template.prompt);
  };

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} />
              AI-Powered Website Builder
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b] mb-4 leading-tight">
              Build your website<br />
              <span className="gradient-text">with a sentence.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#64748b] max-w-2xl mx-auto">
              Describe your idea. Our AI turns it into a beautiful, responsive website in minutes.
            </p>
          </div>

          <div className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-[#e2e8f0] p-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What do you want to build? e.g., Create a modern website for a coffee shop..."
                    className="w-full p-4 text-[#1e293b] placeholder-[#94a3b8] resize-none outline-none text-base min-h-[80px] rounded-xl"
                    rows={3}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => setState({ view: 'templates' })} className="text-sm text-[#64748b] hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    <Layout size={14} /> Start from Template
                  </button>
                </div>
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

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {examplePrompts.map((ep) => (
                <button
                  key={ep}
                  onClick={() => handleExampleClick(ep)}
                  className="px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-full text-sm text-[#64748b] hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>

          {/* Demo button */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setPrompt('Create a modern SaaS landing page for an AI analytics startup called CloudFlow. Include hero, features, pricing, testimonials, FAQ, and CTA sections.');
                setTimeout(() => {
                  setState({ isGenerating: true, generationStep: 0 });
                  simulateGeneration('Create a modern SaaS landing page for an AI analytics startup called CloudFlow. Include hero, features, pricing, testimonials, FAQ, and CTA sections.');
                }, 100);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              <Rocket size={18} />
              Try Demo — Generate a Sample Website
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              { icon: <Zap size={24} />, title: 'Instant Generation', desc: 'Describe your vision and watch it come to life in seconds.' },
              { icon: <Palette size={24} />, title: 'AI-Powered Design', desc: 'Intelligent themes, layouts, and content tailored to your brand.' },
              { icon: <Code size={24} />, title: 'Export Anywhere', desc: 'Download clean HTML, React code, or publish directly.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-[#e2e8f0] card-hover">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-4">{f.icon}</div>
                <h3 className="font-semibold text-[#1e293b] mb-2">{f.title}</h3>
                <p className="text-[#64748b] text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============ GENERATION OVERLAY ============
function GeneratingOverlay() {
  const state = useStore();
  const steps = [
    'Understanding your idea',
    'Planning website structure',
    'Creating sections',
    'Designing responsive layout',
    'Generating content',
    'Preparing preview',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md w-full px-6 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Building your website</h2>
          <p className="text-[#64748b]">Our AI is crafting something amazing...</p>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${i <= state.generationStep ? 'bg-indigo-50' : 'opacity-40'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i < state.generationStep ? 'bg-green-500' : i === state.generationStep ? 'bg-indigo-500 animate-pulse' : 'bg-gray-200'}`}>
                {i < state.generationStep ? <Check size={14} className="text-white" /> : i === state.generationStep ? <div className="w-2 h-2 bg-white rounded-full" /> : null}
              </div>
              <span className={`text-sm font-medium ${i <= state.generationStep ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${((state.generationStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

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
        chatMessages: [{ id: 'welcome', role: 'assistant', content: `I've created your website for "${website.siteName}". You can ask me to make changes, add sections, or modify the design. What would you like to do?`, timestamp: new Date().toISOString() }],
        history: [{ website: JSON.parse(JSON.stringify(website)), timestamp: new Date().toISOString(), label: 'Initial generation' }],
        historyIndex: 0,
        selectedSectionId: null,
      });
      saveProject();
    }
  }, 500);
}

// ============ BUILDER VIEW ============
function BuilderView() {
  const state = useStore();
  if (!state.currentProject) return null;

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <BuilderToolbar />
      <div className="flex-1 flex overflow-hidden">
        <ChatPanel />
        <PreviewPanel />
        <PropertiesPanel />
      </div>
    </div>
  );
}

// ============ BUILDER TOOLBAR ============
function BuilderToolbar() {
  const state = useStore();
  return (
    <div className="h-11 border-b border-[#e2e8f0] bg-white flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-1">
        <button onClick={() => setView('dashboard')} className="p-1.5 rounded-md hover:bg-gray-100 text-[#64748b]" title="Back to Dashboard">
          <ArrowLeft size={16} />
        </button>
        <div className="w-px h-5 bg-[#e2e8f0] mx-1" />
        <button onClick={undo} className="p-1.5 rounded-md hover:bg-gray-100 text-[#64748b]" title="Undo (Ctrl+Z)">
          <Undo2 size={16} />
        </button>
        <button onClick={redo} className="p-1.5 rounded-md hover:bg-gray-100 text-[#64748b]" title="Redo (Ctrl+Shift+Z)">
          <Redo2 size={16} />
        </button>
        <div className="w-px h-5 bg-[#e2e8f0] mx-1" />
        <button onClick={saveProject} className="p-1.5 rounded-md hover:bg-gray-100 text-[#64748b]" title="Save (Ctrl+S)">
          <Save size={16} />
        </button>
        <span className="text-xs text-[#94a3b8] ml-1 hidden sm:inline">Saved</span>
      </div>

      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
        {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`p-1.5 rounded-md transition ${state.viewMode === mode ? 'bg-white shadow-sm text-indigo-600' : 'text-[#64748b] hover:text-[#1e293b]'}`}
            title={mode}
          >
            {mode === 'desktop' ? <Monitor size={15} /> : mode === 'tablet' ? <Tablet size={15} /> : <Smartphone size={15} />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setState({ showAddSection: true })}
          className="px-2.5 py-1 text-sm rounded-md border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 flex items-center gap-1"
        >
          <Plus size={14} /> <span className="hidden sm:inline">Section</span>
        </button>
        <button
          onClick={() => setState({ showThemePanel: true })}
          className="px-2.5 py-1 text-sm rounded-md border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 flex items-center gap-1"
        >
          <Palette size={14} /> <span className="hidden sm:inline">Theme</span>
        </button>
        <button
          onClick={() => setState({ showCodeView: !state.showCodeView })}
          className={`px-2.5 py-1 text-sm rounded-md border flex items-center gap-1 ${state.showCodeView ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-[#e2e8f0] text-[#64748b] hover:bg-gray-50'}`}
        >
          <Code size={14} /> <span className="hidden sm:inline">Code</span>
        </button>
        <button
          onClick={() => setState({ showExportMenu: !state.showExportMenu })}
          className="px-2.5 py-1 text-sm rounded-md border border-[#e2e8f0] text-[#64748b] hover:bg-gray-50 flex items-center gap-1"
        >
          <Download size={14} /> <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => {
            setState({ isPublishing: true, publishStep: 0 });
            simulatePublish();
          }}
          className="px-3 py-1 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-1 font-medium"
        >
          <Rocket size={14} /> Publish
        </button>
      </div>
    </div>
  );
}

// ============ CHAT PANEL ============
function ChatPanel() {
  const state = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages]);

  const handleSend = () => {
    if (!input.trim() || !state.currentProject) return;
    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString() };
    setState({ chatMessages: [...state.chatMessages, userMsg] });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const modified = modifyWebsite(state.currentProject!.website, input);
      const response = generateAIResponse(input, state.currentProject!.website);
      const aiMsg: ChatMessage = { id: `msg_${Date.now() + 1}`, role: 'assistant', content: response, timestamp: new Date().toISOString() };
      updateWebsite(modified);
      pushHistory(modified, `AI: ${input}`);
      setState({ chatMessages: [...getState().chatMessages, aiMsg] });
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="w-80 border-r border-[#e2e8f0] bg-white flex flex-col shrink-0 hidden lg:flex">
      <div className="p-3 border-b border-[#e2e8f0] flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b]">AI Assistant</h3>
          <p className="text-xs text-[#94a3b8]">Ask me to modify your website</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {state.chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-[#1e293b]'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-100 px-4 py-2 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-[#e2e8f0]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask AI to modify..."
            className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition">
            <Send size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {['Make it dark', 'Add testimonials', 'Change to blue'].map(s => (
            <button key={s} onClick={() => { setInput(s); }} className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-[#64748b] hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ PREVIEW PANEL ============
function PreviewPanel() {
  const state = useStore();
  if (!state.currentProject) return null;

  if (state.showCodeView) {
    return <CodeViewPanel />;
  }

  const widthClass = state.viewMode === 'desktop' ? 'w-full' : state.viewMode === 'tablet' ? 'max-w-[768px]' : 'max-w-[375px]';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f5f9]">
      <div className="flex-1 overflow-auto p-4">
        <div className={`${widthClass} mx-auto bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden transition-all duration-300`}>
          <div className="h-8 bg-gray-50 border-b border-[#e2e8f0] flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="flex-1 mx-4">
              <div className="bg-white border border-gray-200 rounded px-3 py-0.5 text-xs text-[#94a3b8] text-center max-w-md mx-auto">
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
      </div>
    </div>
  );
}

// ============ CODE VIEW ============
function CodeViewPanel() {
  const state = useStore();
  const [activeTab, setActiveTab] = useState<'html' | 'react' | 'json'>('html');
  if (!state.currentProject) return null;

  const code = activeTab === 'html' ? generateFullHTML(state.currentProject.website) :
    activeTab === 'react' ? generateReactCode(state.currentProject.website) :
      JSON.stringify(state.currentProject.website, null, 2);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e2e]">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#2d2d3f]">
        {(['html', 'react', 'json'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs rounded font-medium transition ${activeTab === tab ? 'bg-[#2d2d3f] text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => { navigator.clipboard.writeText(code); addToast('Code copied!', 'success'); }} className="px-2 py-1 text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <Copy size={12} /> Copy
        </button>
        <button onClick={() => downloadHTML(state.currentProject!.website)} className="px-2 py-1 text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <Download size={12} /> Download
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="code-view text-gray-300 whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}

// ============ PROPERTIES PANEL ============
function PropertiesPanel() {
  const state = useStore();
  const [mobileTab, setMobileTab] = useState<'chat' | 'properties'>('properties');

  if (!state.currentProject) return null;
  const selectedSection = state.currentProject.website.sections.find(s => s.id === state.selectedSectionId);

  return (
    <>
      {/* Desktop properties panel */}
      <div className="w-72 border-l border-[#e2e8f0] bg-white flex flex-col shrink-0 hidden xl:flex">
        {selectedSection ? (
          <SectionEditor section={selectedSection} />
        ) : (
          <div className="p-4 text-center text-[#94a3b8]">
            <Layers size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Select a section</p>
            <p className="text-xs mt-1">Click on any section in the preview to edit its properties.</p>
          </div>
        )}
      </div>

      {/* Mobile tab bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] flex z-40">
        <button onClick={() => setMobileTab('chat')} className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 ${mobileTab === 'chat' ? 'text-indigo-600 bg-indigo-50' : 'text-[#64748b]'}`}>
          <Sparkles size={14} /> Chat
        </button>
        <button onClick={() => setMobileTab('properties')} className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 ${mobileTab === 'properties' ? 'text-indigo-600 bg-indigo-50' : 'text-[#64748b]'}`}>
          <Settings size={14} /> Edit
        </button>
      </div>
    </>
  );
}

// ============ SECTION EDITOR ============
function SectionEditor({ section }: { section: Section }) {
  const state = useStore();
  if (!state.currentProject) return null;

  const updateConfig = (key: string, value: any) => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    const sec = website.sections.find(s => s.id === section.id);
    if (sec) {
      sec.config[key] = value;
      updateWebsite(website);
      pushHistory(website, `Edit ${section.type}: ${key}`);
    }
  };

  const moveSection = (direction: 'up' | 'down') => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    const idx = website.sections.findIndex(s => s.id === section.id);
    if (direction === 'up' && idx > 0) {
      [website.sections[idx - 1], website.sections[idx]] = [website.sections[idx], website.sections[idx - 1]];
    } else if (direction === 'down' && idx < website.sections.length - 1) {
      [website.sections[idx], website.sections[idx + 1]] = [website.sections[idx + 1], website.sections[idx]];
    }
    updateWebsite(website);
    pushHistory(website, `Move ${section.type}`);
  };

  const deleteSection = () => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    website.sections = website.sections.filter(s => s.id !== section.id);
    updateWebsite(website);
    selectSection(null);
    pushHistory(website, `Delete ${section.type}`);
    addToast('Section deleted', 'info');
  };

  const duplicateSection = () => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    const idx = website.sections.findIndex(s => s.id === section.id);
    const clone = { ...JSON.parse(JSON.stringify(section)), id: `section_${Date.now()}` };
    website.sections.splice(idx + 1, 0, clone);
    updateWebsite(website);
    pushHistory(website, `Duplicate ${section.type}`);
    addToast('Section duplicated', 'success');
  };

  const editableFields = getEditableFields(section);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] capitalize">{section.type.replace('-', ' ')} Section</h3>
          <p className="text-xs text-[#94a3b8]">Edit properties</p>
        </div>
        <button onClick={() => selectSection(null)} className="p-1 hover:bg-gray-100 rounded">
          <X size={14} className="text-[#64748b]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {editableFields.map(field => (
          <div key={field.key}>
            <label className="text-xs font-medium text-[#64748b] mb-1 block">{field.label}</label>
            {field.type === 'text' && (
              <input
                type="text"
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm border border-[#e2e8f0] rounded-md outline-none focus:border-indigo-300"
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                rows={3}
                className="w-full px-2.5 py-1.5 text-sm border border-[#e2e8f0] rounded-md outline-none focus:border-indigo-300 resize-none"
              />
            )}
            {field.type === 'select' && (
              <select
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm border border-[#e2e8f0] rounded-md outline-none focus:border-indigo-300"
              >
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {field.type === 'color' && (
              <input
                type="color"
                value={field.value || '#000000'}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full h-8 border border-[#e2e8f0] rounded-md cursor-pointer"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-[#e2e8f0] space-y-1.5">
        <div className="grid grid-cols-4 gap-1">
          <button onClick={() => moveSection('up')} className="p-1.5 border border-[#e2e8f0] rounded hover:bg-gray-50 flex items-center justify-center" title="Move Up">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => moveSection('down')} className="p-1.5 border border-[#e2e8f0] rounded hover:bg-gray-50 flex items-center justify-center" title="Move Down">
            <ChevronDown size={14} />
          </button>
          <button onClick={duplicateSection} className="p-1.5 border border-[#e2e8f0] rounded hover:bg-gray-50 flex items-center justify-center" title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={deleteSection} className="p-1.5 border border-red-200 rounded hover:bg-red-50 flex items-center justify-center text-red-500" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getEditableFields(section: Section): { key: string; label: string; type: string; value: any; options?: string[] }[] {
  const fields: { key: string; label: string; type: string; value: any; options?: string[] }[] = [];
  const c = section.config;

  if (c.title) fields.push({ key: 'title', label: 'Title', type: 'text', value: c.title });
  if (c.subtitle) fields.push({ key: 'subtitle', label: 'Subtitle', type: 'textarea', value: c.subtitle });
  if (c.description) fields.push({ key: 'description', label: 'Description', type: 'textarea', value: c.description });
  if (c.buttonText) fields.push({ key: 'buttonText', label: 'Button Text', type: 'text', value: c.buttonText });
  if (c.secondaryButtonText) fields.push({ key: 'secondaryButtonText', label: 'Secondary Button', type: 'text', value: c.secondaryButtonText });
  if (c.alignment) fields.push({ key: 'alignment', label: 'Alignment', type: 'select', value: c.alignment, options: ['left', 'center', 'right'] });
  if (c.backgroundStyle) fields.push({ key: 'backgroundStyle', label: 'Background', type: 'select', value: c.backgroundStyle, options: ['light', 'dark', 'gradient'] });
  if (c.brandName) fields.push({ key: 'brandName', label: 'Brand Name', type: 'text', value: c.brandName });
  if (c.email) fields.push({ key: 'email', label: 'Email', type: 'text', value: c.email });
  if (c.phone) fields.push({ key: 'phone', label: 'Phone', type: 'text', value: c.phone });
  if (c.address) fields.push({ key: 'address', label: 'Address', type: 'text', value: c.address });

  if (fields.length === 0) {
    fields.push({ key: 'title', label: 'Title', type: 'text', value: c.title || section.type });
  }

  return fields;
}

// ============ DASHBOARD VIEW ============
function DashboardView() {
  const state = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">My Projects</h1>
              <p className="text-[#64748b] text-sm mt-1">Manage your websites</p>
            </div>
            <button onClick={() => setView('landing')} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> New Website
            </button>
          </div>

          {state.projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={28} className="text-[#94a3b8]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1e293b] mb-2">No projects yet</h3>
              <p className="text-[#64748b] mb-6">Create your first website with AI</p>
              <button onClick={() => setView('landing')} className="btn-primary">
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.projects.map(project => (
                <div key={project.id} className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden card-hover group">
                  <div className="h-36 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative">
                    <span className="text-4xl">{project.website.industry === 'Restaurant' ? '🍽️' : project.website.industry === 'SaaS' ? '🚀' : project.website.industry === 'E-commerce' ? '🛍️' : project.website.industry === 'Portfolio' ? '💻' : project.website.industry === 'Fashion' ? '👠' : '🌐'}</span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingId(project.id); setEditName(project.name); }} className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50">
                          <Edit3 size={12} />
                        </button>
                        <button onClick={() => duplicateProject(project.id)} className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50">
                          <Copy size={12} />
                        </button>
                        <button onClick={() => deleteProject(project.id)} className="p-1.5 bg-white rounded-md shadow-sm hover:bg-red-50 text-red-500">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {project.status === 'published' && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Published</span>
                    )}
                  </div>
                  <div className="p-4">
                    {editingId === project.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => { renameProject(project.id, editName); setEditingId(null); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { renameProject(project.id, editName); setEditingId(null); } }}
                        className="font-semibold text-[#1e293b] border-b border-indigo-300 outline-none w-full mb-1"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-[#1e293b] mb-1 truncate">{project.name}</h3>
                    )}
                    <p className="text-xs text-[#94a3b8] flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => {
                        setState({ currentProject: project, view: 'builder', selectedSectionId: null });
                        saveProject();
                      }}
                      className="mt-3 w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-1"
                    >
                      <Eye size={14} /> Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ============ TEMPLATES VIEW ============
function TemplatesView() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const filtered = selectedCategory === 'All' ? templates : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Templates</h1>
          <p className="text-[#64748b] text-sm mb-6">Start with a professionally designed template</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition ${selectedCategory === cat ? 'bg-indigo-500 text-white' : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:border-indigo-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(template => (
              <div key={template.id} className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden card-hover">
                <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <span className="text-5xl">{template.preview}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#1e293b]">{template.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-[#64748b]">{template.category}</span>
                  </div>
                  <p className="text-sm text-[#64748b] mb-3">{template.description}</p>
                  <button
                    onClick={() => {
                      setView('landing');
                      setTimeout(() => {
                        setState({ isGenerating: true, generationStep: 0 });
                        simulateGeneration(template.prompt);
                      }, 100);
                    }}
                    className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============ PRICING VIEW ============
function PricingView() {
  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#1e293b] mb-3">Simple, transparent pricing</h1>
            <p className="text-[#64748b] text-lg">Choose the plan that's right for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free', price: '$0', period: '/month',
                features: ['3 projects', 'AI generation', 'Basic templates', 'Community support', 'SiteForge branding'],
                cta: 'Get Started', highlighted: false,
              },
              {
                name: 'Pro', price: '$19', period: '/month',
                features: ['Unlimited projects', 'Advanced AI editing', 'Custom domains', 'Code export', 'Priority support', 'No branding', 'Analytics'],
                cta: 'Start Pro Trial', highlighted: true,
              },
              {
                name: 'Business', price: '$49', period: '/month',
                features: ['Everything in Pro', 'Team collaboration', 'Advanced publishing', 'Priority generation', 'API access', 'Custom integrations', 'Dedicated support'],
                cta: 'Contact Sales', highlighted: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-xl p-6 ${plan.highlighted ? 'bg-gradient-to-b from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200 scale-105' : 'bg-white border border-[#e2e8f0]'}`}>
                {plan.highlighted && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">Most Popular</span>}
                <h3 className={`text-lg font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-[#1e293b]'}`}>{plan.name}</h3>
                <div className={`text-3xl font-bold mb-4 ${plan.highlighted ? 'text-white' : 'text-[#1e293b]'}`}>{plan.price}<span className={`text-sm font-normal ${plan.highlighted ? 'text-white/70' : 'text-[#94a3b8]'}`}>{plan.period}</span></div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-white/90' : 'text-[#64748b]'}`}>
                      <Check size={14} className={plan.highlighted ? 'text-white' : 'text-green-500'} /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-lg font-medium text-sm transition ${plan.highlighted ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============ MODALS ============
function AddSectionModal() {
  const state = useStore();
  if (!state.showAddSection || !state.currentProject) return null;

  const sectionTypes: { type: SectionType; label: string; icon: string }[] = [
    { type: 'hero', label: 'Hero', icon: '🏔️' },
    { type: 'features', label: 'Features', icon: '⭐' },
    { type: 'about', label: 'About', icon: 'ℹ️' },
    { type: 'services', label: 'Services', icon: '🔧' },
    { type: 'products', label: 'Products', icon: '🛍️' },
    { type: 'pricing', label: 'Pricing', icon: '💰' },
    { type: 'testimonials', label: 'Testimonials', icon: '💬' },
    { type: 'gallery', label: 'Gallery', icon: '🖼️' },
    { type: 'team', label: 'Team', icon: '👥' },
    { type: 'faq', label: 'FAQ', icon: '❓' },
    { type: 'stats', label: 'Stats', icon: '📊' },
    { type: 'cta', label: 'CTA', icon: '📢' },
    { type: 'contact', label: 'Contact', icon: '📧' },
    { type: 'newsletter', label: 'Newsletter', icon: '📰' },
  ];

  const addSection = (type: SectionType) => {
    const website = JSON.parse(JSON.stringify(state.currentProject!.website)) as WebsiteConfig;
    const newSection = generateSection(type, website.siteName, website.industry);
    const footerIdx = website.sections.findIndex(s => s.type === 'footer');
    if (footerIdx >= 0) {
      website.sections.splice(footerIdx, 0, newSection);
    } else {
      website.sections.push(newSection);
    }
    updateWebsite(website);
    pushHistory(website, `Add ${type} section`);
    setState({ showAddSection: false });
    addToast(`${type} section added!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setState({ showAddSection: false })}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 animate-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="font-semibold text-[#1e293b]">Add Section</h2>
          <button onClick={() => setState({ showAddSection: false })} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
          {sectionTypes.map(st => (
            <button
              key={st.type}
              onClick={() => addSection(st.type)}
              className="p-3 rounded-xl border border-[#e2e8f0] hover:border-indigo-300 hover:bg-indigo-50 transition text-center"
            >
              <span className="text-2xl block mb-1">{st.icon}</span>
              <span className="text-xs font-medium text-[#64748b]">{st.label}</span>
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
    const newTheme = { ...theme, [key]: value };
    updateTheme(newTheme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setState({ showThemePanel: false })}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-bounce-in max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-[#1e293b]">Theme Settings</h2>
          <button onClick={() => setState({ showThemePanel: false })} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-4">
          {/* Presets */}
          <div>
            <label className="text-xs font-medium text-[#64748b] mb-2 block">Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => updateTheme(preset)}
                  className={`p-2 rounded-lg border text-xs font-medium capitalize transition ${theme.preset === key ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-[#e2e8f0] hover:border-indigo-200'}`}
                >
                  <div className="w-full h-4 rounded mb-1" style={{ background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})` }} />
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.primaryColor} onChange={(e) => updateThemeSetting('primaryColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <span className="text-xs text-[#64748b]">{theme.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.secondaryColor} onChange={(e) => updateThemeSetting('secondaryColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <span className="text-xs text-[#64748b]">{theme.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.backgroundColor} onChange={(e) => updateThemeSetting('backgroundColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <span className="text-xs text-[#64748b]">{theme.backgroundColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.textColor} onChange={(e) => updateThemeSetting('textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <span className="text-xs text-[#64748b]">{theme.textColor}</span>
              </div>
            </div>
          </div>

          {/* Font */}
          <div>
            <label className="text-xs font-medium text-[#64748b] mb-1 block">Font Family</label>
            <select value={theme.fontFamily} onChange={(e) => updateThemeSetting('fontFamily', e.target.value)} className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg">
              <option value="Inter">Inter (Modern)</option>
              <option value="Playfair Display">Playfair Display (Elegant)</option>
              <option value="system-ui">System UI</option>
            </select>
          </div>

          {/* Button Style */}
          <div>
            <label className="text-xs font-medium text-[#64748b] mb-2 block">Button Style</label>
            <div className="flex gap-2">
              {(['rounded', 'pill', 'square'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => updateThemeSetting('buttonStyle', style)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${theme.buttonStyle === style ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-[#e2e8f0] hover:border-indigo-200'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="text-xs font-medium text-[#64748b] mb-2 block">Spacing</label>
            <div className="flex gap-2">
              {(['compact', 'normal', 'spacious'] as const).map(sp => (
                <button
                  key={sp}
                  onClick={() => updateThemeSetting('spacing', sp)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${theme.spacing === sp ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-[#e2e8f0] hover:border-indigo-200'}`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs font-medium text-[#64748b] mb-2 block">Mode</label>
            <div className="flex gap-2">
              <button onClick={() => updateThemeSetting('mode', 'light')} className={`flex-1 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1 transition ${theme.mode === 'light' ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-[#e2e8f0]'}`}>
                <Sun size={14} /> Light
              </button>
              <button onClick={() => updateThemeSetting('mode', 'dark')} className={`flex-1 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1 transition ${theme.mode === 'dark' ? 'border-indigo-400 bg-indigo-50 text-indigo-600' : 'border-[#e2e8f0]'}`}>
                <Moon size={14} /> Dark
              </button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setState({ showExportMenu: false })}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 animate-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="font-semibold text-[#1e293b]">Export Website</h2>
          <button onClick={() => setState({ showExportMenu: false })} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-2">
          <button onClick={() => { downloadHTML(state.currentProject!.website); setState({ showExportMenu: false }); addToast('HTML downloaded!', 'success'); }} className="w-full p-3 rounded-lg border border-[#e2e8f0] hover:bg-gray-50 flex items-center gap-3 transition text-left">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><FileCode size={18} className="text-orange-500" /></div>
            <div><p className="font-medium text-sm text-[#1e293b]">Download HTML</p><p className="text-xs text-[#94a3b8]">Complete standalone HTML file</p></div>
          </button>
          <button onClick={() => { downloadJSON(state.currentProject!.website); setState({ showExportMenu: false }); addToast('JSON config downloaded!', 'success'); }} className="w-full p-3 rounded-lg border border-[#e2e8f0] hover:bg-gray-50 flex items-center gap-3 transition text-left">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Code size={18} className="text-blue-500" /></div>
            <div><p className="font-medium text-sm text-[#1e293b]">Download JSON Config</p><p className="text-xs text-[#94a3b8]">Website configuration data</p></div>
          </button>
          <button onClick={() => { navigator.clipboard.writeText(generateFullHTML(state.currentProject!.website)); setState({ showExportMenu: false }); addToast('HTML copied to clipboard!', 'success'); }} className="w-full p-3 rounded-lg border border-[#e2e8f0] hover:bg-gray-50 flex items-center gap-3 transition text-left">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Copy size={18} className="text-green-500" /></div>
            <div><p className="font-medium text-sm text-[#1e293b]">Copy HTML Code</p><p className="text-xs text-[#94a3b8]">Copy to clipboard</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthModal() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setState({ showAuthModal: false })}>
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 animate-bounce-in" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
            <p className="text-sm text-[#64748b] mt-1">{mode === 'signin' ? 'Sign in to your account' : 'Start building with AI'}</p>
          </div>
          <div className="space-y-3">
            {mode === 'signup' && (
              <input type="text" placeholder="Full name" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-indigo-300" />
            )}
            <input type="email" placeholder="Email address" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-indigo-300" />
            <input type="password" placeholder="Password" className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-indigo-300" />
            <button onClick={() => { setState({ showAuthModal: false, isAuthenticated: true }); addToast(mode === 'signin' ? 'Signed in!' : 'Account created!', 'success'); }} className="w-full py-2.5 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 transition">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2e8f0]" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#94a3b8]">or</span></div>
            </div>
            <button className="w-full py-2.5 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#1e293b] hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>
          <p className="text-center text-sm text-[#64748b] mt-4">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-indigo-500 font-medium">{mode === 'signin' ? 'Sign up' : 'Sign in'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ PUBLISHING OVERLAY ============
function PublishingOverlay() {
  const state = useStore();
  const steps = ['Preparing website', 'Building project', 'Optimizing assets', 'Publishing', 'Website published!'];

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md w-full px-6 animate-fade-in text-center">
        {state.publishStep < steps.length - 1 ? (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Rocket size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b] mb-2">Publishing your website</h2>
            <p className="text-[#64748b] text-sm mb-6">{steps[state.publishStep]}...</p>
            <div className="space-y-2">
              {steps.slice(0, -1).map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${i <= state.publishStep ? 'text-[#1e293b]' : 'text-[#94a3b8]'}`}>
                  {i < state.publishStep ? <CheckCircle2 size={16} className="text-green-500" /> : i === state.publishStep ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin-slow" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                  {step}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b] mb-2">Your website is live!</h2>
            <p className="text-[#64748b] text-sm mb-4">Demo mode — in production, your site would be deployed to a real URL.</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-[#94a3b8] mb-1">Published URL</p>
              <p className="text-sm font-medium text-indigo-600 flex items-center justify-center gap-1">
                <Globe size={14} />
                https://siteforge-demo.vercel.app/{state.currentProject?.name.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
            <button onClick={() => setState({ isPublishing: false, publishStep: 0 })} className="btn-primary">
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function simulatePublish() {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    setState({ publishStep: step });
    if (step >= 5) {
      clearInterval(interval);
      if (getState().currentProject) {
        const updated = { ...getState().currentProject!, status: 'published' as const, publishedUrl: `https://siteforge-demo.vercel.app/${getState().currentProject!.name.toLowerCase().replace(/\s+/g, '-')}` };
        setState({ currentProject: updated });
        saveProject();
      }
    }
  }, 800);
}

// ============ TOASTS ============
function Toasts() {
  const state = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {state.toasts.map(toast => (
        <div key={toast.id} className={`toast-enter px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#1e293b] text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={14} /> : toast.type === 'error' ? <AlertCircle size={14} /> : <Info size={14} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}


