'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
    Users,
    CreditCard,
    BarChart3,
    Settings,
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    Server,
    Database,
    Cpu,
    HardDrive,
    Globe,
    Mail,
    Bell,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Download,
    Upload,
    RefreshCw,
    Clock,
    Zap,
    Video,
    Image as ImageIcon,
    Mic,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    LogOut,
    Home,
} from 'lucide-react';

// Mock admin data
const mockStats = {
    totalUsers: 12847,
    activeUsers: 8932,
    newUsersToday: 156,
    totalRevenue: 284750,
    revenueThisMonth: 47820,
    revenueGrowth: 23.5,
    contentGenerated: 1247890,
    apiCallsToday: 892456,
    systemHealth: 99.7,
    activeSubscriptions: 4823,
};

const mockUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@startup.io', plan: 'pro', status: 'active', joined: '2024-11-15', revenue: 597, contentCount: 234 },
    { id: 2, name: 'Mike Chen', email: 'mike@agency.com', plan: 'enterprise', status: 'active', joined: '2024-10-22', revenue: 1797, contentCount: 1892 },
    { id: 3, name: 'Emily Davis', email: 'emily@brand.co', plan: 'starter', status: 'active', joined: '2024-12-01', revenue: 237, contentCount: 67 },
    { id: 4, name: 'Alex Kumar', email: 'alex@solo.dev', plan: 'free', status: 'active', joined: '2024-12-15', revenue: 0, contentCount: 8 },
    { id: 5, name: 'Jessica Park', email: 'jessica@media.io', plan: 'pro', status: 'suspended', joined: '2024-09-10', revenue: 398, contentCount: 156 },
    { id: 6, name: 'David Wilson', email: 'david@corp.com', plan: 'enterprise', status: 'active', joined: '2024-08-05', revenue: 3594, contentCount: 4521 },
    { id: 7, name: 'Lisa Thompson', email: 'lisa@creative.co', plan: 'starter', status: 'active', joined: '2024-12-20', revenue: 79, contentCount: 23 },
    { id: 8, name: 'Ryan Martinez', email: 'ryan@tech.io', plan: 'pro', status: 'active', joined: '2024-11-28', revenue: 199, contentCount: 89 },
];

const mockAlerts = [
    { id: 1, type: 'warning', message: 'API rate limit approaching for 3 enterprise users', time: '5 min ago' },
    { id: 2, type: 'error', message: 'Payment failed for user mike@agency.com', time: '23 min ago' },
    { id: 3, type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'New enterprise signup: corp.com', time: '2 hours ago' },
];

const mockApiUsage = [
    { provider: 'OpenAI', calls: 156789, cost: 4892.50, status: 'healthy' },
    { provider: 'ElevenLabs', calls: 45672, cost: 1245.30, status: 'healthy' },
    { provider: 'D-ID', calls: 12890, cost: 3560.00, status: 'warning' },
    { provider: 'Stability AI', calls: 28934, cost: 890.45, status: 'healthy' },
];

type AdminTab = 'overview' | 'users' | 'billing' | 'analytics' | 'system' | 'settings';

