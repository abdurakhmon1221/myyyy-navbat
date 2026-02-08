import React from 'react';
import BusinessProfileForm, { BusinessProfile, BUSINESS_CATEGORIES } from '../shared/BusinessProfileForm';
import { Organization } from '../../types';

interface OrgSettingsProps {
    organization: Organization;
    onSaveOrganization: (org: Organization) => Promise<void>;
}

const OrgSettings: React.FC<OrgSettingsProps> = ({ organization, onSaveOrganization }) => {

    // Convert Organization to BusinessProfile format
    const profileFromOrg = (): Partial<BusinessProfile> => ({
        id: organization.id,
        name: organization.name,
        phone: organization.phone || '',
        email: organization.email,
        website: organization.website,
        address: organization.address,
        telegram: organization.telegram,
        instagram: organization.instagram,
        category: organization.category,
        description: organization.description,
        image: organization.image,
        avgServiceTime: organization.avgServiceTime || 15,
        maxQueueSize: organization.maxQueueSize || 50
    });

    const handleSaveProfile = async (profile: BusinessProfile) => {
        // Convert back to Organization format
        const updatedOrg: Organization = {
            ...organization,
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            website: profile.website,
            address: profile.address,
            telegram: profile.telegram,
            instagram: profile.instagram,
            category: profile.category as Organization['category'],
            description: profile.description,
            image: profile.image,
            avgServiceTime: profile.avgServiceTime,
            maxQueueSize: profile.maxQueueSize
        };

        await onSaveOrganization(updatedOrg);
    };

    return (
        <div className="max-w-2xl mx-auto px-4">
            <BusinessProfileForm
                profile={profileFromOrg()}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default OrgSettings;
