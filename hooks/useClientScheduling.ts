
import { useState } from 'react';
import { Organization, Service } from '../types';

export const useClientScheduling = () => {
    const [selectedOrgForQueue, setSelectedOrgForQueue] = useState<Organization | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const resetScheduling = () => {
        setSelectedOrgForQueue(null);
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
    };
    const addAppointment = async (clientPhone: string): Promise<boolean> => {
        if (!selectedOrgForQueue || !selectedService || !selectedDate || !selectedTime) return false;

        try {
            const { default: api } = await import('../services/api');
            const appointmentTime = new Date(`${selectedDate}T${selectedTime}`).getTime();

            const response = await api.queues.join({
                organizationId: selectedOrgForQueue.id,
                serviceId: selectedService.id,
                userPhone: clientPhone,
                appointmentTime
            });

            if (response.success) {
                resetScheduling();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add appointment:', error);
            return false;
        }
    };

    return {
        selectedOrgForQueue, setSelectedOrgForQueue,
        selectedService, setSelectedService,
        selectedDate, setSelectedDate,
        selectedTime, setSelectedTime,
        resetScheduling,
        addAppointment
    };
};
