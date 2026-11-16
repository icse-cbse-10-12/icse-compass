import type { Chapter, Subject } from './catalogue';
export type StudyStatus = 'not-started' | 'learning' | 'practised' | 'completed' | 'needs-revision';
export interface StudySnapshot { version: 1; customSubjects: Subject[]; customChapters: Chapter[]; progress: Record<string, StudyStatus> }
export interface StudySummary { total: number; notStarted: number; learning: number; practised: number; completed: number; needsRevision: number; percent: number }
export const STUDY_STORAGE_KEY = 'icse-compass.study.v1';
export function emptyStudySnapshot(): StudySnapshot { return { version: 1, customSubjects: [], customChapters: [], progress: {} }; }
function isSubject(value: unknown): value is Subject { if (!value || typeof value !== 'object') return false; const v=value as Partial<Subject>; return typeof v.id==='string'&&typeof v.name==='string'&&typeof v.sortOrder==='number'&&v.status==='published'; }
function isChapter(value: unknown): value is Chapter { if (!value || typeof value !== 'object') return false; const v=value as Partial<Chapter>; return typeof v.id==='string'&&typeof v.subjectId==='string'&&typeof v.name==='string'&&typeof v.sortOrder==='number'&&v.status==='published'; }
export function parseStudySnapshot(raw: string | null): StudySnapshot {
 if(!raw)return emptyStudySnapshot(); try { const value:unknown=JSON.parse(raw); if(!value||typeof value!=='object')return emptyStudySnapshot(); const c=value as Partial<StudySnapshot>;
 if(c.version!==1||!Array.isArray(c.customSubjects)||!Array.isArray(c.customChapters)||!c.progress||typeof c.progress!=='object'||Array.isArray(c.progress))return emptyStudySnapshot();
 const progress:Record<string,StudyStatus>={}; const allowed:StudyStatus[]=['not-started','learning','practised','completed','needs-revision'];
 for(const [k,v] of Object.entries(c.progress))if(allowed.includes(v as StudyStatus))progress[k]=v as StudyStatus;
 return {version:1,customSubjects:c.customSubjects.filter(isSubject),customChapters:c.customChapters.filter(isChapter),progress};
 } catch { return emptyStudySnapshot(); }
}
export function mergeStudyStructure<T extends {id:string}>(published:T[],local:T[]):T[]{const m=new Map<string,T>();for(const x of published)m.set(x.id,x);for(const x of local)if(!m.has(x.id))m.set(x.id,x);return [...m.values()];}
export function chapterProgressKey(subjectId:string,chapterId:string):string{return subjectId+'::'+chapterId;}
export function getChapterStatus(progress:Record<string,StudyStatus>,subjectId:string,chapterId:string):StudyStatus{return progress[chapterProgressKey(subjectId,chapterId)]??'not-started';}
export function getStudySummary(chapters:Chapter[],progress:Record<string,StudyStatus>):StudySummary{
 const s:StudySummary={total:chapters.length,notStarted:0,learning:0,practised:0,completed:0,needsRevision:0,percent:0};
 for(const c of chapters)switch(getChapterStatus(progress,c.subjectId,c.id)){case'learning':s.learning++;break;case'practised':s.practised++;break;case'completed':s.completed++;break;case'needs-revision':s.needsRevision++;break;default:s.notStarted++;}
 s.percent=s.total?Math.round(s.completed/s.total*100):0;return s;
}
export function createLocalId(prefix:string,name:string,existingIds:string[]):string{
 const slug=name.trim().toLocaleLowerCase('en-IN').normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
 const base=prefix+'-'+slug;let id=base;let n=2;while(existingIds.includes(id)){id=base+'-'+n;n++;}return id;
}