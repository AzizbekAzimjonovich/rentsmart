import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { RENTAL_TYPES } from '../../utils/constants';

const empty = {
  title: '',
  price: '',
  address: '',
  rooms: '1',
  description: '',
  contact: '',
  rentalType: 'apartment',
};

export default function ListingFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    let c = true;
    (async () => {
      try {
        const { data } = await api.get('/listings/mine');
        const found = data.listings?.find((x) => x._id === id);
        if (c && found) {
          setForm({
            title: found.title,
            price: String(found.price),
            address: found.address,
            rooms: String(found.rooms),
            description: found.description,
            contact: found.contact,
            rentalType: found.rentalType,
          });
        } else if (c) {
          toast.error('Listing not found');
          navigate('/dashboard/listings');
        }
      } catch {
        if (c) navigate('/dashboard/listings');
      } finally {
        if (c) setLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, [id, isEdit, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('price', form.price);
    fd.append('address', form.address);
    fd.append('rooms', form.rooms);
    fd.append('description', form.description);
    fd.append('contact', form.contact);
    fd.append('rentalType', form.rentalType);
    files.forEach((f) => fd.append('images', f));

    try {
      if (isEdit) {
        await api.patch(`/listings/mine/${id}`, fd);
        toast.success('Updated — pending review again');
      } else {
        await api.post('/listings', fd);
        toast.success('Listing submitted — pending approval');
      }
      navigate('/dashboard/listings');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {isEdit ? 'Edit listing' : 'New listing'}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Monthly price ($)</label>
            <input
              name="price"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rooms</label>
            <input
              name="rooms"
              type="number"
              required
              min="0"
              value={form.rooms}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            name="address"
            required
            value={form.address}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rental type</label>
          <select
            name="rentalType"
            value={form.rentalType}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {RENTAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            value={form.description}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact phone</label>
          <input
            name="contact"
            required
            value={form.contact}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Images {!isEdit && '(at least one recommended)'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full text-sm"
          />
          {isEdit && (
            <p className="text-xs text-slate-500 mt-1">New images are appended. Existing photos stay on the server.</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700"
        >
          {isEdit ? 'Save changes' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
