// FD-015: Collapsible sidebar for dashboard layouts

"use client";

import { ChevronLeft } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  items,
  activeItem,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`
        bg-[#111111] border-r border-white/[0.06]
        h-[calc(100vh-4rem)] sticky top-16
        transition-all duration-200 ease-out
        flex flex-col
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      <nav className="flex-1 py-4">
        {items.map((item) => {
          const isActive = item.id === activeItem;
          const content = (
            <div
              className={`
                flex items-center gap-3 px-4 py-3
                transition-colors duration-100 cursor-pointer
                ${
                  isActive
                    ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500"
                    : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium truncate transition-opacity duration-100">
                  {item.label}
                </span>
              )}
            </div>
          );

          if (item.href) {
            return (
              <a key={item.id} href={item.href}>
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="w-full text-left"
            >
              {content}
            </button>
          );
        })}
      </nav>

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="p-4 border-t border-white/[0.06] text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-200 mx-auto ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </aside>
  );
}
