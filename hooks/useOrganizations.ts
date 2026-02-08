
import { useState, useEffect } from 'react';
import { Organization, Employee } from '../types';
import { db } from '../services/LocalStorageDB';
import api from '../services/api';

export const useOrganizations = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizations = async () => {
        try {
            setIsLoading(true);
            const response = await api.organizations.getAll({ limit: 100 });
            if (response.success) {
                setOrganizations(response.data.items);
            } else {
                setError(response.message || 'Failed to fetch organizations');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();

        const handleDbChange = () => {
            fetchOrganizations();
        };

        window.addEventListener('navbat_db_change', handleDbChange);
        return () => {
            window.removeEventListener('navbat_db_change', handleDbChange);
        };
    }, []);

    const addOrganization = async (org: Organization) => {
        await api.organizations.save(org);
        fetchOrganizations();
    };

    const updateOrganization = async (org: Organization) => {
        await api.organizations.save(org);
        fetchOrganizations();
    };

    const deleteOrganization = async (id: string) => {
        await api.organizations.delete(id);
        fetchOrganizations();
    };

    return {
        organizations,
        isLoading,
        error,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        refresh: fetchOrganizations
    };
};
