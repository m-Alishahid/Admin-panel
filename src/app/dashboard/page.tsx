"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockOrders } from '../../lib/orders';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const [chartView, setChartView] = useState('monthly');

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

  // Prepare chart data from orders based on selected view
  const getChartData = () => {
    const now = new Date();

    if (chartView === 'daily') {
      // Generate dummy daily data for the last 30 days
      const dataPoints: { period: string; orders: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        dataPoints.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          orders: Math.floor(Math.random() * 10) + 1 // Random orders between 1-10
        });
      }
      return dataPoints;
    } else if (chartView === 'weekly') {
      // Generate dummy weekly data for the last 12 weeks
      const dataPoints: { period: string; orders: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - (i * 7));
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        dataPoints.push({
          period: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          orders: Math.floor(Math.random() * 50) + 10 // Random orders between 10-60
        });
      }
      return dataPoints;
    } else { // monthly
      // Generate dummy monthly data for the last 12 months
      const dataPoints: { period: string; orders: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        dataPoints.push({
          period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          orders: Math.floor(Math.random() * 200) + 50 // Random orders between 50-250
        });
      }
      return dataPoints;
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-right">
          <p className="text-lg text-gray-600">Welcome back, Admin</p>
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

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Orders Over Time</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartView('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                chartView === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setChartView('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                chartView === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                chartView === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Most Trending Products</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">iPhone 15 Pro</p>
                  <p className="text-sm text-gray-600">$999.99</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">+25%</span>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">🎧</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">AirPods Pro</p>
                  <p className="text-sm text-gray-600">$249.99</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">+18%</span>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">⌚</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Apple Watch Series 9</p>
                  <p className="text-sm text-gray-600">$399.99</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">+15%</span>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">💻</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">MacBook Air M3</p>
                  <p className="text-sm text-gray-600">$1099.99</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">+12%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
