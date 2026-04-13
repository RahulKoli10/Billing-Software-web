"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { 
  User, Lock, Shield, Bell, Key, ChevronRight, Eye, EyeOff, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildApiUrl } from '@/lib/api';

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  gst?: string;
  address?: string;
  email_verified?: boolean;
  role: string;
  last_login?: string;
};

type Subscription = {
  plan_name: string;
  status: string;
  end_date: string;
  license_key: string;
};

type Credentials = {
  software_username?: string;
  has_password: boolean;
};

type Notifications = {
  unread_count: number;
};

const sections = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'security' as const, label: 'Security', icon: Lock },
  { id: 'subscription' as const, label: 'Subscription', icon: Shield },
  { id: 'software' as const, label: 'Software Access', icon: Key },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
];

type SectionId = typeof sections[number]['id'];

export default function SettingsPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionId>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [notifications, setNotifications] = useState<Notifications>({ unread_count: 0 });
  const [loading, setLoading] = useState(true);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    gst: '',
    address: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    email: false,
    sms: false
  });
  
  const [resettingCredentials, setResettingCredentials] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    loadNotificationsPrefs();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, subRes, credRes, notifRes] = await Promise.all([
        fetch(buildApiUrl('/api/auth/me'), { credentials: 'include' }),
        fetch(buildApiUrl('/api/subscription/my'), { credentials: 'include' }),
        fetch(buildApiUrl('/api/subscription/credentials'), { credentials: 'include' }),
        fetch(buildApiUrl('/api/notifications'), { credentials: 'include' })
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.user);
        setProfileForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          business_name: data.user.business_name || '',
          gst: data.user.gst || '',
          address: data.user.address || ''
        });
      }

      if (subRes.ok) setSubscription(await subRes.json());
      if (credRes.ok) setCredentials(await credRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (error) {
      toast.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationsPrefs = () => {
    try {
      const saved = localStorage.getItem('notifications_prefs');
      if (saved) {
        setNotificationsEnabled(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  };

  const saveNotificationsPrefs = (prefs: typeof notificationsEnabled) => {
    localStorage.setItem('notifications_prefs', JSON.stringify(prefs));
    setNotificationsEnabled(prefs);
    toast.success('Notification preferences saved');
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(buildApiUrl('/api/auth/profile'), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        toast.success('Profile updated');
        loadData();
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const resetCredentials = async () => {
    setResettingCredentials(true);
    try {
      const res = await fetch(buildApiUrl('/api/subscription/credentials/reset'), {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('New credentials sent to your email');
        loadData();
      } else {
        toast.error('Failed to reset credentials');
      }
    } catch {
      toast.error('Reset failed');
    } finally {
      setResettingCredentials(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'active': { bg: '#dcfce7', text: '#16a34a' },
      'trial': { bg: '#fef9c3', text: '#ca8a04' },
      'expired': { bg: '#fee2e2', text: '#dc2626' }
    } as Record<string, {bg: string; text: string}>;

    const color = colors[status.toLowerCase()] || colors['active'];
    return (
      <span 
        className={cn(
          'px-2 py-1 rounded-full text-xs font-semibold inline-block',
          `bg-[${color.bg}] text-[${color.text}]`
        )}
      >
        {status}
      </span>
    );
  };

  const scrollToSection = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const daysRemaining = subscription ? Math.max(0, Math.ceil(
    (new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )) : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Nav */}
          <nav className="w-full lg:w-56 lg:sticky lg:top-8 lg:h-fit lg:self-start lg:pt-2">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Settings</h1>
            <p className="text-sm text-slate-600 mb-8">Manage your account and preferences</p>
            
            <div className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group',
                      isActive 
                        ? 'bg-[#eff6ff] text-[#1d4ed8] border-l-3 border-[#1d4ed8]' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <main ref={scrollContainerRef} className="flex-1 min-w-0 lg:pr-8">
            {/* Profile Section */}
            <section id="profile">
              <div className="border-t border-slate-100 pt-12">
                <h2 className="text-base font-semibold text-slate-900 mb-1">Profile Information</h2>
                <p className="text-sm text-slate-600 mb-8">Update your personal and business details</p>
                
                <form onSubmit={saveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                          required
                        />
                        <span className={cn(
                          'px-2 py-px rounded-full text-xs font-semibold',
                          profile?.email_verified 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        )}>
                          {profile?.email_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                      <input
                        type="text"
                        value={profileForm.business_name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Number</label>
                      <input
                        type="text"
                        value={profileForm.gst || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, gst: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                      <textarea
                        rows={3}
                        value={profileForm.address || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-vertical"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d4ed8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 h-9 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="border-t border-slate-100 pt-12">
              <h2 className="text-base font-semibold text-slate-900 mb-1">Security</h2>
              <p className="text-sm text-slate-600 mb-8">Manage your account security settings</p>
              
              <p className="text-xs text-slate-500 mb-6">Last login: {profile?.last_login ? new Date(profile.last_login).toLocaleString() : 'Never'}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="New password (min 8 chars)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          if (passwordForm.new === passwordForm.confirm && passwordForm.new.length >= 8) {
                            toast.success('Password updated successfully');
                            setPasswordForm({ current: '', new: '', confirm: '' });
                          } else {
                            toast.error("Passwords don't match or too short");
                          }
                        }}
                        disabled={savingPassword || passwordForm.new !== passwordForm.confirm || passwordForm.new.length < 8}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1d4ed8] text-white text-sm font-medium rounded-lg hover:bg-blue-700 h-9 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
                      >
                        {savingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Subscription Section */}
            <section id="subscription" className="border-t border-slate-100 pt-12">
              <h2 className="text-base font-semibold text-slate-900 mb-1">Subscription</h2>
              <p className="text-sm text-slate-600 mb-8">Your current plan details</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Plan Name</span>
                  <span className="text-sm font-semibold text-slate-900">{subscription?.plan_name || 'No plan'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  {subscription && getStatusBadge(subscription.status)}
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Expiry Date</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {subscription ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Days Remaining</span>
                  <span className="text-sm font-semibold text-slate-900">{daysRemaining}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-slate-700">License Key</span>
                  <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {subscription?.license_key ? `${subscription.license_key.slice(0, 8)}...` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <Link 
                  href="/dashboard/subscription"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Manage Subscription <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Software Access Section */}
            <section id="software" className="border-t border-slate-100 pt-12">
              <h2 className="text-base font-semibold text-slate-900 mb-1">Software Access</h2>
              <p className="text-sm text-slate-600 mb-8">Credentials for your billing software client</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Software Username</label>
                  <input
                    readOnly
                    value={credentials?.software_username || 'Not assigned'}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Software Password</label>
                  <input
                    readOnly
                    value="••••••••"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600 cursor-not-allowed font-mono"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Resetting will send new credentials to your email</p>
                <button
                  onClick={resetCredentials}
                  disabled={resettingCredentials || !credentials}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-300 text-rose-700 text-sm font-medium rounded-lg hover:bg-rose-50 h-9 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resettingCredentials ? 'Resetting...' : 'Reset Credentials'}
                </button>
              </div>
            </section>

            {/* Notifications Section */}
            <section id="notifications" className="border-t border-slate-100 pt-12">
              <h2 className="text-base font-semibold text-slate-900 mb-1">Notifications</h2>
              <p className="text-sm text-slate-600 mb-8">Manage notification preferences</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-200 last:border-b-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-900 cursor-pointer select-none">Email Notifications</label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Invoice payments, subscription expiry, account activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled.email}
                      onChange={(e) => {
                        const newPrefs = { ...notificationsEnabled, email: e.target.checked };
                        setNotificationsEnabled(newPrefs);
                        saveNotificationsPrefs(newPrefs);
                      }}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      'w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d4ed8]',
                    )} />
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-900 cursor-pointer select-none">SMS Notifications</label>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Important alerts only (payment failure, low stock)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled.sms}
                      onChange={(e) => {
                        const newPrefs = { ...notificationsEnabled, sms: e.target.checked };
                        setNotificationsEnabled(newPrefs);
                        saveNotificationsPrefs(newPrefs);
                      }}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      'w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d4ed8]',
                    )} />
                  </label>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center gap-1 text-sm text-slate-500">
                {notifications.unread_count > 0 && (
                  <>
                    {notifications.unread_count} unread notification
                    {notifications.unread_count > 1 ? 's' : ''}
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

