// // "use client";

// // import { useEffect, useState } from "react";
// // import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// // import { useRouter } from "next/navigation";
// // import { useAuth } from "@/context/AuthContext";
// // import { productService } from "@/services/productService";
// // import { categoryService } from "@/services/categoryService";

// // export default function Dashboard() {
// //   const { isAuthenticated, loading, logout } = useAuth();
// //   const router = useRouter();

// //   const [totalProducts, setTotalProducts] = useState(0);
// //   const [totalCategories, setTotalCategories] = useState(0);
// //   const [trendingProducts, setTrendingProducts] = useState([]);
// //   const [loadingStats, setLoadingStats] = useState(true);
// //   const [chartView, setChartView] = useState("monthly");

// //   useEffect(() => {
// //     if (!loading && !isAuthenticated) {
// //       router.push("/login");
// //     }
// //   }, [isAuthenticated, loading, router]);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       if (isAuthenticated) {
// //         try {
// //           const [productsResponse, categoriesResponse] = await Promise.all([
// //             productService.getAll(),
// //             categoryService.getAll(),
// //           ]);

// //           setTotalProducts(productsResponse.products?.length || 0);
// //           setTotalCategories(categoriesResponse.data?.length || categoriesResponse.count || 0);

// //           const products = productsResponse.products || [];
// //           setTrendingProducts(products.slice(0, 4));
// //         } catch (error) {
// //           console.error("Error fetching stats:", error);
// //         } finally {
// //           setLoadingStats(false);
// //         }
// //       }
// //     };

// //     fetchStats();
// //   }, [isAuthenticated]);

// //   const [recentActivities] = useState([
// //     {
// //       id: 1,
// //       type: "product",
// //       action: "New product added",
// //       details: '"Wireless Headphones"',
// //       timestamp: "2 hours ago",
// //       icon: "📦",
// //       color: "blue",
// //     },
// //     {
// //       id: 2,
// //       type: "order",
// //       action: "Order completed",
// //       details: "Order #1234",
// //       timestamp: "4 hours ago",
// //       icon: "✅",
// //       color: "green",
// //     },
// //     {
// //       id: 3,
// //       type: "user",
// //       action: "New user registered",
// //       details: "john@example.com",
// //       timestamp: "1 day ago",
// //       icon: "👤",
// //       color: "purple",
// //     },
// //     {
// //       id: 4,
// //       type: "category",
// //       action: "New category added",
// //       details: '"Electronics"',
// //       timestamp: "3 hours ago",
// //       icon: "🏷️",
// //       color: "orange",
// //     },
// //   ]);

// //   const getChartData = () => {
// //     const now = new Date();

// //     if (chartView === "daily") {
// //       const dataPoints = [];
// //       for (let i = 29; i >= 0; i--) {
// //         const date = new Date(now);
// //         date.setDate(now.getDate() - i);
// //         dataPoints.push({
// //           period: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
// //           orders: Math.floor(Math.random() * 10) + 1,
// //         });
// //       }
// //       return dataPoints;
// //     } else if (chartView === "weekly") {
// //       const dataPoints = [];
// //       for (let i = 11; i >= 0; i--) {
// //         const date = new Date(now);
// //         date.setDate(now.getDate() - i * 7);
// //         const weekStart = new Date(date);
// //         weekStart.setDate(date.getDate() - date.getDay());
// //         dataPoints.push({
// //           period: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
// //           orders: Math.floor(Math.random() * 50) + 10,
// //         });
// //       }
// //       return dataPoints;
// //     } else {
// //       const dataPoints = [];
// //       for (let i = 11; i >= 0; i--) {
// //         const date = new Date(now);
// //         date.setMonth(now.getMonth() - i);
// //         dataPoints.push({
// //           period: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
// //           orders: Math.floor(Math.random() * 200) + 50,
// //         });
// //       }
// //       return dataPoints;
// //     }
// //   };

// //   const chartData = getChartData();

