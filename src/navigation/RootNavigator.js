import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutOverlay from '../components/LogoutOverlay';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import { useAuth } from '../context/AuthContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterRoleScreen from '../screens/RegisterRoleScreen';
import RegisterFormScreen from '../screens/RegisterFormScreen';
import {
  DonorHomeScreen,
  NgoHomeScreen,
  NgoProfileScreen,
  NgoReportsScreen,
} from '../screens/shells/roleHomes';
import DonorSettingsScreen from '../screens/donor/DonorSettingsScreen';
import DonorNotificationsScreen from '../screens/donor/DonorNotificationsScreen';
import DonorVerifyScreen from '../screens/donor/DonorVerifyScreen';
import DonateHubScreen from '../screens/donor/DonateHubScreen';
import DonateMoneyScreen from '../screens/donor/DonateMoneyScreen';
import DonateItemScreen from '../screens/donor/DonateItemScreen';
import MyDonationsScreen from '../screens/donor/MyDonationsScreen';
import DonationDetailScreen from '../screens/donor/DonationDetailScreen';
import MyImpactScreen from '../screens/donor/MyImpactScreen';
import ReceiverHomeScreen from '../screens/receiver/ReceiverHomeScreen';
import ApplyAssistanceScreen from '../screens/receiver/ApplyAssistanceScreen';
import {
  ApplicationsListScreen,
  ApplicationDetailScreen,
} from '../screens/receiver/ApplicationsScreens';
import ReceiverNotificationsScreen from '../screens/receiver/ReceiverNotificationsScreen';
import ReceiverProfileScreen from '../screens/receiver/ReceiverProfileScreen';
import ReceiverSettingsScreen from '../screens/receiver/ReceiverSettingsScreen';
import RequestsListScreen from '../screens/ngo/RequestsListScreen';
import RequestDetailScreen from '../screens/ngo/RequestDetailScreen';
import RequestDonationsScreen from '../screens/ngo/RequestDonationsScreen';
import RequestFundsScreen from '../screens/ngo/RequestFundsScreen';
import InventoryListScreen from '../screens/ngo/InventoryListScreen';
import InventoryRequestScreen from '../screens/ngo/InventoryRequestScreen';
import NgoSettingsScreen from '../screens/ngo/NgoSettingsScreen';
import NgoOrganizationProfileScreen from '../screens/ngo/NgoOrganizationProfileScreen';
import NgoBeneficiariesScreen from '../screens/ngo/NgoBeneficiariesScreen';
import NgoNotificationsScreen from '../screens/ngo/NgoNotificationsScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import {
  AdminVerificationListScreen,
  AdminVerificationDetailScreen,
} from '../screens/admin/AdminVerificationScreens';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import {
  AdminMoreHubScreen,
  AdminPriorityScreen,
  AdminInventoryScreen,
  AdminFundsScreen,
  AdminNgosScreen,
  AdminDonationsScreen,
  AdminFinancialScreen,
  AdminNotificationsScreen,
  AdminLogsScreen,
  AdminSettingsScreen,
} from '../screens/admin/AdminMoreScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const DonateStackNav = createNativeStackNavigator();
const DonationsStackNav = createNativeStackNavigator();
const ApplicationsStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();
const NgoProfileStackNav = createNativeStackNavigator();
const RequestsStackNav = createNativeStackNavigator();
const InventoryStackNav = createNativeStackNavigator();
const QueueStackNav = createNativeStackNavigator();
const DonorSettingsStackNav = createNativeStackNavigator();
const MoreStackNav = createNativeStackNavigator();

function DonateStack() {
  return (
    <DonateStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <DonateStackNav.Screen name="DonateHub" component={DonateHubScreen} />
      <DonateStackNav.Screen name="DonateMoney" component={DonateMoneyScreen} />
      <DonateStackNav.Screen name="DonateItem" component={DonateItemScreen} />
    </DonateStackNav.Navigator>
  );
}

function DonationsStack() {
  return (
    <DonationsStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <DonationsStackNav.Screen name="MyDonations" component={MyDonationsScreen} />
      <DonationsStackNav.Screen name="DonationDetail" component={DonationDetailScreen} />
    </DonationsStackNav.Navigator>
  );
}

