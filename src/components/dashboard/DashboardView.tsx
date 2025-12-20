/**
 * Dashboard View Container
 *
 * Phase 6.5: Main container that routes to the correct dashboard section
 * based on the active section prop.
 */

'use client';

import type { DashboardSection, ClientClient } from '@/types/chat';
import { DashboardOverview } from './DashboardOverview';
import { DashboardClients } from './DashboardClients';
import { DashboardProfile } from './DashboardProfile';
import { DashboardSettings } from './DashboardSettings';

export interface DashboardViewProps {
  section: DashboardSection;
  clients: ClientClient[];
  currentClient: ClientClient | null;
  totalConversations: number;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accountType?: 'business' | 'education' | 'instructor';
    usageTier?: 'free' | 'student' | 'pro' | 'agency' | 'enterprise';
    subscriptionStatus?: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
    subscriptionEndDate?: string | null;
    trialEndDate?: string | null;
  };
  userStats?: {
    totalClients: number;
    totalConversations: number;
    totalMessages: number;
  };
  onSectionChange: (section: DashboardSection) => void;
  onClientCreate: () => void;
  onClientSelect: (clientId: string) => void;
  onClientDelete: (clientId: string) => void;
  onClientEdit: (client: ClientClient) => void;
  onConfigurePlatforms: (client: ClientClient) => void;
  onEditProfile: () => void;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export function DashboardView({
  section,
  clients,
  currentClient,
  totalConversations,
  user,
  userStats,
  onSectionChange,
  onClientCreate,
  onClientSelect,
  onClientDelete,
  onClientEdit,
  onConfigurePlatforms,
  onEditProfile,
  onExportData,
  onDeleteAccount,
}: DashboardViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        {section === 'overview' && (
          <DashboardOverview
            clients={clients}
            totalConversations={totalConversations}
            user={user}
            onNavigate={onSectionChange}
            onClientCreate={onClientCreate}
          />
        )}

        {section === 'clients' && (
          <DashboardClients
            clients={clients}
            currentClient={currentClient}
            onClientCreate={onClientCreate}
            onClientSelect={onClientSelect}
            onClientDelete={onClientDelete}
            onClientEdit={onClientEdit}
            onConfigurePlatforms={onConfigurePlatforms}
          />
        )}

        {section === 'profile' && (
          <DashboardProfile
            user={user}
            stats={userStats}
            onEditProfile={onEditProfile}
          />
        )}

        {section === 'settings' && (
          <DashboardSettings
            onEditProfile={onEditProfile}
            onExportData={onExportData}
            onDeleteAccount={onDeleteAccount}
          />
        )}
      </div>
    </div>
  );
}
