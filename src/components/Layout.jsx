import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Hammer, Clapperboard, Gamepad2, ScrollText } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className="flex items-center p-3 mb-2 text-parchment hover:bg-forest-800 rounded-lg transition-colors">
        <Icon className="w-6 h-6 mr-3 text-rust-500" />
        <span className="font-medium">{label}</span>
    </Link>
);

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-charcoal-900 text-parchment font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-charcoal-800 border-r border-forest-900 p-4 flex flex-col">
                <div className="mb-8 p-2">
                    <h1 className="text-2xl font-bold text-forest-700 tracking-wider">FOREST<br />FOUNDRY</h1>
                </div>

                <nav className="flex-1">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/workshop" icon={Hammer} label="The Workshop" />
                    <SidebarItem to="/foundry" icon={Clapperboard} label="Forest Foundry" />
                    <SidebarItem to="/myr" icon={Gamepad2} label="Myr Ent." />
                    <SidebarItem to="/archive" icon={ScrollText} label="The Archive" />
                </nav>

                <div className="mt-auto p-4 border-t border-forest-900">
                    <div className="text-sm text-rust-600">v0.1.0 Alpha</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
