import { FileText, Dices, FolderSearch, Settings as SettingsIcon, Eye } from "lucide-react";
import type { Page } from "../App";

interface SidebarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { page: Page; label: string; icon: typeof FileText }[] = [
  { page: "character", label: "Ficha", icon: FileText },
  { page: "rolls", label: "Rolagens", icon: Dices },
  { page: "investigation", label: "Investigação", icon: FolderSearch },
  { page: "settings", label: "Configurações", icon: SettingsIcon },
];

export default function Sidebar({ page, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop: barra lateral fixa */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-parchment/10 md:bg-charcoal md:px-3 md:py-6">
        <button
          onClick={() => onNavigate("home")}
          className="mb-10 flex items-center gap-2.5 rounded-sm px-2 py-1 text-left transition-colors hover:bg-charcoal2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood"
        >
          <Eye size={20} className="text-blood" strokeWidth={1.75} />
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.15em] text-parchment leading-tight">
              PROFANE
            </p>
            <p className="text-[10px] text-parchment2/50 leading-tight">dossiê de investigação</p>
          </div>
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ page: p, label, icon: Icon }) => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood ${
                page === p
                  ? "border-l-2 border-blood bg-blood/15 text-parchment"
                  : "border-l-2 border-transparent text-parchment2/65 hover:bg-charcoal2 hover:text-parchment"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile: barra inferior compacta */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-parchment/10 bg-charcoal/95 backdrop-blur-sm md:hidden">
        {NAV_ITEMS.map(({ page: p, label, icon: Icon }) => (
          <button
            key={p}
            onClick={() => onNavigate(p)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
              page === p ? "text-parchment" : "text-parchment2/55"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} className={page === p ? "text-blood" : ""} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
