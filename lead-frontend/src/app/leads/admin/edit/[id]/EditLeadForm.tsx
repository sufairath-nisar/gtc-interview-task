'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type LeadForm = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
};

function parseDateFromYMD(dateString: string): Date | undefined {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return undefined;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function EditLeadForm({ lead }: { lead: LeadForm }) {
  const router = useRouter();
  const [form, setForm] = useState<LeadForm>(
    lead ?? {
      _id: '',
      name: '',
      email: '',
      phone: '',
      source: '',
      submitted_at: '',
    }
  );

  const [error, setError] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const selectedDate = form.submitted_at && /^\d{4}-\d{2}-\d{2}$/.test(form.submitted_at)
    ? parseDateFromYMD(form.submitted_at)
    : undefined;

  const [success, setSuccess] = useState(false);

  if (!form._id) {
    return <div className="text-center text-gray-500 mt-10">Loading lead data...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form._id) {
      setError('Lead ID is missing.');
      return;
    }

    try {
      await api.put(`/leads/${form._id}`, form);
      setSuccess(true);
      setTimeout(() => {
        router.push('/leads/admin');
      }, 1500);
    } catch (error) {
      console.error('Failed to update lead', error);
      setError('Failed to update lead. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Lead</h2>
      {success && (
        <Alert variant="default" className="bg-green-100 border-green-400 text-green-700 mb-4">
          <AlertDescription>Lead updated successfully!</AlertDescription>
        </Alert>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded mb-4 text-sm">{error}</div>
      )}

      {['name', 'email', 'phone', 'source'].map((field) => (
        <div key={field} className="mb-4">
          <Label htmlFor={field} className="block mb-1">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Label>
          <Input
            id={field}
            type="text"
            name={field}
            value={form[field as keyof LeadForm]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
          />
        </div>
      ))}

      <div className="mb-4">
        <Label htmlFor="submitted_at" className="block mb-1">
          Submitted Date
        </Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="submitted_at" className="w-full justify-between font-normal">
              {form.submitted_at && form.submitted_at !== '' ? form.submitted_at.split('T')[0] : 'Select date'}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const isoDate = `${year}-${month}-${day}`; // YYYY-MM-DD

                  setForm({ ...form, submitted_at: isoDate });
                  setCalendarOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
        Update
      </Button>
    </form>
  );
}
