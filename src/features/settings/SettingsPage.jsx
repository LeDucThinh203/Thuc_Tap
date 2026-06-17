/**
 * SettingsPage.jsx — System settings (admin only).
 * TODO: Wire in real settings API.
 */
import Card from 'components/common/Card';
import Button from 'components/common/Button';
import Input from 'components/common/Input';

export default function SettingsPage() {
  return (
    <div className="page-container flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Cài đặt hệ thống</h2>
        <p className="text-slate-500 text-sm mt-1">Chỉ dành cho quản trị viên</p>
      </div>

      <Card title="Cấu hình chung">
        <div className="flex flex-col gap-4 max-w-md">
          <Input id="settings-app-name" label="Tên hệ thống" defaultValue="Smart Parking System" />
          <Input id="settings-refresh"  label="Tần suất làm mới (giây)" type="number" defaultValue="30" />
          <Button className="self-start">Lưu thay đổi</Button>
        </div>
      </Card>

      <Card title="AWS Configuration">
        <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
          <p>Cấu hình AWS được quản lý qua biến môi trường <code className="bg-slate-100 dark:bg-surface-700 px-1 rounded">.env.local</code></p>
          <p>Xem <code className="bg-slate-100 dark:bg-surface-700 px-1 rounded">.env.example</code> để biết các biến cần thiết.</p>
        </div>
      </Card>
    </div>
  );
}
