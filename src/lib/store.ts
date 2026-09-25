import { WebsiteConfig, Project, ChatMessage, HistoryState, AppView, ViewMode, BuilderTab, ThemeSettings } from '../types';

const STORAGE_KEY = 'siteforge_projects';
const CURRENT_PROJECT_KEY = 'siteforge_current';

// State
interface AppState {
  view: AppView;
  currentProject: Project | null;
  projects: Project[];
  chatMessages: ChatMessage[];
  history: HistoryState[];
  historyIndex: number;
  viewMode: ViewMode;
  builderTab: BuilderTab;
  selectedSectionId: string | null;
  isGenerating: boolean;
  generationStep: number;
  isPublishing: boolean;
  publishStep: number;
  showCodeView: boolean;
  showAddSection: boolean;
  showThemePanel: boolean;
  showExportMenu: boolean;
  showMobileChat: boolean;
  toasts: Toast[];
  isAuthenticated: boolean;
  showAuthModal: boolean;
  lastSaved: string | null;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let state: AppState = {
  view: 'landing',
  currentProject: null,
  projects: [],
  chatMessages: [],
  history: [],
  historyIndex: -1,
  viewMode: 'desktop',
  builderTab: 'preview',
  selectedSectionId: null,
  isGenerating: false,
  generationStep: 0,
  isPublishing: false,
  publishStep: 0,
  showCodeView: false,
  showAddSection: false,
  showThemePanel: false,
  showExportMenu: false,
  showMobileChat: false,
  toasts: [],
  isAuthenticated: false,
  showAuthModal: false,
  lastSaved: null,
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(l => l());
}

export function getState(): AppState {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial };
  notify();
}

// Persistence
export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadCurrentProject(): Project | null {
  try {
    const data = localStorage.getItem(CURRENT_PROJECT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveCurrentProject(project: Project | null) {
  if (project) {
    localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
  } else {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
}

// Actions
export function addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = `toast_${Date.now()}`;
  setState({ toasts: [...state.toasts, { id, message, type }] });
  setTimeout(() => {
    setState({ toasts: state.toasts.filter(t => t.id !== id) });
  }, 3000);
}

export function pushHistory(website: WebsiteConfig, label: string) {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push({ website: JSON.parse(JSON.stringify(website)), timestamp: new Date().toISOString(), label });
  setState({ history: newHistory, historyIndex: newHistory.length - 1 });
}

export function undo() {
  if (state.historyIndex > 0 && state.currentProject) {
    const newIndex = state.historyIndex - 1;
    const website = JSON.parse(JSON.stringify(state.history[newIndex].website)) as WebsiteConfig;
    const updatedProject = { ...state.currentProject, website, updatedAt: new Date().toISOString() };
    setState({ historyIndex: newIndex, currentProject: updatedProject });
    saveCurrentProject(updatedProject);
    addToast('Undone', 'info');
  }
}

export function redo() {
  if (state.historyIndex < state.history.length - 1 && state.currentProject) {
    const newIndex = state.historyIndex + 1;
    const website = JSON.parse(JSON.stringify(state.history[newIndex].website)) as WebsiteConfig;
    const updatedProject = { ...state.currentProject, website, updatedAt: new Date().toISOString() };
    setState({ historyIndex: newIndex, currentProject: updatedProject });
    saveCurrentProject(updatedProject);
    addToast('Redone', 'info');
  }
}

export function saveProject(showToast = true) {
  if (state.currentProject) {
    const updated = { ...state.currentProject, updatedAt: new Date().toISOString() };
    const projects = state.projects.map(p => p.id === updated.id ? updated : p);
    if (!projects.find(p => p.id === updated.id)) {
      projects.push(updated);
    }
    setState({ projects, currentProject: updated, lastSaved: new Date().toISOString() });
    saveProjects(projects);
    saveCurrentProject(updated);
    if (showToast) addToast('Project saved!', 'success');
  }
}

// Auto-save: called after any website update
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
export function autoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveProject(false);
  }, 1500);
}

export function deleteProject(id: string) {
  const projects = state.projects.filter(p => p.id !== id);
  saveProjects(projects);
  setState({ projects });
  if (state.currentProject?.id === id) {
    setState({ currentProject: null, view: 'dashboard' });
    saveCurrentProject(null);
  }
  addToast('Project deleted', 'info');
}

export function duplicateProject(id: string) {
  const project = state.projects.find(p => p.id === id);
  if (project) {
    const newProject: Project = {
      ...JSON.parse(JSON.stringify(project)),
      id: `project_${Date.now()}`,
      name: project.name + ' (Copy)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const projects = [...state.projects, newProject];
    saveProjects(projects);
    setState({ projects });
    addToast('Project duplicated!', 'success');
  }
}

export function renameProject(id: string, name: string) {
  const projects = state.projects.map(p => p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p);
  saveProjects(projects);
  setState({ projects });
  if (state.currentProject?.id === id) {
    setState({ currentProject: { ...state.currentProject, name } });
  }
  addToast('Project renamed', 'success');
}

export function updateWebsite(website: WebsiteConfig) {
  if (state.currentProject) {
    const updated = { ...state.currentProject, website, updatedAt: new Date().toISOString() };
    setState({ currentProject: updated });
    saveCurrentProject(updated);
    const projects = state.projects.map(p => p.id === updated.id ? updated : p);
    if (!projects.find(p => p.id === updated.id)) {
      projects.push(updated);
    }
    setState({ projects });
    saveProjects(projects);
  }
}

export function selectSection(id: string | null) {
  setState({ selectedSectionId: id });
}

export function setView(view: AppView) {
  setState({ view });
}

export function setViewMode(mode: ViewMode) {
  setState({ viewMode: mode });
}

export function setBuilderTab(tab: BuilderTab) {
  setState({ builderTab: tab });
}

export function updateTheme(themeSettings: ThemeSettings) {
  if (state.currentProject) {
    const website = { ...state.currentProject.website, themeSettings };
    updateWebsite(website);
    pushHistory(website, 'Theme updated');
  }
}

// Initialize
export function initializeStore() {
  const projects = loadProjects();
  const currentProject = loadCurrentProject();
  setState({ projects, currentProject: currentProject || null });
}
