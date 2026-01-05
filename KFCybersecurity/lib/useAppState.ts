'use client';

import { useState, useEffect } from 'react';
import { ActiveDeployments } from '@/types';
import { defaultDeployments, clients } from './data';

export function useAppState() {
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeployments>(defaultDeployments);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('kf_adminMode');
      const savedDeployments = localStorage.getItem('kf_deployments');
      const savedClient = localStorage.getItem('kf_selectedClient');

      if (savedMode !== null) {
        setIsAdminMode(savedMode === 'true');
      }

      if (savedDeployments) {
        setActiveDeployments(JSON.parse(savedDeployments));
      }

      if (savedClient && clients.includes(savedClient)) {
        setSelectedClient(savedClient);
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem('kf_adminMode', isAdminMode.toString());
      localStorage.setItem('kf_deployments', JSON.stringify(activeDeployments));
      localStorage.setItem('kf_selectedClient', selectedClient);
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [isAdminMode, activeDeployments, selectedClient, isLoaded]);

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
  };

  const deployService = (serviceId: number) => {
    setActiveDeployments((prev) => ({
      ...prev,
      [selectedClient]: [...(prev[selectedClient] || []), serviceId],
    }));
  };

  const toggleSubscription = (serviceId: number) => {
    setActiveDeployments((prev) => {
      const currentDeployments = prev[selectedClient] || [];
      const index = currentDeployments.indexOf(serviceId);

      if (index > -1) {
        // Remove
        return {
          ...prev,
          [selectedClient]: currentDeployments.filter((id) => id !== serviceId),
        };
      } else {
        // Add
        return {
          ...prev,
          [selectedClient]: [...currentDeployments, serviceId],
        };
      }
    });
  };

  return {
    isAdminMode,
    selectedClient,
    activeDeployments,
    isLoaded,
    toggleAdminMode,
    setSelectedClient,
    deployService,
    toggleSubscription,
  };
}