function ApplicationsStack() {
  return (
    <ApplicationsStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ApplicationsStackNav.Screen name="ApplicationsList" component={ApplicationsListScreen} />
      <ApplicationsStackNav.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
    </ApplicationsStackNav.Navigator>
  );
}

function ReceiverProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ProfileStackNav.Screen name="ReceiverProfile" component={ReceiverProfileScreen} />
      <ProfileStackNav.Screen name="ReceiverSettings" component={ReceiverSettingsScreen} />
    </ProfileStackNav.Navigator>
  );
}

function NgoProfileStack() {
  return (
    <NgoProfileStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <NgoProfileStackNav.Screen name="NgoProfileHome" component={NgoProfileScreen} />
      <NgoProfileStackNav.Screen name="NgoOrganizationProfile" component={NgoOrganizationProfileScreen} />
      <NgoProfileStackNav.Screen name="NgoSettings" component={NgoSettingsScreen} />
      <NgoProfileStackNav.Screen name="NgoBeneficiaries" component={NgoBeneficiariesScreen} />
      <NgoProfileStackNav.Screen name="NgoNotifications" component={NgoNotificationsScreen} />
    </NgoProfileStackNav.Navigator>
  );
}

function RequestsStack() {
  return (
    <RequestsStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <RequestsStackNav.Screen name="RequestsList" component={RequestsListScreen} />
      <RequestsStackNav.Screen name="RequestDetail" component={RequestDetailScreen} />
      <RequestsStackNav.Screen name="RequestDonations" component={RequestDonationsScreen} />
      <RequestsStackNav.Screen name="RequestFunds" component={RequestFundsScreen} />
    </RequestsStackNav.Navigator>
  );
}

function InventoryStack() {
  return (
    <InventoryStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <InventoryStackNav.Screen name="InventoryList" component={InventoryListScreen} />
      <InventoryStackNav.Screen name="InventoryRequest" component={InventoryRequestScreen} />
    </InventoryStackNav.Navigator>
  );
}

function AdminQueueStack() {
  return (
    <QueueStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <QueueStackNav.Screen name="VerificationList" component={AdminVerificationListScreen} />
      <QueueStackNav.Screen name="VerificationDetail" component={AdminVerificationDetailScreen} />
    </QueueStackNav.Navigator>
  );
}

function DonorSettingsStack() {
  return (
    <DonorSettingsStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <DonorSettingsStackNav.Screen name="DonorSettings" component={DonorSettingsScreen} />
      <DonorSettingsStackNav.Screen name="DonorNotifications" component={DonorNotificationsScreen} />
      <DonorSettingsStackNav.Screen name="DonorVerify" component={DonorVerifyScreen} />
    </DonorSettingsStackNav.Navigator>
  );
}

function AdminMoreStack() {
  return (
    <MoreStackNav.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <MoreStackNav.Screen name="AdminMoreHub" component={AdminMoreHubScreen} />
      <MoreStackNav.Screen name="AdminPriority" component={AdminPriorityScreen} />
      <MoreStackNav.Screen name="AdminInventory" component={AdminInventoryScreen} />
      <MoreStackNav.Screen name="AdminFunds" component={AdminFundsScreen} />
      <MoreStackNav.Screen name="AdminNgos" component={AdminNgosScreen} />
      <MoreStackNav.Screen name="AdminDonations" component={AdminDonationsScreen} />
      <MoreStackNav.Screen name="AdminFinancial" component={AdminFinancialScreen} />
      <MoreStackNav.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
      <MoreStackNav.Screen name="AdminLogs" component={AdminLogsScreen} />
      <MoreStackNav.Screen name="AdminSettings" component={AdminSettingsScreen} />
    </MoreStackNav.Navigator>
  );
}

