export interface CatalogueValidationInput {
  resources: Array<Record<string, any>>;
  creators: Array<Record<string, any>>;
  subjects: Array<Record<string, any>>;
  chapters: Array<Record<string, any>>;
}
export function validateCatalogue(data: CatalogueValidationInput): string[];
