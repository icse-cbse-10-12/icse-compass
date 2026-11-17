import { readFile } from 'node:fs/promises';
import type { Creator, Resource } from '#lib/catalogue.ts';

type CatalogueMeta = { mode?: string; foundationMode?: boolean };

async function readJson<T>(path: string): Promise<T> {
  const content = await readFile(new URL(path, import.meta.url), 'utf8');
  return JSON.parse(content) as T;
}

export async function load() {
  const [creatorData, resourceData, meta] = await Promise.all([
    readJson<Creator[]>('../../../static/data/creators.json'),
    readJson<Resource[]>('../../../static/data/resources.json'),
    readJson<CatalogueMeta>('../../../static/data/catalogue-meta.json')
  ]);

  return {
    creators: creatorData.filter((creator) => creator.status === 'published'),
    resources: resourceData.filter((resource) => resource.status === 'published'),
    foundationMode: meta.foundationMode === true || meta.mode === 'foundation'
  };
}
