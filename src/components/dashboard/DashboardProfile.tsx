/**
 * Dashboard Profile Section
 *
 * Phase 6.5: User profile display
 * Phase 6.6: Added stats, member since, and edit button
 */

'use client';

import { User, Mail, Calendar, Edit2, Users, MessageSquare, Zap, Briefcase, GraduationCap, School, Crown, CreditCard } from 'lucide-react';

export interface DashboardProfileProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: string;
    accountType?: 'business' | 'education' | 'instructor';
    usageTier?: 'free' | 'student' | 'pro' | 'agency' | 'enterprise';
    subscriptionStatus?: 'none' | 'trial' | 'active' | 'expired' | 'cancelled';
    subscriptionEndDate?: string | null;
    trialEndDate?: string | null;
  };
  stats?: {
    totalClients: number;
    totalConversations: number;
    totalMessages: number;
  };
  onEditProfile?: () => void;
}

export function DashboardProfile({ user, stats, onEditProfile }: DashboardProfileProps) {
  // Format member since date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    : 'Unknown';

  // Get account type display info
  const getAccountTypeInfo = (accountType?: string) => {
    switch (accountType) {
      case 'business':
        return {
          label: 'Business Professional',
          icon: Briefcase,
          color: 'text-[#6CA3A2]',
          bgColor: 'bg-[#6CA3A2]/20',
        };
      case 'education':
        return {
          label: 'Student',
          icon: GraduationCap,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/20',
        };
      case 'instructor':
        return {
          label: 'Instructor',
          icon: School,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
        };
      default:
        return {
          label: 'Business Professional',
          icon: Briefcase,
          color: 'text-[#6CA3A2]',
          bgColor: 'bg-[#6CA3A2]/20',
        };
    }
  };

  const accountTypeInfo = getAccountTypeInfo(user?.accountType);
  const AccountTypeIcon = accountTypeInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#f5f5f5] mb-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Your Profile
          </h1>
          <p
            className="text-[#c0c0c0]"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            View and manage your account information.
          </p>
        </div>
        {/* Phase 6.6: Edit Button */}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6CA3A2] text-white rounded-xl font-medium shadow-[-6px_-6px_16px_rgba(60,60,60,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(60,60,60,0.4),4px_4px_12px_rgba(0,0,0,0.8)] hover:bg-[#5a9493] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4)] transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#6CA3A2]/20"
              />
            ) : (
              <div className="w-24 h-24 bg-[#6CA3A2] rounded-full flex items-center justify-center ring-4 ring-[#6CA3A2]/20">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2
              className="text-xl font-bold text-[#f5f5f5] mb-1"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {user?.name || 'User'}
            </h2>
            <p
              className="text-[#c0c0c0] mb-4"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {user?.email || 'No email provided'}
            </p>

            {/* Info Items */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-sm text-[#c0c0c0]">
                <Mail className="w-4 h-4 text-[#6CA3A2]" />
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {user?.email || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#c0c0c0]">
                <AccountTypeIcon className={`w-4 h-4 ${accountTypeInfo.color}`} />
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {accountTypeInfo.label}
                </span>
              </div>
              {/* Phase 6.6: Member Since */}
              <div className="flex items-center gap-2 text-sm text-[#c0c0c0]">
                <Calendar className="w-4 h-4 text-[#6CA3A2]" />
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 6.6: Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Clients */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6CA3A2]/20 rounded-xl">
                <Users className="w-6 h-6 text-[#6CA3A2]" />
              </div>
              <div>
                <p
                  className="text-3xl font-bold text-[#f5f5f5]"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {stats.totalClients}
                </p>
                <p
                  className="text-sm text-[#c0c0c0]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Total Clients
                </p>
              </div>
            </div>
          </div>

          {/* Total Conversations */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6CA3A2]/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-[#6CA3A2]" />
              </div>
              <div>
                <p
                  className="text-3xl font-bold text-[#f5f5f5]"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {stats.totalConversations}
                </p>
                <p
                  className="text-sm text-[#c0c0c0]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Conversations
                </p>
              </div>
            </div>
          </div>

          {/* Total Messages */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6CA3A2]/20 rounded-xl">
                <Zap className="w-6 h-6 text-[#6CA3A2]" />
              </div>
              <div>
                <p
                  className="text-3xl font-bold text-[#f5f5f5]"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {stats.totalMessages}
                </p>
                <p
                  className="text-sm text-[#c0c0c0]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Total Messages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Details */}
      <div className="grid grid-cols-1 gap-4">
        {/* Account Info */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
          <h3
            className="text-lg font-semibold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <p
                className="text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user?.name || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <p
                className="text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user?.email || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
                Account Type
              </label>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 ${accountTypeInfo.bgColor} rounded-lg`}>
                  <AccountTypeIcon className={`w-4 h-4 ${accountTypeInfo.color}`} />
                </div>
                <p
                  className="text-[#f5f5f5]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {accountTypeInfo.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-[-8px_-8px_20px_rgba(60,60,60,0.4),8px_8px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-semibold text-[#f5f5f5]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Subscription Plan
          </h3>
          <button
            onClick={() => window.open('/dashboard/subscription', '_blank')}
            className="text-xs text-[#6CA3A2] hover:text-[#5a9291] underline decoration-[#6CA3A2]/30 hover:decoration-[#5a9291]/50 transition-colors"
          >
            Manage Subscription
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
              Current Plan
            </label>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 ${
                user?.usageTier === 'student' ? 'bg-blue-500/20' :
                user?.subscriptionStatus === 'active' ? 'bg-amber-500/20' :
                user?.subscriptionStatus === 'cancelled' ? 'bg-yellow-500/20' :
                  'bg-purple-500/20'
                } rounded-lg`}>
                <Crown className={`w-4 h-4 ${
                  user?.usageTier === 'student' ? 'text-blue-400' :
                  user?.subscriptionStatus === 'active' ? 'text-amber-400' :
                  user?.subscriptionStatus === 'cancelled' ? 'text-yellow-400' :
                    'text-purple-400'
                  }`} />
              </div>
              <p
                className="text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user?.usageTier === 'student' ? 'Student Plan' :
                  user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'cancelled' ? `${user?.usageTier?.toUpperCase() || 'PRO'} Plan` :
                    user?.subscriptionStatus === 'trial' ? 'Free Trial' :
                      'No Active Plan'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
              Status
            </label>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                user?.subscriptionStatus === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                user?.subscriptionStatus === 'cancelled' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                user?.subscriptionStatus === 'trial' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
                  'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                }`} />
              <p
                className="text-[#f5f5f5]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {user?.subscriptionStatus === 'active' ? 'Active' :
                  user?.subscriptionStatus === 'cancelled' ? 'Cancelled - Active until end date' :
                  user?.subscriptionStatus === 'trial' ? 'Trial Period' :
                    'Expired / Inactive'}
              </p>
            </div>
          </div>

          {(user?.subscriptionEndDate || user?.trialEndDate) && (
            <div>
              <label className="block text-xs text-[#808080] mb-1 uppercase tracking-wider">
                {user?.subscriptionStatus === 'trial' ? 'Trial Ends' :
                  user?.subscriptionStatus === 'cancelled' ? 'Expires On' : 'Renews On'}
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#808080]" />
                <p
                  className="text-[#f5f5f5]"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {new Date((user?.subscriptionStatus === 'trial' ? user?.trialEndDate : user?.subscriptionEndDate) || new Date()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
