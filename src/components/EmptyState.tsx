import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inline SVG illustrations for different empty state types
const illustrations = {
  transactions: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <rect x="35" y="40" width="50" height="8" rx="4" className="fill-muted-foreground/15" />
      <rect x="35" y="54" width="40" height="8" rx="4" className="fill-muted-foreground/10" />
      <rect x="35" y="68" width="45" height="8" rx="4" className="fill-muted-foreground/15" />
      <path d="M60 25 L65 35 L55 35Z" className="fill-primary/30" />
      <path d="M60 95 L55 85 L65 85Z" className="fill-primary/20" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <path d="M60 35 C48 35 40 45 40 55 L40 70 L35 78 L85 78 L80 70 L80 55 C80 45 72 35 60 35Z" className="fill-muted-foreground/15" strokeLinecap="round" />
      <circle cx="60" cy="82" r="5" className="fill-muted-foreground/20" />
      <line x1="55" y1="30" x2="65" y2="30" className="stroke-primary/30" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  cards: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <rect x="28" y="42" width="64" height="40" rx="6" className="fill-muted-foreground/15" />
      <rect x="28" y="52" width="64" height="10" className="fill-muted-foreground/10" />
      <rect x="35" y="70" width="20" height="5" rx="2" className="fill-primary/25" />
      <rect x="60" y="70" width="12" height="5" rx="2" className="fill-muted-foreground/10" />
    </svg>
  ),
  rewards: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <polygon points="60,28 66,48 88,48 70,60 76,80 60,68 44,80 50,60 32,48 54,48" className="fill-primary/20" />
      <circle cx="60" cy="55" r="8" className="fill-primary/15" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <circle cx="52" cy="52" r="18" className="stroke-muted-foreground/20" strokeWidth="4" />
      <line x1="65" y1="65" x2="82" y2="82" className="stroke-muted-foreground/20" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <circle cx="60" cy="58" r="22" className="fill-primary/15" />
      <text x="60" y="65" textAnchor="middle" className="fill-primary/30" fontSize="24" fontWeight="bold">৳</text>
    </svg>
  ),
  generic: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/50" />
      <rect x="40" y="38" width="40" height="44" rx="4" className="fill-muted-foreground/15" />
      <rect x="48" y="48" width="24" height="3" rx="1.5" className="fill-muted-foreground/10" />
      <rect x="48" y="56" width="18" height="3" rx="1.5" className="fill-muted-foreground/10" />
      <rect x="48" y="64" width="21" height="3" rx="1.5" className="fill-muted-foreground/10" />
    </svg>
  ),
};

export type EmptyStateType = keyof typeof illustrations;

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ type = "generic", icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in ${className}`}>
      <div className="h-24 w-24 mb-4">
        {illustrations[type]}
      </div>
      {Icon && (
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3 -mt-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      {description && <p className="text-xs text-muted-foreground max-w-[250px]">{description}</p>}
      {action && (
        <Button size="sm" className="mt-4 gradient-primary text-primary-foreground" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
