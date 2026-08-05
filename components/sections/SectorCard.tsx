import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';

interface SectorCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  solutionsCount: number;
}

export function SectorCard({ id, name, description, image, solutionsCount }: SectorCardProps) {
  return (
    <Link
      href={{ pathname: '/sectores/[sector]', params: { sector: id } } as any}
      className={cn(
        'group relative block aspect-[4/5] overflow-hidden bg-bone',
        'transition-all duration-400 ease-soft'
      )}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 ease-soft group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-paper">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-paper/70">+{solutionsCount} soluciones</span>
          <ArrowUpRight
            className="h-5 w-5 transition-transform duration-250 ease-soft group-hover:translate-x-1 group-hover:-translate-y-1"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="h3 text-paper">{name}</h3>
        <p className="body-s text-paper/80">{description}</p>
      </div>
    </Link>
  );
}
