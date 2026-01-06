'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ActiveDeployments } from '@/types';

export function useAppState() {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeployments>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const isAdminMode = session?.user?.role === 'ADMIN';

  // Fetch clients and deployments from API
  useEffect(() => {
    async function loadData() {
      if (status === 'loading') return;
      if (!session) {
        setIsLoaded(true);
        return;
      }

      try {
        // Fetch clients (admin only)
        if (isAdminMode) {
          const clientsRes = await fetch('/api/clients');
          if (clientsRes.ok) {
            const clientsData = await clientsRes.json();
            setClients(clientsData);
            
            // Set first client as selected by default
            if (clientsData.length > 0) {
              setSelectedClient(clientsData[0].name);
              setSelectedClientId(clientsData[0].id);
            }
          }
        } else {
          // For client users, use their client info from session
          if (session.user.clientName && session.user.clientId) {
            setSelectedClient(session.user.clientName);
            setSelectedClientId(session.user.clientId);
            setClients([{ id: session.user.clientId, name: session.user.clientName }]);
          }
        }

        // Fetch deployments
        await fetchDeployments();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, [status, session]);

  // Fetch deployments when selected client changes
  useEffect(() => {
    if (isLoaded && selectedClientId) {
      fetchDeployments();
    }
  }, [selectedClientId]);

  async function fetchDeployments() {
    if (!selectedClientId) return;

    try {
      const res = await fetch(`/api/deployments?clientId=${selectedClientId}`);
      if (res.ok) {
        const deploymentsData = await res.json();
        const serviceIds = deploymentsData.map((d: any) => d.serviceId);
        setActiveDeployments({
          [selectedClient]: serviceIds,
        });
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
    }
  }

  const handleClientChange = (clientName: string) => {
    setSelectedClient(clientName);
    const client = clients.find(c => c.name === clientName);
    if (client) {
      setSelectedClientId(client.id);
    }
  };

  const deployService = async (serviceId: number) => {
    if (!selectedClientId) return;

    try {
      const res = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClientId, serviceId }),
      });

      if (res.ok) {
        await fetchDeployments();
      } else {
        const error = await res.json();
        console.error('Failed to deploy service:', error);
      }
    } catch (error) {
      console.error('Error deploying service:', error);
    }
  };

  const toggleSubscription = async (serviceId: number) => {
    if (!selectedClientId) return;

    const currentDeployments = activeDeployments[selectedClient] || [];
    const isDeployed = currentDeployments.includes(serviceId);

    try {
      if (isDeployed) {
        // Remove deployment
        const res = await fetch(`/api/deployments?clientId=${selectedClientId}&serviceId=${serviceId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          await fetchDeployments();
        }
      } else {
        // Add deployment
        await deployService(serviceId);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  return {
    isAdminMode,
    selectedClient,
    activeDeployments,
    isLoaded,
    toggleAdminMode: () => {}, // No-op since role is determined by session
    setSelectedClient: handleClientChange,
    deployService,
    toggleSubscription,
  };
}
