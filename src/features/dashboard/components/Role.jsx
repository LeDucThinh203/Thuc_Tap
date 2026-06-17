// src/features/dashboard/components/Role.jsx
/**
 * Role.jsx — Admin page for managing users and operators.
 * Provides a table of mock users with actions to toggle active status,
 * reset password, and change a user's role via a "Set Role" button.
 * Only accessible to admin role via routing protection.
 */
import { useState, useEffect } from 'react';
import { getUsers, adminResetPassword, deactivateAccount, reactivateAccount, isAccountDeactivated } from 'services/authService';
import { ROLES } from 'constants/roles';
import { useAuth } from 'hooks/useAuth';
import { RefreshCw, UserCheck, UserX } from 'lucide-react';

export default function Role() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  // local state to hold selected role for each user before applying
  const [selectedRoles, setSelectedRoles] = useState({});
  // Store new password inputs per user
  const [newPasswords, setNewPasswords] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const fetched = await getUsers();
        // Ensure admin appears first
        const sorted = fetched.sort((a, b) => a.username === 'admin' ? -1 : b.username === 'admin' ? 1 : 0);
        setUsers(sorted);
        // Initialize selectedRoles based on fetched users
        setSelectedRoles(fetched.reduce((acc, u) => ({ ...acc, [u.id]: u.role }), {}));
      } catch (e) {
        console.error('Failed to load users:', e);
      }
    })();
  }, []);

  const saveUserChanges = (id) => {
    const newRole = selectedRoles[id];
    // Update role only
    updateUserRole(id, newRole);
    console.log('Saved role for user', id);
  };

  if (role !== ROLES.ADMIN) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Không có quyền truy cập</h2>
      </div>
    );
  }

  const deactivateUser = (id, username) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    if (user.active) {
      // Deactivate
      deactivateAccount(username);
    } else {
      // Reactivate
      reactivateAccount(username);
    }
    // Toggle active flag in UI
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, active: !u.active } : u))
    );
    console.log(user.active ? 'Deactivated' : 'Reactivated', username);
  };

  const resetPassword = async (username, newPassword) => {
    try {
      await adminResetPassword(username, newPassword);
      alert(`Mật khẩu cho ${username} đã được đổi thành công`);
      console.log('Password reset for', username);
    } catch (e) {
      console.error('Reset password error:', e);
      alert(`Đổi mật khẩu thất bại: ${e.message}`);
    }
  };

  const updateUserRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    console.log('Updated role for user', id, 'to', newRole);
  };

  const handleRoleChange = (id, value) => {
    setSelectedRoles((prev) => ({ ...prev, [id]: value }));
  };

  // Filter users based on search query (username or role)
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Quản lý vai trò</h2>
                <input
          type="text"
          placeholder="Tìm kiếm tài khoản…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Tên đăng nhập</th>
            <th className="px-4 py-2 text-left">Vai trò</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2 text-left">Cập nhật vai trò</th>
            <th className="px-4 py-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
                     {filteredUsers.map((user) => (
      <tr key={user.id} className="border-t">
        <td className="px-4 py-2">{user.username}</td>
        <td className="px-4 py-2 text-capitalize">{user.role}</td>
        <td className="px-4 py-2">
          {user.active ? (
            <span className="inline-flex items-center gap-1 text-green-600">
              <UserCheck size={14} /> Hoạt động
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-red-600">
              <UserX size={14} /> Vô hiệu
            </span>
          )}
        </td>
        {user.username === 'admin' ? (
          <td className="px-4 py-2" colSpan={2}>--</td>
        ) : (
          <>
            <td className="px-4 py-2">
              <select
                value={selectedRoles[user.id]}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="rounded border-gray-300 text-sm"
              >
                <option value="admin">admin</option>
                <option value="operator">operator</option>
                <option value="user">user</option>
              </select>
              <button
                onClick={() => saveUserChanges(user.id)}
                className="ml-2 px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Save
              </button>
            </td>
            <td className="px-4 py-2 text-center space-x-2">
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPasswords[user.id] || ''}
                onChange={e => setNewPasswords(prev => ({ ...prev, [user.id]: e.target.value }))}
                className="border rounded px-2 py-1 mr-2"
              />
              <button
                onClick={() => resetPassword(user.username, newPasswords[user.id])}
                className="p-1 text-indigo-600 hover:text-indigo-800"
                disabled={!newPasswords[user.id]}
              >
                <RefreshCw size={16} title="Đặt lại mật khẩu" />
              </button>
              <button
                onClick={() => deactivateUser(user.id, user.username)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                {user.active ? (
                  <UserX size={16} title="Vô hiệu hóa" />
                ) : (
                  <UserCheck size={16} title="Kích hoạt" />
                )}
              </button>
            </td>
          </>
        )}
      </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
