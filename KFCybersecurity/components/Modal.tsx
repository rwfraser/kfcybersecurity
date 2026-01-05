'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export default function Modal({ isOpen, title, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="w-[900px] h-[80vh] bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-panel)]">
          <div>
            <h2 className="text-xl font-semibold">{title} // Dashboard</h2>
            <span className="text-[var(--success)] text-xs">● Live Connection Established</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)] rounded hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors duration-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-[2fr_1fr] gap-5">
            <div className="bg-[var(--bg-panel)] p-5 rounded-lg">
              <h4 className="mb-4 font-semibold">Live Threat Activity</h4>
              <div className="h-[150px] flex items-center justify-center text-[var(--text-secondary)]">
                <p>Chart visualization would go here</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="bg-[var(--bg-panel)] p-5 rounded-lg text-center">
                <div className="text-3xl font-bold text-[var(--accent)] mb-1">
                  {Math.floor(Math.random() * (100 - 80) + 80)}%
                </div>
                <div className="text-[var(--text-secondary)] text-sm">Compliance Score</div>
              </div>
              <div className="bg-[var(--bg-panel)] p-5 rounded-lg text-center">
                <div className="text-3xl font-bold text-[var(--danger)] mb-1">
                  {Math.floor(Math.random() * 5)}
                </div>
                <div className="text-[var(--text-secondary)] text-sm">Active Threats</div>
              </div>
              <div className="bg-[var(--bg-panel)] p-5 rounded-lg text-center">
                <div className="text-3xl font-bold text-[var(--success)] mb-1">142</div>
                <div className="text-[var(--text-secondary)] text-sm">Agents Online</div>
              </div>
            </div>
          </div>

          <h4 className="mt-5 mb-2.5 font-semibold">Application Controls</h4>
          <div className="grid grid-cols-4 gap-4">
            <button className="px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-md hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              <i className="fas fa-sync mr-2"></i> Force Scan
            </button>
            <button className="px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-md hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              <i className="fas fa-file-download mr-2"></i> Export Logs
            </button>
            <button className="px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] rounded-md hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors duration-200">
              <i className="fas fa-wrench mr-2"></i> Configure Policies
            </button>
            <button className="px-4 py-2 border border-[var(--danger)] text-[var(--danger)] rounded-md hover:bg-[var(--danger)] hover:text-white transition-all duration-200">
              <i className="fas fa-power-off mr-2"></i> Isolate Host
            </button>
          </div>

          <h4 className="mt-5 mb-2.5 font-semibold">Recent Logs</h4>
          <div className="bg-black p-4 rounded-md font-mono text-green-400 text-xs h-[150px] overflow-y-auto">
            <div>&gt; [12:01:45] System check initiated...</div>
            <div>&gt; [12:01:48] Agent #442 connected from *************</div>
            <div>&gt; [12:02:10] Policy update received from Master Server</div>
            <div>&gt; [12:05:00] Routine scan completed. 0 threats found.</div>
            <div>&gt; [12:06:12] Heartbeat signal sent...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
