import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-parchment mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-charcoal-800 p-6 rounded-lg border border-forest-900 shadow-lg">
                    <h3 className="text-xl font-semibold text-rust-500 mb-2">Recent Activity</h3>
                    <p className="text-gray-400">No recent updates.</p>
                </div>
                <div className="bg-charcoal-800 p-6 rounded-lg border border-forest-900 shadow-lg">
                    <h3 className="text-xl font-semibold text-rust-500 mb-2">Upcoming Deadlines</h3>
                    <p className="text-gray-400">No upcoming deadlines.</p>
                </div>
                <div className="bg-charcoal-800 p-6 rounded-lg border border-forest-900 shadow-lg">
                    <h3 className="text-xl font-semibold text-rust-500 mb-2">Quick Stats</h3>
                    <p className="text-gray-400">Projects: 0</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