// //   return (
// //     <div className="space-y-6 md:space-y-8">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
// //         <div className="text-left sm:text-right">
// //           <p className="text-base md:text-lg text-gray-600">Welcome back, Admin</p>
// //           <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
// //         </div>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
// //         <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Products</h3>
// //               <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalProducts}</p>
// //             </div>
// //             <div className="text-4xl md:text-6xl opacity-20">📦</div>
// //           </div>
// //         </div>

// //         <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Orders</h3>
// //               <p className="text-2xl md:text-4xl font-bold mt-2">150</p>
// //             </div>
// //             <div className="text-4xl md:text-6xl opacity-20">🛒</div>
// //           </div>
// //         </div>

// //         <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Categories</h3>
// //               <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalCategories}</p>
// //             </div>
// //             <div className="text-4xl md:text-6xl opacity-20">🏷️</div>
// //           </div>
// //         </div>

// //         <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-sm md:text-lg font-semibold opacity-90">Revenue</h3>
// //               <p className="text-2xl md:text-4xl font-bold mt-2">$12,500</p>
// //             </div>
// //             <div className="text-4xl md:text-6xl opacity-20">💰</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Chart Section */}
// //       <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
// //           <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Orders Over Time</h2>
// //           <div className="flex flex-wrap gap-2">
// //             {["daily", "weekly", "monthly"].map((view) => (
// //               <button
// //                 key={view}
// //                 onClick={() => setChartView(view)}
// //                 className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium ${
// //                   chartView === view
// //                     ? "bg-blue-600 text-white"
// //                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
// //                 }`}
// //               >
// //                 {view.charAt(0).toUpperCase() + view.slice(1)}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="h-64 md:h-80">
// //           <ResponsiveContainer width="100%" height="100%">
// //             <AreaChart data={chartData}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis
// //                 dataKey="period"
// //                 tick={{ fontSize: 12 }}
// //                 interval="preserveStartEnd"
// //               />
// //               <YAxis tick={{ fontSize: 12 }} />
// //               <Tooltip />
// //               <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
// //             </AreaChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>

// //       {/* Bottom Section */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
// //         {/* Recent Activity */}
// //         <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
// //           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
// //           <ul className="space-y-3 md:space-y-4">
// //             {recentActivities.map((activity) => (
// //               <li key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2">
// //                 <div className="flex items-center space-x-3">
// //                   <div
// //                     className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0`}
// //                     style={{ backgroundColor: `${activity.color}10` }}
// //                   >
// //                     <span className={`text-${activity.color}-600 text-sm md:text-base`}>{activity.icon}</span>
// //                   </div>
// //                   <div className="min-w-0 flex-1">
// //                     <p className="font-medium text-gray-900 text-sm md:text-base">{activity.action}</p>
// //                     <p className="text-xs md:text-sm text-gray-600 truncate">{activity.details}</p>
// //                   </div>
// //                 </div>
// //                 <span className="text-xs md:text-sm text-gray-500 sm:text-right">{activity.timestamp}</span>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         {/* Trending Products */}
// //         <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
// //           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Most Trending Products</h2>
// //           <ul className="space-y-3 md:space-y-4">
// //             {loadingStats ? (
// //               <li className="p-3 md:p-4 bg-gray-50 rounded-lg">
// //                 <p className="text-gray-600 text-sm md:text-base">Loading products...</p>
// //               </li>
// //             ) : trendingProducts.length > 0 ? (
// //               trendingProducts.map((product, index) => (
// //                 <li
// //                   key={product.id || index}
// //                   className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2"
// //                 >
// //                   <div className="flex items-center space-x-3">
// //                     <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                       <span className="text-blue-600 text-sm md:text-base">📦</span>
// //                     </div>
// //                     <div className="min-w-0 flex-1">
// //                       <p className="font-medium text-gray-900 text-sm md:text-base truncate">{product.name || "Product Name"}</p>
// //                       <p className="text-xs md:text-sm text-gray-600">${product.price || "0.00"}</p>
// //                     </div>
// //                   </div>
// //                   <span className="text-green-600 font-semibold text-sm md:text-base">
// //                     +{Math.floor(Math.random() * 30) + 10}%
// //                   </span>
// //                 </li>
// //               ))
// //             ) : (
// //               <li className="p-3 md:p-4 bg-gray-50 rounded-lg">
// //                 <p className="text-gray-600 text-sm md:text-base">No products available</p>
// //               </li>
// //             )}
// //           </ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { productService } from "@/services/productService";
// import { categoryService } from "@/services/categoryService";
// import { discountService } from "@/services/discountService";
// import DiscountManager from "@/components/DiscountManager";