function tabIcons(routeName, focused) {
  const map = {
    Home: focused ? 'home' : 'home-outline',
    Donate: focused ? 'heart' : 'heart-outline',
    Donations: focused ? 'list' : 'list-outline',
    Impact: focused ? 'trending-up' : 'trending-up-outline',
    Profile: focused ? 'person' : 'person-outline',
    Apply: focused ? 'document-text' : 'document-text-outline',
    Applications: focused ? 'folder' : 'folder-outline',
    Alerts: focused ? 'notifications' : 'notifications-outline',
    Requests: focused ? 'cube' : 'cube-outline',
    Inventory: focused ? 'archive' : 'archive-outline',
    Programs: focused ? 'flag' : 'flag-outline',
    More: focused ? 'menu' : 'menu-outline',
    Queue: focused ? 'checkmark-done' : 'checkmark-done-outline',
    Users: focused ? 'people' : 'people-outline',
    Reports: focused ? 'pie-chart' : 'pie-chart-outline',
    Settings: focused ? 'settings' : 'settings-outline',
    More: focused ? 'menu' : 'menu-outline',
  };
  return map[routeName] || 'ellipse-outline';
}

function RoleTabs({ screens, roundedActive = false }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const contentHeight = roundedActive ? 56 : 50;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarHideOnKeyboard: true,
        tabBarSafeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          height: contentHeight + bottomPad,
          paddingTop: 6,
          paddingBottom: bottomPad,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          paddingTop: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIcon: ({ color, focused }) => {
          const icon = (
            <Ionicons name={tabIcons(route.name, focused)} size={22} color={color} />
          );
          if (!roundedActive) return icon;
          return (
            <View
              style={{
                width: 40,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? '#DCFCE7' : 'transparent',
              }}
            >
              {icon}
            </View>
          );
        },
      })}
    >
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ title: screen.label || screen.name }}
        />
      ))}
    </Tab.Navigator>
  );
}

function DonorTabs() {
  return (
    <RoleTabs
      screens={[
        { name: 'Home', component: DonorHomeScreen },
        { name: 'Donate', component: DonateStack },
        { name: 'Donations', component: DonationsStack },
        { name: 'Impact', component: MyImpactScreen },
        { name: 'Settings', component: DonorSettingsStack },
      ]}
    />
  );
}

function ReceiverTabs() {
  return (
    <RoleTabs
      screens={[
        { name: 'Home', component: ReceiverHomeScreen },
        { name: 'Apply', component: ApplyAssistanceScreen },
        { name: 'Applications', component: ApplicationsStack },
        { name: 'Alerts', component: ReceiverNotificationsScreen, label: 'Alerts' },
        { name: 'Profile', component: ReceiverProfileStack },
      ]}
    />
  );
}

function NgoTabs() {
  return (
    <RoleTabs
      roundedActive
      screens={[
        { name: 'Home', component: NgoHomeScreen },
        { name: 'Requests', component: RequestsStack },
        { name: 'Inventory', component: InventoryStack },
        { name: 'Reports', component: NgoReportsScreen },
        { name: 'Profile', component: NgoProfileStack },
      ]}
    />
  );
}

function AdminTabs() {
  return (
    <RoleTabs
      roundedActive
      screens={[
        { name: 'Home', component: AdminHomeScreen },
        { name: 'Queue', component: AdminQueueStack, label: 'Queue' },
        { name: 'Users', component: AdminUsersScreen },
        { name: 'Reports', component: AdminReportsScreen },
        { name: 'More', component: AdminMoreStack },
      ]}
    />
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
      <Stack.Screen name="RegisterForm" component={RegisterFormScreen} />
    </Stack.Navigator>
  );
}

function AppByRole() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  if (role === 'receiver') return <ReceiverTabs />;
  if (role === 'ngo') return <NgoTabs />;
  if (role === 'super-admin') return <AdminTabs />;
  return <DonorTabs />;
}

export default function RootNavigator() {
  const {
    isAuthenticated,
    authLoading,
    logoutLoading,
    logoutConfirmOpen,
    cancelLogout,
    confirmLogout,
    currentUser,
  } = useAuth();

  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <>
      <LogoutOverlay visible={logoutLoading} />
      <LogoutConfirmModal
        visible={logoutConfirmOpen}
        userName={currentUser?.name}
        loading={logoutLoading}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
      <NavigationContainer>
        {isAuthenticated ? <AppByRole /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}
