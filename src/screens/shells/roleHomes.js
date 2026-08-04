import RoleHomeShell from './RoleHomeShell';
import PlaceholderScreen from './PlaceholderScreen';
import { useAuth } from '../../context/AuthContext';
import { getDonorStats } from '../../utils/donorHelpers';
import { formatCurrency } from '../../utils/format';

export function DonorHomeScreen() {
  const { currentUser, donations, platformLoading, refreshPlatformData, notifications } = useAuth();
  const stats = getDonorStats(donations, currentUser);
  const unread = (notifications || []).filter((n) => !n.read).length;

  return (
    <RoleHomeShell
      title="Donor dashboard"
      subtitle="Give items or funds, then track where your support goes."
      refreshing={platformLoading}
      onRefresh={() => refreshPlatformData(currentUser?.role)}
      stats={platformLoading && !stats.totalDonations ? [
        ['…', 'Donations'],
        ['…', 'Given'],
        ['…', 'Families'],
      ] : [
        [String(stats.totalDonations), 'Donations'],
        [stats.moneyDonated > 0 ? formatCurrency(stats.moneyDonated) : '₹0', 'Given'],
        [String(stats.completedDonations), 'Completed'],
      ]}
      actions={[
        {
          label: 'Donate Money',
          desc: 'Support verified causes',
          icon: 'cash-outline',
          tab: 'Donate',
          params: { screen: 'DonateMoney' },
        },
        {
          label: 'Donate Items',
          desc: 'Clothes, food, electronics…',
          icon: 'gift-outline',
          tab: 'Donate',
          params: { screen: 'DonateItem' },
        },
        {
          label: 'Notifications',
          desc: unread > 0 ? `${unread} unread updates` : 'Donation and verification updates',
          icon: 'notifications-outline',
          tab: 'Settings',
          params: { screen: 'DonorNotifications' },
        },
        { label: 'My Impact', desc: 'See deliveries and outcomes', icon: 'trending-up-outline', tab: 'Impact' },
      ]}
    />
  );
}

export function ReceiverHomeScreen() {
  return (
    <RoleHomeShell
      title="Receiver home"
      subtitle="Apply for financial assistance with dignity and clear status tracking."
      stats={[
        ['2', 'Applications'],
        ['1', 'In review'],
        ['0', 'Approved'],
      ]}
      actions={[
        { label: 'Apply for Assistance', desc: 'Start a new support request', icon: 'document-text-outline' },
        { label: 'My Applications', desc: 'Track verification progress', icon: 'list-outline' },
        { label: 'Notifications', desc: 'Updates from Aja Abayahastham', icon: 'notifications-outline' },
      ]}
    />
  );
}

export { default as NgoHomeScreen } from '../ngo/NgoHomeScreen';

export { default as AdminHomeScreen } from '../admin/AdminHomeScreen';

export function DonationsScreen() {
  return (
    <PlaceholderScreen
      title="My Donations"
      description="List and detail views for money/item donations will mirror the web donor module."
    />
  );
}

export function DonateScreen() {
  return (
    <PlaceholderScreen
      title="Donate"
      description="Money and item donation flows will be ported next as clean mobile steps."
    />
  );
}

export function ImpactScreen() {
  return <PlaceholderScreen title="My Impact" description="Impact charts and delivery stories shell." />;
}

export function ProfileScreen() {
  return <PlaceholderScreen title="Profile" description="Profile and settings shell for this role." />;
}

export function ApplyScreen() {
  return (
    <PlaceholderScreen
      title="Apply"
      description="Receiver assistance application wizard — mobile step flow coming next."
    />
  );
}

export function ApplicationsScreen() {
  return <PlaceholderScreen title="Applications" description="Application list and status cards shell." />;
}

export function NotificationsScreen() {
  return <PlaceholderScreen title="Notifications" description="Role notifications feed shell." />;
}

export function RequestsScreen() {
  return (
    <PlaceholderScreen
      title="Requests"
      description="Manage donation and fund requests — mirrors the web NGO My Requests module."
    />
  );
}

export function InventoryScreen() {
  return (
    <PlaceholderScreen
      title="Inventory"
      description="Stock levels, allocations, and warehouse items from the NGO web portal."
    />
  );
}

export { default as NgoReportsScreen } from '../ngo/NgoReportsScreen';

export function ProgramsScreen() {
  return <PlaceholderScreen title="Programs" description="NGO programs list shell." />;
}

export function MoreScreen() {
  return <PlaceholderScreen title="More" description="Additional modules via stacked navigation / sheet." />;
}

export { default as NgoProfileScreen } from '../ngo/NgoProfileScreen';

export function QueueScreen() {
  return <PlaceholderScreen title="Verifications" description="Admin verification queue shell." />;
}

export function UsersScreen() {
  return <PlaceholderScreen title="Users" description="Admin user management shell." />;
}

export function ReportsScreen() {
  return <PlaceholderScreen title="Reports" description="Admin reports and analytics shell." />;
}

export function SettingsScreen() {
  return <PlaceholderScreen title="Settings" description="Admin and role settings shell." />;
}
