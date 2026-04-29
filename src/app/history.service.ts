import { Injectable } from '@angular/core';

export interface ArchitectureSnapshot {
  id: string;
  timestamp: Date;
  requirement: string;
  solutionSummary: string;
  frontend: string;
  backend: string;
  database: string;
  realtime: string;
  reporting: string;
  justification: string;
  mermaidDiagram: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly STORAGE_KEY = 'arch_history';

  getAll(): ArchitectureSnapshot[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  save(snapshot: Omit<ArchitectureSnapshot, 'id' | 'timestamp'>): ArchitectureSnapshot {
    const all = this.getAll();
    const entry: ArchitectureSnapshot = {
      ...snapshot,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    all.unshift(entry); // newest first
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all.slice(0, 20))); // cap at 20
    return entry;
  }

  delete(id: string): void {
    const filtered = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}