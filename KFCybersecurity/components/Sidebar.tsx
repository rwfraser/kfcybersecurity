'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export default function Sidebar() {
  const navItems: NavItem[] = [
    { label: 'Overview', icon: 'tachometer-alt', active: true },
    { label: 'Clients', icon: 'users' },
    { label: 'Marketplace', icon: 'box-open' },
    { label: 'Compliance', icon: 'file-contract' },
  ];

  const bottomItems: NavItem[] = [
    { label: 'Settings', icon: 'cog' },
    { label: 'Logout', icon: 'sign-out-alt', danger: true },
  ];

  return (
    <div className="w-[260px] bg-[var(--bg-panel)] border-r border-[var(--border)] flex flex-col p-5">
      <div className="flex items-center gap-2.5 mb-10 text-[var(--accent)] text-xl font-bold">
        <i className="fas fa-shield-alt"></i>
        <span>KFCybersecurity</span>
      </div>

      <nav className="flex-1 flex flex-col">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2.5 px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
              item.active
                ? 'bg-[var(--bg-dark)] text-[var(--text-primary)] border-l-[3px] border-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-dark)] hover:text-[var(--text-primary)] hover:border-l-[3px] hover:border-[var(--accent)]'
            }`}
            onClick={item.onClick}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}

        <div className="mt-auto">
          {bottomItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
                item.danger
                  ? 'text-[var(--danger)] hover:bg-[var(--bg-dark)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-dark)] hover:text-[var(--text-primary)]'
              }`}
              onClick={item.onClick}
            >
              <i className={`fas fa-${item.icon}`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
