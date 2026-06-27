// src/features/dashboard/components/Role.jsx
/**
 * Role.jsx — Admin page for managing users and operators.
 * Provides a table of mock users with actions to toggle active status,
 * reset password, and change a user's role via a "Set Role" button.
 * Only accessible to admin role via routing protection.
 */
import { useState, useEffect } from 'react';
import { getUsers, adminResetPassword, deleteAccount, updateUserRole as updateUserRoleAPI, toggleAccountActive } from 'services/authService';
import { ROLES } from 'constants/roles';
import { useAuth } from 'hooks/useAuth';
import { RefreshCw, UserCheck, UserX, Trash, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Role() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  // local state to hold selected role for each user before applying
  const [selectedRoles, setSelectedRoles] = useState({});
  // Store new password inputs per user
  const [newPasswords, setNewPasswords] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  
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

  const saveUserChanges = async (id) => {
    const newRole = selectedRoles[id];
    const user = users.find(u => u.id === id);
    if (!user) return;
    setLoadingStates(prev => ({ ...prev, [id]: 'role' }));
    try {
      await updateUserRoleAPI({ account_id: user.id, username: user.username, role: newRole });
      // Update local UI after successful backend update
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
      );
      console.log('Updated role for user', id, 'to', newRole);
    } catch (e) {
      console.error('Failed to update role on server:', e);
      alert('Cập nhật vai trò thất bại: ' + (e.message || e));
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  if (role !== ROLES.ADMIN) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Không có quyền truy cập</h2>
      </div>
    );
  }

  const deactivateUser = async (id, username) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setLoadingStates(prev => ({ ...prev, [id]: 'active' }));
    try {
      await toggleAccountActive({ account_id: user.id, username, active: !user.active });
      // Toggle active flag in UI
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, active: !u.active } : u))
      );
      console.log(user.active ? 'Deactivated' : 'Reactivated', username);
    } catch (e) {
      console.error('Failed to toggle user status:', e);
      alert('Cập nhật trạng thái tài khoản thất bại: ' + (e.message || e));
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  // Delete user account
  const deleteUser = async (id, username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) return;
    setLoadingStates(prev => ({ ...prev, [id]: 'delete' }));
    try {
      await deleteAccount(username);
      // Remove from UI
      setUsers(prev => prev.filter(u => u.id !== id));
      // Clean up selectedRoles and passwords
      setSelectedRoles(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setNewPasswords(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      alert('Xóa tài khoản thành công');
    } catch (e) {
      console.error('Delete account error:', e);
      alert(`Xóa tài khoản thất bại: ${e.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const resetPassword = async (username, newPassword) => {
    const user = users.find(u => u.username === username);
    if (!user) return;
    setLoadingStates(prev => ({ ...prev, [user.id]: 'password' }));
    try {
      await adminResetPassword(username, newPassword);
      alert(`Mật khẩu cho ${username} đã được đổi thành công`);
      setNewPasswords(prev => ({ ...prev, [user.id]: '' }));
      console.log('Password reset for', username);
    } catch (e) {
      console.error('Reset password error:', e);
      alert(`Đổi mật khẩu thất bại: ${e.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [user.id]: null }));
    }
  };

  const handleRoleChange = (id, value) => {
    setSelectedRoles(prev => ({ ...prev, [id]: value }));
  };

  // Filter users based on search query (username or role)
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container flex flex-col gap-6 animate-fade-in text-[14px] leading-[1.6]">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Quản lý vai trò</h2>
        <p className="text-[#475569] text-[13px] mt-0.5">
          Quản lý tài khoản và vai trò trong hệ thống.
        </p>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm tài khoản…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
      />

      {/* Data table card */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden min-h-0 flex flex-col">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] font-medium uppercase text-[11px] tracking-wider select-none">
                <th className="px-4 py-3 font-semibold">Tên đăng nhập</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Cập nhật vai trò</th>
                <th className="px-4 py-3 font-semibold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3 text-capitalize">{user.role}</td>
                  <td className="px-4 py-3">
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
                    <td className="px-4 py-3" colSpan={2}>--</td>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRoles[user.id]}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            disabled={loadingStates[user.id] === 'role'}
                          >
                            <option value="admin">admin</option>
                            <option value="operator">operator</option>
                            <option value="user">user</option>
                          </select>
                          <button
                            onClick={() => saveUserChanges(user.id)}
                            className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            disabled={loadingStates[user.id] === 'role'}
                          >
                            {loadingStates[user.id] === 'role' ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type={showPasswords[user.id] ? 'text' : 'password'}
                              placeholder="Mật khẩu mới"
                              value={newPasswords[user.id] || ''}
                              onChange={e => setNewPasswords(prev => ({ ...prev, [user.id]: e.target.value }))}
                              className="border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                              disabled={loadingStates[user.id] === 'password'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                              disabled={loadingStates[user.id] === 'password'}
                            >
                              {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => resetPassword(user.username, newPasswords[user.id])}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={!newPasswords[user.id] || loadingStates[user.id] === 'password'}
                            >
                              {loadingStates[user.id] === 'password' ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} title="Đặt lại mật khẩu" />}
                            </button>
                            <button
                              onClick={() => deactivateUser(user.id, user.username)}
                              className="p-1.5 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={loadingStates[user.id] === 'active'}
                            >
                              {loadingStates[user.id] === 'active' ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : user.active ? (
                                <UserX size={16} title="Vô hiệu hóa" />
                              ) : (
                                <UserCheck size={16} title="Kích hoạt" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id, user.username)}
                              className="p-1.5 text-red-700 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={loadingStates[user.id] === 'delete'}
                            >
                              {loadingStates[user.id] === 'delete' ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} title="Xóa tài khoản" />}
                            </button>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}