export default function AdminPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    // Check admin access
    useEffect(() => {
        // In production, check if user is admin
        // if (!user?.isAdmin) router.push('/dashboard');
    }, [user, router]);

    const tabs = [
        { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart3 },
        { id: 'users' as AdminTab, label: 'Users', icon: Users },
        { id: 'billing' as AdminTab, label: 'Billing', icon: CreditCard },
        { id: 'analytics' as AdminTab, label: 'Analytics', icon: TrendingUp },
        { id: 'system' as AdminTab, label: 'System', icon: Server },
        { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
    ];

    const filteredUsers = mockUsers.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = userFilter === 'all' || u.plan === userFilter || u.status === userFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Top Navigation */}
            <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Admin Console</h1>
                                <p className="text-xs text-slate-400">DigitalMEng Management</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-800 min-h-[calc(100vh-73px)] border-r border-slate-700 p-4">
                    <div className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 p-4 bg-slate-700/50 rounded-xl">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Health</span>
                                <span className="text-sm font-bold text-emerald-400">{mockStats.systemHealth}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">API Calls</span>
                                <span className="text-sm font-bold text-blue-400">{(mockStats.apiCallsToday / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300">Active Users</span>
                                <span className="text-sm font-bold text-purple-400">{mockStats.activeUsers.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <Users className="w-8 h-8 text-violet-400" />
                                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +{mockStats.newUsersToday} today
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{mockStats.totalUsers.toLocaleString()}</p>
                                    <p className="text-sm text-slate-400">Total Users</p>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <DollarSign className="w-8 h-8 text-emerald-400" />
                                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +{mockStats.revenueGrowth}%
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">${mockStats.revenueThisMonth.toLocaleString()}</p>
                                    <p className="text-sm text-slate-400">Revenue This Month</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <Zap className="w-8 h-8 text-blue-400" />
                                        <span className="text-xs text-blue-400">Active</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{mockStats.activeSubscriptions.toLocaleString()}</p>
                                    <p className="text-sm text-slate-400">Active Subscriptions</p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <Activity className="w-8 h-8 text-amber-400" />
                                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Healthy
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{(mockStats.apiCallsToday / 1000).toFixed(0)}K</p>
                                    <p className="text-sm text-slate-400">API Calls Today</p>
                                </div>
                            </div>

                            {/* Alerts & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Alerts */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                                            System Alerts
                                        </h2>
                                        <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
                                    </div>
                                    <div className="space-y-3">
                                        {mockAlerts.map((alert) => (
                                            <div
                                                key={alert.id}
                                                className={`p-3 rounded-xl border ${alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                                                    alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                                                        alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                                            'bg-blue-500/10 border-blue-500/30'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                                                    {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />}
                                                    {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />}
                                                    {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-400 mt-0.5" />}
                                                    <div className="flex-1">
                                                        <p className="text-sm text-white">{alert.message}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* API Provider Usage */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-blue-400" />
                                            API Provider Status
                                        </h2>
                                        <button className="text-sm text-violet-400 hover:text-violet-300">Manage</button>
                                    </div>
                                    <div className="space-y-3">
                                        {mockApiUsage.map((api) => (
                                            <div key={api.provider} className="p-3 bg-slate-700/50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${api.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                                                            }`}></span>
                                                        <span className="text-sm font-medium text-white">{api.provider}</span>
                                                    </div>
                                                    <span className="text-sm text-slate-400">${api.cost.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span>{api.calls.toLocaleString()} calls</span>
                                                    <span className={api.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}>
                                                        {api.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Chart Placeholder */}
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
                                    <select className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600">
                                        <option>Last 30 days</option>
                                        <option>Last 90 days</option>
                                        <option>This year</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-center justify-center text-slate-500">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Revenue chart visualization</p>
                                        <p className="text-xs">Connect analytics to view data</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            {/* User Management Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                                    <p className="text-slate-400">Manage all users and their subscriptions</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors">
                                        <UserPlus className="w-4 h-4" />
                                        Add User
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                                >
                                    <option value="all">All Users</option>
                                    <option value="free">Free Plan</option>
                                    <option value="starter">Starter Plan</option>
                                    <option value="pro">Pro Plan</option>
                                    <option value="enterprise">Enterprise</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Users Table */}
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="px-6 py-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedUsers(filteredUsers.map(u => u.id));
                                                        } else {
                                                            setSelectedUsers([]);
                                                        }
                                                    }}
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Plan</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Content</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Joined</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedUsers([...selectedUsers, user.id]);
                                                            } else {
                                                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                                            <p className="text-xs text-slate-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'enterprise' ? 'bg-amber-500/20 text-amber-400' :
                                                        user.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                                                            user.plan === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`flex items-center gap-1 text-sm ${user.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                                            }`}></span>
                                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-white font-medium">${user.revenue}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-400">{user.contentCount}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-400">{user.joined}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                        </button>
                                                        <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4 text-slate-400" />
                                                        </button>
                                                        <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-400">
                                    Showing {filteredUsers.length} of {mockUsers.length} users
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm">Previous</button>
                                    <button className="px-3 py-2 bg-violet-500 text-white rounded-lg text-sm">1</button>
                                    <button className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm">2</button>
                                    <button className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm">3</button>
                                    <button className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm">Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Billing & Revenue</h2>
                                    <p className="text-slate-400">Monitor revenue, subscriptions, and payments</p>
                                </div>
                            </div>

                            {/* Revenue Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-sm text-slate-400 mb-2">Total Revenue (All Time)</h3>
                                    <p className="text-3xl font-bold text-white">${mockStats.totalRevenue.toLocaleString()}</p>
                                    <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                                        <ArrowUpRight className="w-4 h-4" />
                                        +23.5% from last year
                                    </p>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-sm text-slate-400 mb-2">MRR (Monthly Recurring)</h3>
                                    <p className="text-3xl font-bold text-white">${mockStats.revenueThisMonth.toLocaleString()}</p>
                                    <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                                        <ArrowUpRight className="w-4 h-4" />
                                        +8.2% from last month
                                    </p>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-sm text-slate-400 mb-2">Average Revenue Per User</h3>
                                    <p className="text-3xl font-bold text-white">$87.50</p>
                                    <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                                        <ArrowUpRight className="w-4 h-4" />
                                        +5.1% improvement
                                    </p>
                                </div>
                            </div>

                            {/* Subscription Breakdown */}
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Subscription Breakdown</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-700/50 rounded-xl">
                                        <p className="text-slate-400 text-sm">Free</p>
                                        <p className="text-2xl font-bold text-white">5,234</p>
                                        <p className="text-xs text-slate-400">40.7%</p>
                                    </div>
                                    <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                        <p className="text-blue-400 text-sm">Starter ($79/mo)</p>
                                        <p className="text-2xl font-bold text-white">3,421</p>
                                        <p className="text-xs text-blue-300">26.6% • $270K MRR</p>
                                    </div>
                                    <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                        <p className="text-purple-400 text-sm">Pro ($199/mo)</p>
                                        <p className="text-2xl font-bold text-white">2,156</p>
                                        <p className="text-xs text-purple-300">16.8% • $429K MRR</p>
                                    </div>
                                    <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-500/30">
                                        <p className="text-amber-400 text-sm">Enterprise ($599/mo)</p>
                                        <p className="text-2xl font-bold text-white">456</p>
                                        <p className="text-xs text-amber-300">3.5% • $273K MRR</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">System Health</h2>
                                <p className="text-slate-400">Monitor server performance and resources</p>
                            </div>

                            {/* System Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Cpu className="w-6 h-6 text-blue-400" />
                                        <span className="text-sm text-slate-400">CPU Usage</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">42%</p>
                                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[42%] bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <HardDrive className="w-6 h-6 text-purple-400" />
                                        <span className="text-sm text-slate-400">Memory</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">67%</p>
                                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[67%] bg-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Database className="w-6 h-6 text-emerald-400" />
                                        <span className="text-sm text-slate-400">Storage</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">34%</p>
                                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[34%] bg-emerald-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Activity className="w-6 h-6 text-amber-400" />
                                        <span className="text-sm text-slate-400">Uptime</span>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-400">99.97%</p>
                                    <p className="text-xs text-slate-400 mt-2">Last 30 days</p>
                                </div>
                            </div>

                            {/* API Rate Limits */}
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">API Rate Limits & Quotas</h3>
                                <div className="space-y-4">
                                    {mockApiUsage.map((api) => (
                                        <div key={api.provider} className="flex items-center gap-4">
                                            <div className="w-32 text-sm text-white">{api.provider}</div>
                                            <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${api.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`}
                                                    style={{ width: `${Math.random() * 60 + 20}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-32 text-right text-sm text-slate-400">
                                                {api.calls.toLocaleString()} / 500K
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
                                <p className="text-slate-400">Configure system settings and preferences</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* API Keys */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">API Configuration</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">OpenAI API Key</label>
                                            <input
                                                type="password"
                                                value="sk-************************"
                                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">ElevenLabs API Key</label>
                                            <input
                                                type="password"
                                                value="************************"
                                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Stripe Secret Key</label>
                                            <input
                                                type="password"
                                                value="sk_live_************************"
                                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email Settings */}
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Email & Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white">New signup notifications</p>
                                                <p className="text-xs text-slate-400">Email when new users register</p>
                                            </div>
                                            <button className="w-12 h-6 bg-violet-500 rounded-full relative">
                                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white">Payment failure alerts</p>
                                                <p className="text-xs text-slate-400">Alert on failed payments</p>
                                            </div>
                                            <button className="w-12 h-6 bg-violet-500 rounded-full relative">
                                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white">System health reports</p>
                                                <p className="text-xs text-slate-400">Daily system health email</p>
                                            </div>
                                            <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
                                <p className="text-slate-400">Detailed usage and engagement metrics</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Video className="w-6 h-6 text-pink-400" />
                                        <span className="text-sm text-slate-400">Videos Generated</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">12,847</p>
                                    <p className="text-sm text-emerald-400 mt-1">+23% this month</p>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <ImageIcon className="w-6 h-6 text-purple-400" />
                                        <span className="text-sm text-slate-400">Images Created</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">89,234</p>
                                    <p className="text-sm text-emerald-400 mt-1">+45% this month</p>
                                </div>
                                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mic className="w-6 h-6 text-cyan-400" />
                                        <span className="text-sm text-slate-400">Voice Overs</span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">34,521</p>
                                    <p className="text-sm text-emerald-400 mt-1">+18% this month</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
