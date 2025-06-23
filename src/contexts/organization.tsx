"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { trpc } from '@/app/_trpc/client';
import type { Organization } from '@/routers/organization';

interface OrganizationContextType {
    data?: Organization;
    isPending: boolean;
    refetch: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

type OrganizationProviderProps = {
    slug: string
    userId: string
    children: ReactNode
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ slug, userId, children }) => {
    const {
        data,
        isPending,
        refetch
    } = trpc.organization.get.useQuery(
        { slug, userId },
        { retry: false }
    );

    const contextValue = {
        data,
        isPending,
        refetch
    };

    return (
        <OrganizationContext.Provider value={contextValue}>
            {children}
        </OrganizationContext.Provider>
    );
};

export const useOrganization = (): OrganizationContextType => {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
};