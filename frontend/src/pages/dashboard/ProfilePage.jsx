import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { setUser } from '../../redux/authSlice';

export default function ProfilePage() {
  const u = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (u) {
      setName(u.name);
      setEmail(u.email);
    }
  }, [u]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name, email };
      if (password.length) body.password = password;
      const { data } = await api.patch('/auth/profile', body);
      dispatch(setUser(data.user));
      setPassword('');
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (!u) return null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <p className="text-sm text-slate-500">
          Role: <strong className="text-slate-800 dark:text-slate-200">{u.role}</strong>
        </p>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
