'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';
import Modal from '@/components/Modal';
import { useToast } from '@/components/ToastProvider';
import { useAppState } from '@/lib/useAppState';

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    isAdminMode,
    selectedClient,
    activeDeployments,
    isLoaded,
    toggleAdminMode,
    setSelectedClient,
    deployService: handleDeployService,
    toggleSubscription,
  } = useAppState();

  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [services, setServices] = useState<any[]>([]);

  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // Fetch services and clients
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch services
        const servicesRes = await fetch('/api/services');
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData);
        }

        // Fetch clients if admin
        if (isAdminMode) {
          const clientsRes = await fetch('/api/clients');
          if (clientsRes.ok) {
            const clientsData = await clientsRes.json();
            setClients(clientsData);
          }
        } else if (session?.user?.clientId && session?.user?.clientName) {
          setClients([{ id: session.user.clientId, name: session.user.clientName }]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    if (isLoaded) {
      loadData();
    }
  }, [isLoaded, isAdminMode, session]);

  const handleDeploy = (serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      handleDeployService(serviceId);
      showToast(`${service.name} deployed to ${selectedClient}`, 'success');
    }
  };

  const handleManage = (serviceName: string) => {
    setModalTitle(serviceName);
    setModalOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  const title = isAdminMode ? 'Service Command Center' : 'My Service Portal (A La Carte)';
  const currentDeployments = activeDeployments[selectedClient] || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header
          title={title}
          isAdminMode={isAdminMode}
          selectedClient={selectedClient}
          clients={clients}
          onClientChange={setSelectedClient}
          onModeToggle={toggleAdminMode}
          showClientSelector={isAdminMode}
        />

        <div className="p-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {services.map((service) => {
              const isDeployed = currentDeployments.includes(service.id);
              
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isDeployed={isDeployed}
                  isAdminMode={isAdminMode}
                  clientName={selectedClient}
                  onDeploy={handleDeploy}
                  onToggleSubscription={toggleSubscription}
                  onManage={handleManage}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
