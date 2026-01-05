'use client';

import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  isDeployed: boolean;
  isAdminMode: boolean;
  clientName: string;
  onDeploy: (id: number) => void;
  onToggleSubscription: (id: number) => void;
  onManage: (name: string) => void;
}

const verticalColors: Record<string, string> = {
  Identify: 'bg-blue-500/20 text-blue-400',
  Protect: 'bg-green-500/20 text-green-400',
  Detect: 'bg-orange-500/20 text-orange-400',
  Respond: 'bg-purple-500/20 text-purple-400',
  Recover: 'bg-cyan-500/20 text-cyan-400',
  Govern: 'bg-pink-500/20 text-pink-400',
};

export default function ServiceCard({
  service,
  isDeployed,
  isAdminMode,
  clientName,
  onDeploy,
  onToggleSubscription,
  onManage,
}: ServiceCardProps) {
  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] relative">
      <div className="flex justify-between mb-4">
        <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${verticalColors[service.vertical]}`}>
          {service.vertical}
        </span>
        <i className="fas fa-server text-[var(--text-secondary)]"></i>
      </div>

      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-5">{service.desc}</p>

      {isAdminMode ? (
        <>
          <div className="flex items-center justify-between">
            {isDeployed ? (
              <span className="text-[var(--success)] text-sm flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]"></span>
                Active on {clientName}
              </span>
            ) : (
              <span className="text-[var(--text-secondary)] text-sm flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--text-secondary)]"></span>
                Not Deployed
              </span>
            )}
          </div>

          {isDeployed ? (
            <button
              onClick={() => onManage(service.name)}
              className="w-full mt-4 px-4 py-2.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] font-semibold transition-all duration-200 hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            >
              <i className="fas fa-sliders-h mr-2"></i>
              Manage App
            </button>
          ) : (
            <button
              onClick={() => onDeploy(service.id)}
              className="w-full mt-4 px-4 py-2.5 rounded-md bg-[var(--accent)] text-white font-semibold transition-all duration-200 hover:opacity-90"
            >
              <i className="fas fa-rocket mr-2"></i>
              Deploy to {clientName}
            </button>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[var(--accent)] font-bold">{service.price}</span>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">{isDeployed ? 'Subscribed' : 'Add to Plan'}</span>
            <label className="relative inline-block w-[50px] h-6 cursor-pointer">
              <input
                type="checkbox"
                checked={isDeployed}
                onChange={() => onToggleSubscription(service.id)}
                className="opacity-0 w-0 h-0 peer"
              />
              <span className="absolute inset-0 bg-[var(--border)] rounded-full transition-all duration-300 peer-checked:bg-[var(--success)] before:content-[''] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-[26px]"></span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
