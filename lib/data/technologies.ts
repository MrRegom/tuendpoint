export interface Technology {
  name: string;
  category: 'language' | 'framework' | 'database' | 'infrastructure' | 'protocol';
}

export const technologies: Technology[] = [
  { name: 'PHP', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'JavaScript', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'Django', category: 'framework' },
  { name: 'React', category: 'framework' },
  { name: 'Next.js', category: 'framework' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MariaDB', category: 'database' },
  { name: 'Redis', category: 'database' },
  { name: 'Docker', category: 'infrastructure' },
  { name: 'Linux', category: 'infrastructure' },
  { name: 'Nginx', category: 'infrastructure' },
  { name: 'REST', category: 'protocol' },
  { name: 'HL7', category: 'protocol' },
  { name: 'FHIR', category: 'protocol' },
];

export const stats = {
  projects: { value: '50+', label: { es: 'Proyectos en producción', en: 'Projects in production' } },
  solutions: { value: '19', label: { es: 'Soluciones en catálogo', en: 'Solutions in catalog' } },
  sectors: { value: '6', label: { es: 'Sectores con experiencia', en: 'Sectors with experience' } },
  integrations: { value: 'HL7 · FHIR', label: { es: 'Integración clínica y FONASA', en: 'Clinical and FONASA integration' } },
};
