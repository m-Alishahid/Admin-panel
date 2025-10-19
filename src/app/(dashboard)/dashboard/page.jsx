"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";

export default function Dashboard() {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartView, setChartView] = useState("monthly");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated) {
        try {
          const [productsResponse, categoriesResponse] = await Promise.all([
            productService.getAll(),
            categoryService.getAll(),
          ]);

          setTotalProducts(productsResponse.products?.length || 0);
          setTotalCategories(categoriesResponse.data?.length || categoriesResponse.count || 0);

          const products = productsResponse.products || [];
          setTrendingProducts(products.slice(0, 4));
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "product",
      action: "New product added",
      details: '"Wireless Headphones"',
      timestamp: "2 hours ago",
      icon: "📦",
      color: "blue",
    },
    {
      id: 2,
      type: "order",
      action: "Order completed",
      details: "Order #1234",
      timestamp: "4 hours ago",
      icon: "✅",
      color: "green",
    },
    {
      id: 3,
      type: "user",
      action: "New user registered",
      details: "john@example.com",
      timestamp: "1 day ago",
      icon: "👤",
      color: "purple",
    },
    {
      id: 4,
      type: "category",
      action: "New category added",
      details: '"Electronics"',
      timestamp: "3 hours ago",
      icon: "🏷️",
      color: "orange",
    },
  ]);

  const getChartData = () => {
    const now = new Date();

    if (chartView === "daily") {
      const dataPoints = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        dataPoints.push({
          period: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          orders: Math.floor(Math.random() * 10) + 1,
        });
      }
      return dataPoints;
    } else if (chartView === "weekly") {
      const dataPoints = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i * 7);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        dataPoints.push({
          period: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          orders: Math.floor(Math.random() * 50) + 10,
        });
      }
      return dataPoints;
    } else {
      const dataPoints = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        dataPoints.push({
          period: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          orders: Math.floor(Math.random() * 200) + 50,
        });
      }
      return dataPoints;
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-left sm:text-right">
          <p className="text-base md:text-lg text-gray-600">Welcome back, Admin</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Products</h3>
              <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalProducts}</p>
            </div>
            <div className="text-4xl md:text-6xl opacity-20">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Orders</h3>
              <p className="text-2xl md:text-4xl font-bold mt-2">150</p>
            </div>
            <div className="text-4xl md:text-6xl opacity-20">🛒</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Categories</h3>
              <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalCategories}</p>
            </div>
            <div className="text-4xl md:text-6xl opacity-20">🏷️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-lg font-semibold opacity-90">Revenue</h3>
              <p className="text-2xl md:text-4xl font-bold mt-2">$12,500</p>
            </div>
            <div className="text-4xl md:text-6xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Orders Over Time</h2>
          <div className="flex flex-wrap gap-2">
            {["daily", "weekly", "monthly"].map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium ${
                  chartView === view
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
          <ul className="space-y-3 md:space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                    style={{ backgroundColor: `${activity.color}10` }}
                  >
                    <span className={`text-${activity.color}-600 text-sm md:text-base`}>{activity.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base">{activity.action}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-gray-500 sm:text-right">{activity.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trending Products */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Most Trending Products</h2>
          <ul className="space-y-3 md:space-y-4">
            {loadingStats ? (
              <li className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm md:text-base">Loading products...</p>
              </li>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product, index) => (
                <li
                  key={product.id || index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm md:text-base">📦</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm md:text-base truncate">{product.name || "Product Name"}</p>
                      <p className="text-xs md:text-sm text-gray-600">${product.price || "0.00"}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold text-sm md:text-base">
                    +{Math.floor(Math.random() * 30) + 10}%
                  </span>
                </li>
              ))
            ) : (
              <li className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm md:text-base">No products available</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
