// FD-011: Tabs component with animated active indicator

"use client";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, activeTab, onChange, children }: TabsProps) {
  return (
    <div>
      <div className="bg-[#111111] rounded-lg p-1 flex" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2
              px-4 py-2 text-sm font-medium
              rounded-md transition-all duration-200
              ${
                tab.id === activeTab
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white"
              }
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
