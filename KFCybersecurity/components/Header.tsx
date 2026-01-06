'use client';

import { signOut } from 'next-auth/react';

interface HeaderProps {
  title: string;
  isAdminMode: boolean;
  selectedClient: string;
  clients: Array<{ id: string; name: string }>;
  onClientChange: (client: string) => void;
  onModeToggle: () => void;
  showClientSelector: boolean;
}

export default function Header({
  title,
  isAdminMode,
  selectedClient,
  clients,
  onClientChange,
  onModeToggle,
  showClientSelector,
}: HeaderProps) {
  return (
    <div className="h-[70px] border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--bg-panel)]">
      <h2 className="text-2xl font-semibold">{title}</h2>
      
      <div className="flex items-center gap-5">
        {showClientSelector && (
          <div className="flex items-center gap-2.5">
            <span className="text-[var(--text-secondary)] text-sm">Managing:</span>
            <select
              value={selectedClient}
              onChange={(e) => onClientChange(e.target.value)}
              className="bg-[var(--bg-dark)] text-[var(--text-primary)] border border-[var(--border)] px-2 py-2 rounded-md cursor-pointer"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-4 py-2 rounded-md text-white font-medium text-sm transition-colors duration-200 bg-red-500 hover:opacity-90"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
}
