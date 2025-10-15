"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'product',
      action: 'New product added',
      details: '"Wireless Headphones"',
      timestamp: '2 hours ago',
      icon: '📦',
      color: 'blue'
    },
    {
      id: 2,
      type: 'order',
      action: 'Order completed',
      details: 'Order #1234',
      timestamp: '4 hours ago',
      icon: '✅',
      color: 'green'
    },
    {
      id: 3,
      type: 'user',
      action: 'New user registered',
      details: 'john@example.com',
      timestamp: '1 day ago',
      icon: '👤',
      color: 'purple'
    },
    {
      id: 4,
      type: 'category',
      action: 'New category added',
      details: '"Electronics"',
      timestamp: '3 hours ago',
      icon: '🏷️',
      color: 'orange'
    }
  ]);

  // Function to add new activity (can be called from other components)
  const addActivity = (type: string, action: string, details: string) => {
    const newActivity = {
      id: recentActivities.length + 1,
      type,
      action,
      details,
      timestamp: 'Just now',
      icon: type === 'product' ? '📦' : type === 'order' ? '✅' : type === 'user' ? '👤' : '🏷️',
      color: type === 'product' ? 'blue' : type === 'order' ? 'green' : type === 'user' ? 'purple' : 'orange'
    };
    setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-right">
          <p className="text-lg text-gray-600">Welcome back, {session.user?.name || 'Admin'}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Products</h3>
              <p className="text-4xl font-bold mt-2">25</p>
            </div>
            <div className="text-6xl opacity-20">📦</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Orders</h3>
              <p className="text-4xl font-bold mt-2">150</p>
            </div>
            <div className="text-6xl opacity-20">🛒</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Users</h3>
              <p className="text-4xl font-bold mt-2">320</p>
            </div>
            <div className="text-6xl opacity-20">👥</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Revenue</h3>
              <p className="text-4xl font-bold mt-2">$12,500</p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                    <span className={`text-${activity.color}-600`}>{activity.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">➕</div>
                <p className="font-medium text-gray-900">Add Product</p>
              </div>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-medium text-gray-900">View Reports</p>
              </div>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <p className="font-medium text-gray-900">Manage Users</p>
              </div>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="font-medium text-gray-900">Settings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