// export default function Dashboard() {
//   const { isAuthenticated, loading, logout } = useAuth();
//   const router = useRouter();

//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalCategories, setTotalCategories] = useState(0);
//   const [activeDiscounts, setActiveDiscounts] = useState(0);
//   const [discountedProducts, setDiscountedProducts] = useState(0);
//   const [trendingProducts, setTrendingProducts] = useState([]);
//   const [loadingStats, setLoadingStats] = useState(true);
//   const [chartView, setChartView] = useState("monthly");
//   const [showDiscountManager, setShowDiscountManager] = useState(false);

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, loading, router]);

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (isAuthenticated) {
//         try {
//           const [productsResponse, categoriesResponse, discountsResponse] = await Promise.all([
//             productService.getAll(),
//             categoryService.getAll(),
//             discountService.getAll({ status: 'Active' })
//           ]);

//           const products = productsResponse.data?.products || productsResponse.products || [];
//           const categories = categoriesResponse.data || [];
//           const discounts = discountsResponse.data || [];

//           setTotalProducts(products.length);
//           setTotalCategories(categories.length);
//           setActiveDiscounts(discounts.length);
          
//           // Calculate discounted products
//           const discountedCount = products.filter(product => product.discountedPrice > 0).length;
//           setDiscountedProducts(discountedCount);

//           setTrendingProducts(products.slice(0, 4));
//         } catch (error) {
//           console.error("Error fetching stats:", error);
//         } finally {
//           setLoadingStats(false);
//         }
//       }
//     };

//     fetchStats();
//   }, [isAuthenticated]);

//   const [recentActivities] = useState([
//     {
//       id: 1,
//       type: "product",
//       action: "New product added",
//       details: '"Wireless Headphones"',
//       timestamp: "2 hours ago",
//       icon: "📦",
//       color: "blue",
//     },
//     {
//       id: 2,
//       type: "order",
//       action: "Order completed",
//       details: "Order #1234",
//       timestamp: "4 hours ago",
//       icon: "✅",
//       color: "green",
//     },
//     {
//       id: 3,
//       type: "user",
//       action: "New user registered",
//       details: "john@example.com",
//       timestamp: "1 day ago",
//       icon: "👤",
//       color: "purple",
//     },
//     {
//       id: 4,
//       type: "category",
//       action: "New category added",
//       details: '"Electronics"',
//       timestamp: "3 hours ago",
//       icon: "🏷️",
//       color: "orange",
//     },
//   ]);

//   const getChartData = () => {
//     const now = new Date();

//     if (chartView === "daily") {
//       const dataPoints = [];
//       for (let i = 29; i >= 0; i--) {
//         const date = new Date(now);
//         date.setDate(now.getDate() - i);
//         dataPoints.push({
//           period: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//           orders: Math.floor(Math.random() * 10) + 1,
//           revenue: Math.floor(Math.random() * 500) + 100,
//         });
//       }
//       return dataPoints;
//     } else if (chartView === "weekly") {
//       const dataPoints = [];
//       for (let i = 11; i >= 0; i--) {
//         const date = new Date(now);
//         date.setDate(now.getDate() - i * 7);
//         const weekStart = new Date(date);
//         weekStart.setDate(date.getDate() - date.getDay());
//         dataPoints.push({
//           period: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
//           orders: Math.floor(Math.random() * 50) + 10,
//           revenue: Math.floor(Math.random() * 2500) + 500,
//         });
//       }
//       return dataPoints;
//     } else {
//       const dataPoints = [];
//       for (let i = 11; i >= 0; i--) {
//         const date = new Date(now);
//         date.setMonth(now.getMonth() - i);
//         dataPoints.push({
//           period: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
//           orders: Math.floor(Math.random() * 200) + 50,
//           revenue: Math.floor(Math.random() * 10000) + 2000,
//         });
//       }
//       return dataPoints;
//     }
//   };

//   const chartData = getChartData();

//   if (showDiscountManager) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => setShowDiscountManager(false)}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center gap-2"
//           >
//             ← Back to Dashboard
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Discount Management</h1>
//         </div>
//         <DiscountManager />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 md:space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           <div className="text-left sm:text-right">
//             <p className="text-base md:text-lg text-gray-600">Welcome back, Admin</p>
//             <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
//           </div>
//           <button
//             onClick={() => setShowDiscountManager(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
//           >
//             Manage Discounts
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Products</h3>
//               <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalProducts}</p>
//               <p className="text-xs md:text-sm opacity-80 mt-1">
//                 {discountedProducts} on discount
//               </p>
//             </div>
//             <div className="text-4xl md:text-6xl opacity-20">📦</div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm md:text-lg font-semibold opacity-90">Active Discounts</h3>
//               <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : activeDiscounts}</p>
//               <p className="text-xs md:text-sm opacity-80 mt-1">
//                 Running promotions
//               </p>
//             </div>
//             <div className="text-4xl md:text-6xl opacity-20">🎯</div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm md:text-lg font-semibold opacity-90">Total Categories</h3>
//               <p className="text-2xl md:text-4xl font-bold mt-2">{loadingStats ? "..." : totalCategories}</p>
//               <p className="text-xs md:text-sm opacity-80 mt-1">
//                 Product categories
//               </p>
//             </div>
//             <div className="text-4xl md:text-6xl opacity-20">🏷️</div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-8 rounded-xl shadow-lg text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-sm md:text-lg font-semibold opacity-90">Revenue</h3>
//               <p className="text-2xl md:text-4xl font-bold mt-2">$12,500</p>
//               <p className="text-xs md:text-sm opacity-80 mt-1">
//                 +12% from last month
//               </p>
//             </div>
//             <div className="text-4xl md:text-6xl opacity-20">💰</div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <button
//             onClick={() => router.push('/products/add')}
//             className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition duration-200 text-left"
//           >
//             <div className="text-blue-600 text-2xl mb-2">➕</div>
//             <h3 className="font-semibold text-gray-900">Add Product</h3>
//             <p className="text-sm text-gray-600">Create new product</p>
//           </button>

//           <button
//             onClick={() => setShowDiscountManager(true)}
//             className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition duration-200 text-left"
//           >
//             <div className="text-green-600 text-2xl mb-2">🎯</div>
//             <h3 className="font-semibold text-gray-900">Create Discount</h3>
//             <p className="text-sm text-gray-600">Add special offer</p>
//           </button>

//           <button
//             onClick={() => router.push('/categories')}
//             className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition duration-200 text-left"
//           >
//             <div className="text-purple-600 text-2xl mb-2">🏷️</div>
//             <h3 className="font-semibold text-gray-900">Manage Categories</h3>
//             <p className="text-sm text-gray-600">View all categories</p>
//           </button>

//           <button
//             onClick={() => router.push('/products')}
//             className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition duration-200 text-left"
//           >
//             <div className="text-orange-600 text-2xl mb-2">📊</div>
//             <h3 className="font-semibold text-gray-900">View Products</h3>
//             <p className="text-sm text-gray-600">All products list</p>
//           </button>
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Sales Analytics</h2>
//           <div className="flex flex-wrap gap-2">
//             {["daily", "weekly", "monthly"].map((view) => (
//               <button
//                 key={view}
//                 onClick={() => setChartView(view)}
//                 className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium ${
//                   chartView === view
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {view.charAt(0).toUpperCase() + view.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="h-64 md:h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="period"
//                 tick={{ fontSize: 12 }}
//                 interval="preserveStartEnd"
//               />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip 
//                 formatter={(value, name) => {
//                   if (name === 'revenue') return [`$${value}`, 'Revenue'];
//                   return [value, 'Orders'];
//                 }}
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey="orders" 
//                 stackId="1"
//                 stroke="#8884d8" 
//                 fill="#8884d8" 
//                 fillOpacity={0.6} 
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey="revenue" 
//                 stackId="2"
//                 stroke="#82ca9d" 
//                 fill="#82ca9d" 
//                 fillOpacity={0.6} 
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//         {/* Recent Activity */}
//         <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Recent Activity</h2>
//           <ul className="space-y-3 md:space-y-4">
//             {recentActivities.map((activity) => (
//               <li key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-2">
//                 <div className="flex items-center space-x-3">
//                   <div
//                     className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0`}
//                     style={{ 
//                       backgroundColor: activity.color === 'blue' ? '#dbeafe' : 
//                                     activity.color === 'green' ? '#dcfce7' : 
//                                     activity.color === 'purple' ? '#f3e8ff' : 
//                                     '#fed7aa' 
//                     }}
//                   >
//                     <span className={`text-sm md:text-base ${
//                       activity.color === 'blue' ? 'text-blue-600' : 
//                       activity.color === 'green' ? 'text-green-600' : 
//                       activity.color === 'purple' ? 'text-purple-600' : 
//                       'text-orange-600'
//                     }`}>{activity.icon}</span>
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="font-medium text-gray-900 text-sm md:text-base">{activity.action}</p>
//                     <p className="text-xs md:text-sm text-gray-600 truncate">{activity.details}</p>
//                   </div>
//                 </div>
//                 <span className="text-xs md:text-sm text-gray-500 sm:text-right">{activity.timestamp}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Discounts Overview */}
//         <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg">
//           <div className="flex justify-between items-center mb-4 md:mb-6">
//             <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Active Discounts</h2>
//             <button
//               onClick={() => setShowDiscountManager(true)}
//               className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//             >
//               View All →
//             </button>
//           </div>
          
//           {loadingStats ? (
//             <div className="space-y-4">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-lg">
//                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           ) : activeDiscounts > 0 ? (
//             <div className="space-y-4">
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold text-green-800">Summer Sale</h3>
//                     <p className="text-sm text-green-600">20% off on all products</p>
//                   </div>
//                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                     Active
//                   </span>
//                 </div>
//                 <div className="mt-2 text-xs text-green-700">
//                   Ends: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold text-blue-800">Clearance</h3>
//                     <p className="text-sm text-blue-600">Up to 50% off selected items</p>
//                   </div>
//                   <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
//                     Active
//                   </span>
//                 </div>
//                 <div className="mt-2 text-xs text-blue-700">
//                   Ends: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
//                 </div>
//               </div>

//               <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition duration-200">
//                 <button
//                   onClick={() => setShowDiscountManager(true)}
//                   className="text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   + Create New Discount
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
//               <div className="text-4xl mb-4">🎯</div>
//               <h3 className="font-semibold text-gray-900 mb-2">No Active Discounts</h3>
//               <p className="text-gray-600 mb-4">Create your first discount to boost sales</p>
//               <button
//                 onClick={() => setShowDiscountManager(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
//               >
//                 Create Discount
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { discountService } from "@/services/discountService";
import DiscountManager from "@/components/DiscountManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Tag, 
  Percent, 
  TrendingUp, 
  Plus, 
  ArrowLeft,
  Activity,
  ShoppingCart,
  Users,
  FolderOpen
} from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [activeDiscounts, setActiveDiscounts] = useState(0);
  const [discountedProducts, setDiscountedProducts] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartView, setChartView] = useState("monthly");
  const [showDiscountManager, setShowDiscountManager] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated) {
        try {
          const [productsResponse, categoriesResponse, discountsResponse] = await Promise.all([
            productService.getAll(),
            categoryService.getAll(),
            discountService.getAll({ status: 'Active' })
          ]);

          const products = productsResponse.data?.products || productsResponse.products || [];
          const categories = categoriesResponse.data || [];
          const discounts = discountsResponse.data || [];

          setTotalProducts(products.length);
          setTotalCategories(categories.length);
          setActiveDiscounts(discounts.length);
          
          const discountedCount = products.filter(product => product.discountedPrice > 0).length;
          setDiscountedProducts(discountedCount);

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
          revenue: Math.floor(Math.random() * 500) + 100,
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
          revenue: Math.floor(Math.random() * 2500) + 500,
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
          revenue: Math.floor(Math.random() * 10000) + 2000,
        });
      }
      return dataPoints;
    }
  };

  const chartData = getChartData();

  if (showDiscountManager) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowDiscountManager(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Discount Management</h1>
        </div>
        <DiscountManager />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin • {new Date().toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setShowDiscountManager(true)} className="flex items-center gap-2">
          <Percent className="h-4 w-4" />
          Manage Discounts
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {discountedProducts} on discount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : activeDiscounts}</div>
            <p className="text-xs text-muted-foreground">
              Running promotions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingStats ? "..." : totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,500</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={() => router.push('/products/add')}
              variant="outline"
              className="h-auto flex-col items-center justify-center p-4 space-y-2"
            >
              <Plus className="h-6 w-6" />
              <span className="font-semibold">Add Product</span>
              <span className="text-xs text-muted-foreground text-center">Create new product</span>
            </Button>

            <Button
              onClick={() => setShowDiscountManager(true)}
              variant="outline"
              className="h-auto flex-col items-center justify-center p-4 space-y-2"
            >
              <Percent className="h-6 w-6" />
              <span className="font-semibold">Create Discount</span>
              <span className="text-xs text-muted-foreground text-center">Add special offer</span>
            </Button>

            <Button
              onClick={() => router.push('/categories')}
              variant="outline"
              className="h-auto flex-col items-center justify-center p-4 space-y-2"
            >
              <FolderOpen className="h-6 w-6" />
              <span className="font-semibold">Manage Categories</span>
              <span className="text-xs text-muted-foreground text-center">View all categories</span>
            </Button>

            <Button
              onClick={() => router.push('/products')}
              variant="outline"
              className="h-auto flex-col items-center justify-center p-4 space-y-2"
            >
              <Package className="h-6 w-6" />
              <span className="font-semibold">View Products</span>
              <span className="text-xs text-muted-foreground text-center">All products list</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Track your sales performance</CardDescription>
            </div>
            <Tabs value={chartView} onValueChange={setChartView} className="w-auto">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`$${value}`, 'Revenue'];
                    return [value, 'Orders'];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${
                    activity.color === 'blue' ? 'bg-blue-100' : 
                    activity.color === 'green' ? 'bg-green-100' : 
                    activity.color === 'purple' ? 'bg-purple-100' : 
                    'bg-orange-100'
                  }`}>
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discounts Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Discounts</CardTitle>
              <CardDescription>Currently running promotions</CardDescription>
            </div>
            <Button
              onClick={() => setShowDiscountManager(true)}
              variant="ghost"
              size="sm"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-4 bg-muted rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : activeDiscounts > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">Summer Sale</h3>
                      <p className="text-sm text-green-600">20% off on all products</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-green-700">
                    Ends: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800">Clearance</h3>
                      <p className="text-sm text-blue-600">Up to 50% off selected items</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    Ends: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>

                <Button
                  onClick={() => setShowDiscountManager(true)}
                  variant="outline"
                  className="w-full"
                >
                  + Create New Discount
                </Button>
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                <Percent className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">No Active Discounts</h3>
                <p className="text-muted-foreground mb-4">Create your first discount to boost sales</p>
                <Button onClick={() => setShowDiscountManager(true)}>
                  Create Discount
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}