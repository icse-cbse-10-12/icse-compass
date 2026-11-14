import { readFileSync } from 'node:fs';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Creator, Resource } from '#lib/catalogue.ts';

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(new URL('../../../../static/data/' + name, import.meta.url), 'utf8')) as T;
}

export const prerender = true;

export function entries() {
  const creators = readJson<Creator[]>('creators.json');
  return creators.filter((creator) => creator.status === 'published').map((creator) => ({ creatorId: creator.id }));
}

export const load: PageServerLoad = ({ params }) => {
  const creators = readJson<Creator[]>('creators.json');
  const creator = creators.find((item) => item.id === params.creatorId && item.status === 'published');
  if (!creator) error(404, 'Educator profile not found');
  const resources = readJson<Resource[]>('resources.json').filter((resource) => resource.creatorId === creator.id && resource.status === 'published');
  return { creator, resources };
};
