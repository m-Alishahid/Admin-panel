"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
// import ProtectedRoute from '@/components/ProtectedRoute';

// export default function UsersManagementPage() {
//   return (
//     <ProtectedRoute requiredPermissions={[['user', 'view']]}>
//       <UsersManagement />
//     </ProtectedRoute>
//   );
// }

export default function Users() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Users state
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // User form state
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    position: '',
    employeeId: '',
    role: ''
  });

  // Role form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: {
      user: { view: false, create: false, edit: false, delete: false, change_role: false },
      category: { view: false, create: false, edit: false, delete: false },
      product: { view: false, create: false, edit: false, delete: false },
      order: { view: false, create: false, edit: false, delete: false, update_status: false },
      inventory: { view: false, create: false, edit: false, delete: false },
      analytics: { view: false, export: false },
      settings: { view: false, edit: false }
    }
  });

  // Load users and roles
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users || []);
      }
    } catch (error) {
      showMessage('error', 'Failed to load users');
    }
  };

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data || []);
      }
    } catch (error) {
      showMessage('error', 'Failed to load roles');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // User form handlers
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'User created successfully');
        setUserForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          department: '',
          position: '',
          employeeId: '',
          role: ''
        });
        loadUsers(); // Reload users list
      } else {
        showMessage('error', data.error || 'Failed to create user');
      }
    } catch (error) {
      showMessage('error', 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Role form handlers
  const handleRoleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const [, module, action] = name.split('.');
      setRoleForm(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: {
            ...prev.permissions[module],
            [action]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setRoleForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleForm),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Role created successfully');
        setRoleForm({
          name: '',
          description: '',
          permissions: {
            user: { view: false, create: false, edit: false, delete: false, change_role: false },
            category: { view: false, create: false, edit: false, delete: false },
            product: { view: false, create: false, edit: false, delete: false },
            order: { view: false, create: false, edit: false, delete: false, update_status: false },
            inventory: { view: false, create: false, edit: false, delete: false },
            analytics: { view: false, export: false },
            settings: { view: false, edit: false }
          }
        });
        loadRoles(); // Reload roles list
      } else {
        showMessage('error', data.error || 'Failed to create role');
      }
    } catch (error) {
      showMessage('error', 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'User deleted successfully');
        loadUsers();
      } else {
        showMessage('error', data.error || 'Failed to delete user');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        loadUsers();
      } else {
        showMessage('error', data.error || 'Failed to update user status');
      }
    } catch (error) {
      showMessage('error', 'Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Users & Roles Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage users and roles for the admin panel.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`mr-8 py-4 px-1 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
              {hasPermission('user', 'create') && (
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`py-4 px-1 text-sm font-medium ${
                    activeTab === 'roles'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Roles ({roles.length})
                </button>
              )}
            </nav>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`m-4 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Create User Form */}
                {hasPermission('user', 'create') && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Create New User</h2>
                    <form onSubmit={handleUserSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          value={userForm.firstName}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          value={userForm.lastName}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={userForm.email}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          required
                          minLength="6"
                          value={userForm.password}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={userForm.phone}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role *
                        </label>
                        <select
                          name="role"
                          id="role"
                          required
                          value={userForm.role}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={userForm.department}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <input
                          type="text"
                          name="position"
                          id="position"
                          value={userForm.position}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          name="employeeId"
                          id="employeeId"
                          value={userForm.employeeId}
                          onChange={handleUserFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Creating...' : 'Create User'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Users List */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">All Users</h2>
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <li key={userItem._id}>
                          <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {userItem.firstName?.charAt(0)}{userItem.lastName?.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.firstName} {userItem.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {userItem.email}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {userItem.role?.name} • {userItem.department} • {userItem.position}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleToggleUserStatus(userItem._id, userItem.isActive)}
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                                  userItem.isActive
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {userItem.isActive ? 'Active' : 'Inactive'}
                              </button>
                              {hasPermission('user', 'delete') && (
                                <button
                                  onClick={() => handleDeleteUser(userItem._id)}
                                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && hasPermission('user', 'create') && (
              <div className="space-y-6">
                {/* Create Role Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h2>
                  <form onSubmit={handleRoleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                          Role Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="roleName"
                          required
                          value={roleForm.name}
                          onChange={handleRoleFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., admin, manager, support"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description *
                        </label>
                        <input
                          type="text"
                          name="description"
                          id="description"
                          required
                          value={roleForm.description}
                          onChange={handleRoleFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief description of the role"
                        />
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                      
                      {/* User Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">User Management</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {Object.entries(roleForm.permissions.user).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.user.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action.replace('_', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Category Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Category Management</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(roleForm.permissions.category).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.category.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Product Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Product Management</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(roleForm.permissions.product).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.product.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Order Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Order Management</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {Object.entries(roleForm.permissions.order).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.order.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action.replace('_', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Inventory Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Inventory Management</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(roleForm.permissions.inventory).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.inventory.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Analytics Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Analytics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                          {Object.entries(roleForm.permissions.analytics).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.analytics.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Settings Permissions */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Settings</h4>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                          {Object.entries(roleForm.permissions.settings).map(([action, value]) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`permissions.settings.${action}`}
                                checked={value}
                                onChange={handleRoleFormChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {action}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating...' : 'Create Role'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Roles List */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">All Roles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                      <div key={role._id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium text-gray-900 capitalize">
                            {role.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                        <div className="space-y-2">
                          {Object.entries(role.permissions).map(([module, permissions]) => (
                            <div key={module} className="text-sm">
                              <span className="font-medium capitalize">{module}:</span>{' '}
                              <span className="text-gray-600">
                                {Object.entries(permissions)
                                  .filter(([_, value]) => value)
                                  .map(([action]) => action)
                                  .join(', ') || 'None'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}