import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Monitor, Tablet, Smartphone, Code, Download, Send, Plus,
  Undo2, Redo2, Save, Trash2, Copy, ChevronUp, ChevronDown, X, Check,
  Palette, Settings, Globe, Layout, Layers, ArrowLeft,
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
    <div className="h-full w-full overflow-hidden bg-white">
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
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-6">
        <button onClick={() => setView('landing')} className="flex items-center gap-2 font-semibold text-base">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span>SiteForge AI</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { view: 'dashboard' as const, label: 'Projects', icon: <FolderOpen size={14} /> },
            { view: 'templates' as const, label: 'Templates', icon: <Grid3X3 size={14} /> },
            { view: 'pricing' as const, label: 'Pricing', icon: <CreditCard size={14} /> },
          ].map(item => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition ${
                state.view === item.view ? 'bg-gray-100 text-black font-medium' : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {state.currentProject && state.view === 'builder' && (
          <span className="text-sm text-gray-500 hidden sm:block">{state.currentProject.name}</span>
        )}
        <button onClick={() => setState({ showAuthModal: true })} className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium">
          U
        </button>
      </div>
    </header>
  );
}

// ============ LANDING VIEW ============
function LandingView() {
  const [prompt, setPrompt] = useState('');

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
    <div className="h-full flex flex-col">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
          {/* Headline */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-5">
              <Sparkles size={12} />
              AI Website Builder
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-3 leading-tight tracking-tight">
              Build websites with a sentence.
            </h1>
            <p className="text-base md:text-lg text-gray-500">
              Describe your idea. AI turns it into a real website.
            </p>
          </div>

          {/* Prompt Box */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 mb-5 shadow-sm">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a modern website for a coffee shop in Indore with online ordering, menu, and contact..."
              className="w-full p-3 text-black placeholder-gray-400 resize-none outline-none text-sm min-h-[80px] rounded-lg"
              rows={3}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
            />
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button onClick={() => setView('templates')} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50">
                <Layout size={12} /> Templates
              </button>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
              >
                <Sparkles size={14} />
                Generate
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {examplePrompts.map((ep) => (
              <button
                key={ep}
                onClick={() => handleExampleClick(ep)}
                className="px-2.5 py-1 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-black hover:text-black transition"
              >
                {ep}
              </button>
            ))}
          </div>

          {/* Demo button */}
          <div className="text-center mt-10">
            <button
              onClick={() => {
                const demoPrompt = 'Create a modern SaaS landing page for an AI analytics startup called CloudFlow. Include hero, features, pricing, testimonials, FAQ, and CTA sections.';
                setState({ isGenerating: true, generationStep: 0 });
                simulateGeneration(demoPrompt);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
            >
              <Rocket size={14} />
              Try a demo website
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
            {[
              { icon: '⚡', title: 'Instant Generation', desc: 'Describe your vision and see it come to life in seconds.' },
              { icon: '🎨', title: 'AI Design', desc: 'Intelligent themes and layouts tailored to your brand.' },
              { icon: '📦', title: 'Export Anywhere', desc: 'Download clean HTML or publish directly.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-gray-100 rounded-xl">
                <div className="text-xl mb-2">{f.icon}</div>
                <h3 className="font-medium text-sm text-black mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
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
  const steps = ['Understanding your idea', 'Planning structure', 'Creating sections', 'Designing layout', 'Generating content', 'Preparing preview'];

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="max-w-sm w-full px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold text-black mb-1">Building your website</h2>
          <p className="text-sm text-gray-500">This will take a moment...</p>
        </div>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-2.5 py-1.5 text-sm ${i <= state.generationStep ? 'text-black' : 'text-gray-300'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${i < state.generationStep ? 'bg-black' : i === state.generationStep ? 'bg-black animate-pulse' : 'bg-gray-200'}`}>
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
        chatMessages: [{ id: 'welcome', role: 'assistant', content: `I've created your website for "${website.siteName}". Ask me to make any changes — add sections, modify the design, or adjust the content.`, timestamp: new Date().toISOString() }],
        history: [{ website: JSON.parse(JSON.stringify(website)), timestamp: new Date().toISOString(), label: 'Initial generation' }],
        historyIndex: 0,
        selectedSectionId: null,
      });
      saveProject();
    }
  }, 450);
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
    <div className="h-11 border-b border-gray-200 bg-white flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-1">
        <button onClick={() => setView('dashboard')} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Back">
          <ArrowLeft size={15} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button onClick={undo} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Undo">
          <Undo2 size={15} />
        </button>
        <button onClick={redo} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Redo">
          <Redo2 size={15} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button onClick={saveProject} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Save">
          <Save size={15} />
        </button>
      </div>

      <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
        {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`p-1.5 rounded transition ${state.viewMode === mode ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title={mode}
          >
            {mode === 'desktop' ? <Monitor size={14} /> : mode === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setState({ showAddSection: true })} className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1">
          <Plus size={12} /> <span className="hidden sm:inline">Section</span>
        </button>
        <button onClick={() => setState({ showThemePanel: true })} className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1">
          <Palette size={12} /> <span className="hidden sm:inline">Theme</span>
        </button>
        <button
          onClick={() => setState({ showCodeView: !state.showCodeView })}
          className={`px-2 py-1 text-xs rounded border flex items-center gap-1 ${state.showCodeView ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <Code size={12} /> <span className="hidden sm:inline">Code</span>
        </button>
        <button onClick={() => setState({ showExportMenu: !state.showExportMenu })} className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1">
          <Download size={12} /> <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => { setState({ isPublishing: true, publishStep: 0 }); simulatePublish(); }}
          className="px-3 py-1 text-xs rounded bg-black text-white hover:bg-gray-800 flex items-center gap-1 font-medium"
        >
          <Rocket size={12} /> Publish
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
    }, 800);
  };

  return (
    <div className="w-72 border-r border-gray-200 bg-white flex flex-col shrink-0 hidden lg:flex">
      <div className="p-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <div>
          <h3 className="text-xs font-medium text-black">AI Assistant</h3>
          <p className="text-[10px] text-gray-400">Ask to modify your site</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {state.chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask AI..."
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:border-gray-400"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="p-1.5 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-30">
            <Send size={13} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {['Make it dark', 'Add testimonials', 'Change to blue'].map(s => (
            <button key={s} onClick={() => setInput(s)} className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-500 hover:border-gray-400 hover:text-black">
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

  const widthClass = state.viewMode === 'desktop' ? 'preview-desktop' : state.viewMode === 'tablet' ? 'preview-tablet' : 'preview-mobile';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-auto p-4">
        <div className={`${widthClass} mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300`}>
          {/* Browser chrome */}
          <div className="h-7 bg-gray-50 border-b border-gray-200 flex items-center px-2.5 gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-white border border-gray-200 rounded px-2 py-0.5 text-[10px] text-gray-400 text-center max-w-xs mx-auto truncate">
                {state.currentProject.website.seo.canonicalUrl || 'localhost:3000'}
              </div>
            </div>
          </div>
          {/* Website content */}
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-800">
        {(['html', 'react', 'json'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 text-[11px] rounded font-medium transition ${activeTab === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => { navigator.clipboard.writeText(code); addToast('Copied!', 'success'); }} className="px-2 py-1 text-[11px] text-gray-500 hover:text-white flex items-center gap-1">
          <Copy size={11} /> Copy
        </button>
        <button onClick={() => downloadHTML(state.currentProject!.website)} className="px-2 py-1 text-[11px] text-gray-500 hover:text-white flex items-center gap-1">
          <Download size={11} /> Download
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="code-block text-gray-300 whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}

// ============ PROPERTIES PANEL ============
function PropertiesPanel() {
  const state = useStore();
  if (!state.currentProject) return null;
  const selectedSection = state.currentProject.website.sections.find(s => s.id === state.selectedSectionId);

  return (
    <div className="w-64 border-l border-gray-200 bg-white flex flex-col shrink-0 hidden xl:flex">
      {selectedSection ? (
        <SectionEditor section={selectedSection} />
      ) : (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center">
          <Layers size={24} className="text-gray-300 mb-2" />
          <p className="text-xs font-medium text-gray-500">Select a section</p>
          <p className="text-[10px] text-gray-400 mt-1">Click any section in the preview to edit it.</p>
        </div>
      )}
    </div>
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
    addToast('Duplicated', 'success');
  };

  const editableFields = getEditableFields(section);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-medium text-black capitalize">{section.type.replace('-', ' ')}</h3>
          <p className="text-[10px] text-gray-400">Edit properties</p>
        </div>
        <button onClick={() => selectSection(null)} className="p-1 hover:bg-gray-100 rounded">
          <X size={12} className="text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {editableFields.map(field => (
          <div key={field.key}>
            <label className="text-[10px] font-medium text-gray-500 mb-0.5 block uppercase tracking-wide">{field.label}</label>
            {field.type === 'text' && (
              <input
                type="text"
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-gray-400"
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                rows={2}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-gray-400 resize-none"
              />
            )}
            {field.type === 'select' && (
              <select
                value={field.value || ''}
                onChange={(e) => updateConfig(field.key, e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-gray-400"
              >
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>
      <div className="p-2.5 border-t border-gray-100">
        <div className="grid grid-cols-4 gap-1">
          <button onClick={() => moveSection('up')} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center" title="Move Up">
            <ChevronUp size={12} />
          </button>
          <button onClick={() => moveSection('down')} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center" title="Move Down">
            <ChevronDown size={12} />
          </button>
          <button onClick={duplicateSection} className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center" title="Duplicate">
            <Copy size={12} />
          </button>
          <button onClick={deleteSection} className="p-1.5 border border-red-200 rounded hover:bg-red-50 flex items-center justify-center text-red-500" title="Delete">
            <Trash2 size={12} />
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
  if (fields.length === 0) fields.push({ key: 'title', label: 'Title', type: 'text', value: c.title || section.type });
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-black">Projects</h1>
              <p className="text-sm text-gray-500 mt-0.5">Your websites</p>
            </div>
            <button onClick={() => setView('landing')} className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 flex items-center gap-1.5">
              <Plus size={13} /> New
            </button>
          </div>

          {state.projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FolderOpen size={22} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-black mb-1">No projects yet</h3>
              <p className="text-xs text-gray-500 mb-4">Create your first website with AI</p>
              <button onClick={() => setView('landing')} className="px-4 py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800">
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.projects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition group">
                  <div className="h-28 bg-gray-50 flex items-center justify-center relative">
                    <span className="text-3xl">{project.website.industry === 'Restaurant' ? '🍽️' : project.website.industry === 'SaaS' ? '🚀' : project.website.industry === 'E-commerce' ? '🛍️' : project.website.industry === 'Portfolio' ? '💻' : project.website.industry === 'Fashion' ? '👠' : '🌐'}</span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => { setEditingId(project.id); setEditName(project.name); }} className="p-1 bg-white rounded shadow-sm hover:bg-gray-50">
                        <Edit3 size={10} />
                      </button>
                      <button onClick={() => duplicateProject(project.id)} className="p-1 bg-white rounded shadow-sm hover:bg-gray-50">
                        <Copy size={10} />
                      </button>
                      <button onClick={() => deleteProject(project.id)} className="p-1 bg-white rounded shadow-sm hover:bg-red-50 text-red-500">
                        <Trash2 size={10} />
                      </button>
                    </div>
                    {project.status === 'published' && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium">Live</span>
                    )}
                  </div>
                  <div className="p-3">
                    {editingId === project.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => { renameProject(project.id, editName); setEditingId(null); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { renameProject(project.id, editName); setEditingId(null); } }}
                        className="text-sm font-medium border-b border-black outline-none w-full mb-1"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-black mb-0.5 truncate">{project.name}</h3>
                    )}
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => { setState({ currentProject: project, view: 'builder', selectedSectionId: null }); saveProject(); }}
                      className="mt-2 w-full py-1.5 text-xs font-medium text-black bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                      Open
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold text-black mb-1">Templates</h1>
          <p className="text-sm text-gray-500 mb-5">Start with a pre-built design</p>

          <div className="flex gap-1.5 mb-5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition">
                <div className="h-32 bg-gray-50 flex items-center justify-center">
                  <span className="text-4xl">{template.preview}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-black">{template.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{template.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2.5 line-clamp-2">{template.description}</p>
                  <button
                    onClick={() => {
                      setView('landing');
                      setTimeout(() => {
                        setState({ isGenerating: true, generationStep: 0 });
                        simulateGeneration(template.prompt);
                      }, 100);
                    }}
                    className="w-full py-1.5 text-xs font-medium text-black bg-gray-100 rounded hover:bg-gray-200 transition"
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-black mb-2">Pricing</h1>
            <p className="text-sm text-gray-500">Simple plans for everyone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Free', price: '$0', period: '/mo', features: ['3 projects', 'AI generation', 'Basic templates', 'Community support'], cta: 'Get Started', highlighted: false },
              { name: 'Pro', price: '$19', period: '/mo', features: ['Unlimited projects', 'Advanced AI', 'Custom domains', 'Code export', 'Priority support'], cta: 'Start Pro Trial', highlighted: true },
              { name: 'Business', price: '$49', period: '/mo', features: ['Everything in Pro', 'Team collaboration', 'Advanced publishing', 'API access', 'Dedicated support'], cta: 'Contact Sales', highlighted: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-lg p-5 ${plan.highlighted ? 'bg-black text-white' : 'border border-gray-200'}`}>
                {plan.highlighted && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full mb-2 inline-block font-medium">Popular</span>}
                <h3 className={`text-sm font-medium mb-1 ${plan.highlighted ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                <div className={`text-2xl font-bold mb-3 ${plan.highlighted ? 'text-white' : 'text-black'}`}>{plan.price}<span className={`text-xs font-normal ${plan.highlighted ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span></div>
                <ul className="space-y-1.5 mb-5">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-1.5 text-xs ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                      <Check size={12} className={plan.highlighted ? 'text-white' : 'text-green-500'} /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded text-xs font-medium transition ${plan.highlighted ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
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
    const footerIdx = website.sections.findIndex(s => s.type === 'footer');
    if (footerIdx >= 0) website.sections.splice(footerIdx, 0, newSection);
    else website.sections.push(newSection);
    updateWebsite(website);
    pushHistory(website, `Add ${type} section`);
    setState({ showAddSection: false });
    addToast(`${type} added`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setState({ showAddSection: false })}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black">Add Section</h2>
          <button onClick={() => setState({ showAddSection: false })} className="p-1 hover:bg-gray-100 rounded"><X size={14} /></button>
        </div>
        <div className="p-3 grid grid-cols-4 gap-1.5 max-h-80 overflow-y-auto">
          {sectionTypes.map(st => (
            <button key={st.type} onClick={() => addSection(st.type)} className="p-2.5 rounded border border-gray-200 hover:border-black hover:bg-gray-50 transition text-center">
              <span className="text-lg block mb-0.5">{st.icon}</span>
              <span className="text-[10px] font-medium text-gray-600">{st.label}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setState({ showThemePanel: false })}>
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-sm font-medium text-black">Theme</h2>
          <button onClick={() => setState({ showThemePanel: false })} className="p-1 hover:bg-gray-100 rounded"><X size={14} /></button>
        </div>
        <div className="p-3 space-y-4">
          {/* Presets */}
          <div>
            <label className="text-[10px] font-medium text-gray-500 mb-1.5 block uppercase tracking-wide">Presets</label>
            <div className="grid grid-cols-4 gap-1.5">
              {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => updateTheme(preset)}
                  className={`p-1.5 rounded border text-[10px] font-medium capitalize transition ${theme.preset === key ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="w-full h-3 rounded-sm mb-1" style={{ background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})` }} />
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'primaryColor' as const, label: 'Primary' },
              { key: 'secondaryColor' as const, label: 'Secondary' },
              { key: 'backgroundColor' as const, label: 'Background' },
              { key: 'textColor' as const, label: 'Text' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-[10px] font-medium text-gray-500 mb-0.5 block uppercase tracking-wide">{label}</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={theme[key]} onChange={(e) => updateThemeSetting(key, e.target.value)} className="w-6 h-6 rounded cursor-pointer border border-gray-200" />
                  <span className="text-[10px] text-gray-400">{theme[key]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Font */}
          <div>
            <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wide">Font</label>
            <select value={theme.fontFamily} onChange={(e) => updateThemeSetting('fontFamily', e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded">
              <option value="Inter">Inter</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="system-ui">System</option>
            </select>
          </div>

          {/* Button Style */}
          <div>
            <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wide">Buttons</label>
            <div className="flex gap-1">
              {(['rounded', 'pill', 'square'] as const).map(s => (
                <button key={s} onClick={() => updateThemeSetting('buttonStyle', s)} className={`flex-1 py-1.5 text-[10px] font-medium rounded border transition ${theme.buttonStyle === s ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wide">Spacing</label>
            <div className="flex gap-1">
              {(['compact', 'normal', 'spacious'] as const).map(sp => (
                <button key={sp} onClick={() => updateThemeSetting('spacing', sp)} className={`flex-1 py-1.5 text-[10px] font-medium rounded border transition ${theme.spacing === sp ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                  {sp}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setState({ showExportMenu: false })}>
      <div className="bg-white rounded-lg shadow-xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black">Export</h2>
          <button onClick={() => setState({ showExportMenu: false })} className="p-1 hover:bg-gray-100 rounded"><X size={14} /></button>
        </div>
        <div className="p-2 space-y-1">
          <button onClick={() => { downloadHTML(state.currentProject!.website); setState({ showExportMenu: false }); addToast('Downloaded!', 'success'); }} className="w-full p-2.5 rounded hover:bg-gray-50 flex items-center gap-2.5 transition text-left">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center"><FileCode size={14} className="text-gray-600" /></div>
            <div><p className="text-xs font-medium text-black">Download HTML</p><p className="text-[10px] text-gray-400">Standalone file</p></div>
          </button>
          <button onClick={() => { downloadJSON(state.currentProject!.website); setState({ showExportMenu: false }); addToast('Downloaded!', 'success'); }} className="w-full p-2.5 rounded hover:bg-gray-50 flex items-center gap-2.5 transition text-left">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center"><Code size={14} className="text-gray-600" /></div>
            <div><p className="text-xs font-medium text-black">Download JSON</p><p className="text-[10px] text-gray-400">Configuration data</p></div>
          </button>
          <button onClick={() => { navigator.clipboard.writeText(generateFullHTML(state.currentProject!.website)); setState({ showExportMenu: false }); addToast('Copied!', 'success'); }} className="w-full p-2.5 rounded hover:bg-gray-50 flex items-center gap-2.5 transition text-left">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center"><Copy size={14} className="text-gray-600" /></div>
            <div><p className="text-xs font-medium text-black">Copy HTML</p><p className="text-[10px] text-gray-400">To clipboard</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthModal() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setState({ showAuthModal: false })}>
      <div className="bg-white rounded-lg shadow-xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="text-center mb-5">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles size={16} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-black">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
          </div>
          <div className="space-y-2.5">
            {mode === 'signup' && <input type="text" placeholder="Name" className="w-full px-3 py-2 border border-gray-200 rounded text-xs outline-none focus:border-gray-400" />}
            <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-200 rounded text-xs outline-none focus:border-gray-400" />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-200 rounded text-xs outline-none focus:border-gray-400" />
            <button onClick={() => { setState({ showAuthModal: false, isAuthenticated: true }); addToast(mode === 'signin' ? 'Signed in!' : 'Account created!', 'success'); }} className="w-full py-2 bg-black text-white rounded text-xs font-medium hover:bg-gray-800">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-2 text-[10px] text-gray-400">or</span></div>
            </div>
            <button className="w-full py-2 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-3">
            {mode === 'signin' ? "No account? " : 'Have an account? '}
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-black font-medium underline">{mode === 'signin' ? 'Sign up' : 'Sign in'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ PUBLISHING OVERLAY ============
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
            <h2 className="text-base font-semibold text-black mb-1">Publishing</h2>
            <p className="text-xs text-gray-500 mb-5">{steps[state.publishStep]}...</p>
            <div className="space-y-1.5">
              {steps.slice(0, -1).map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${i <= state.publishStep ? 'text-black' : 'text-gray-300'}`}>
                  {i < state.publishStep ? <CheckCircle2 size={13} className="text-green-500" /> : i === state.publishStep ? <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-200" />}
                  {step}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <h2 className="text-base font-semibold text-black mb-1">Website is live!</h2>
            <p className="text-xs text-gray-500 mb-4">Demo mode — in production this would deploy to a real URL.</p>
            <div className="bg-gray-50 rounded p-2.5 mb-4">
              <p className="text-[10px] text-gray-400 mb-0.5">URL</p>
              <p className="text-xs font-medium text-black flex items-center justify-center gap-1">
                <Globe size={11} />
                siteforge.vercel.app/{state.currentProject?.name.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
            <button onClick={() => setState({ isPublishing: false, publishStep: 0 })} className="px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-gray-800">
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
        const updated = { ...getState().currentProject!, status: 'published' as const, publishedUrl: `https://siteforge.vercel.app/${getState().currentProject!.name.toLowerCase().replace(/\s+/g, '-')}` };
        setState({ currentProject: updated });
        saveProject();
      }
    }
  }, 700);
}

// ============ TOASTS ============
function Toasts() {
  const state = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-1.5">
      {state.toasts.map(toast => (
        <div key={toast.id} className={`px-3 py-2 rounded-md shadow-sm text-xs font-medium flex items-center gap-1.5 ${toast.type === 'success' ? 'bg-black text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={12} /> : toast.type === 'error' ? <AlertCircle size={12} /> : <Info size={12} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
