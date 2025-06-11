import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe, 
  Mail, 
  Key, 
  Download, 
  Upload,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Account Settings
    name: 'College Administrator',
    email: 'admin@college.edu',
    phone: '+1 234 567 8900',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    placementAlerts: true,
    systemUpdates: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5',
    
    // System Settings
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    theme: 'light',
    
    // Privacy Settings
    profileVisibility: 'public',
    dataSharing: false,
    analyticsTracking: true,
    cookieConsent: true
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    // Export data logic
    alert('Data export initiated. You will receive an email when ready.');
  };

  const handleImportData = () => {
    // Import data logic
    document.getElementById('import-file').click();
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy', icon: Database },
  ];

  const SettingCard = ({ title, description, children }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ name, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <SettingCard 
              title="Profile Information" 
              description="Update your personal information and contact details"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Change Password" 
              description="Update your password to keep your account secure"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={settings.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <SettingCard 
              title="Notification Preferences" 
              description="Choose how you want to receive notifications"
            >
              <div className="space-y-2">
                <ToggleSwitch
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  label="Email Notifications"
                  description="Receive notifications via email"
                />
                <ToggleSwitch
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleInputChange}
                  label="SMS Notifications"
                  description="Receive important alerts via SMS"
                />
                <ToggleSwitch
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleInputChange}
                  label="Push Notifications"
                  description="Receive browser push notifications"
                />
              </div>
            </SettingCard>

            <SettingCard 
              title="Content Notifications" 
              description="Manage specific types of notifications"
            >
              <div className="space-y-2">
                <ToggleSwitch
                  name="weeklyReports"
                  checked={settings.weeklyReports}
                  onChange={handleInputChange}
                  label="Weekly Reports"
                  description="Receive weekly summary reports"
                />
                <ToggleSwitch
                  name="placementAlerts"
                  checked={settings.placementAlerts}
                  onChange={handleInputChange}
                  label="Placement Alerts"
                  description="Get notified about placement activities"
                />
                <ToggleSwitch
                  name="systemUpdates"
                  checked={settings.systemUpdates}
                  onChange={handleInputChange}
                  label="System Updates"
                  description="Receive system maintenance notifications"
                />
              </div>
            </SettingCard>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <SettingCard 
              title="Authentication" 
              description="Manage your account security settings"
            >
              <div className="space-y-4">
                <ToggleSwitch
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleInputChange}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <select
                      name="passwordExpiry"
                      value={settings.passwordExpiry}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <select
                      name="loginAttempts"
                      value={settings.loginAttempts}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="3">3 attempts</option>
                      <option value="5">5 attempts</option>
                      <option value="10">10 attempts</option>
                    </select>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Security Alerts" 
              description="Get notified about security events"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Last login: Today at 9:30 AM from Chrome on Windows
                  </p>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <SettingCard 
              title="Regional Settings" 
              description="Configure your regional preferences"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Appearance" 
              description="Customize the look and feel"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <label key={theme} className="cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={settings.theme === theme}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-xl text-center transition-colors ${
                        settings.theme === theme 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Palette className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-sm font-medium capitalize">{theme}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Data Management" 
              description="Import and export your data"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <span>Export Data</span>
                </button>
                
                <button
                  onClick={handleImportData}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span>Import Data</span>
                </button>
              </div>
              <input
                id="import-file"
                type="file"
                accept=".json,.csv"
                className="hidden"
                onChange={(e) => {
                  // Handle file import
                  console.log('File selected:', e.target.files[0]);
                }}
              />
            </SettingCard>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <SettingCard 
              title="Privacy Controls" 
              description="Manage your privacy and data sharing preferences"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    name="profileVisibility"
                    value={settings.profileVisibility}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <ToggleSwitch
                    name="dataSharing"
                    checked={settings.dataSharing}
                    onChange={handleInputChange}
                    label="Data Sharing"
                    description="Allow sharing of anonymized data for research"
                  />
                  <ToggleSwitch
                    name="analyticsTracking"
                    checked={settings.analyticsTracking}
                    onChange={handleInputChange}
                    label="Analytics Tracking"
                    description="Help improve our service with usage analytics"
                  />
                  <ToggleSwitch
                    name="cookieConsent"
                    checked={settings.cookieConsent}
                    onChange={handleInputChange}
                    label="Cookie Consent"
                    description="Allow cookies for enhanced functionality"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Data Rights" 
              description="Exercise your data protection rights"
            >
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      You have the right to access, modify, or delete your personal data at any time.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span>Download My Data</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                    <X className="w-5 h-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </SettingCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
        </div>
        {unsavedChanges && (
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Don't forget to save your settings.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings;