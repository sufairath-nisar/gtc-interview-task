'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { ChevronDownIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Errors = {
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
};

export default function NewLeadForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    submitted_at: '',
  });
  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
    phone: '',
    source: '',
    submitted_at: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Partial<Errors> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.source.trim()) newErrors.source = 'Source is required';
    if (!form.submitted_at) newErrors.submitted_at = 'Submitted date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    try {
    await api.post('/leads', form);
    setSuccess(true); 
    setTimeout(() => {
      router.push('/leads'); 
    }, 1000);
    } catch (error) {
      console.error("Failed to add lead", error);
    }
  };

  const [calendarOpen, setCalendarOpen] = useState(false);
  const selectedDate = form.submitted_at ? new Date(form.submitted_at) : undefined;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Lead</h2>

        {[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email' },
          { name: 'phone', label: 'Phone' },
          { name: 'source', label: 'Source' },
        ].map(({ name, label }) => (
          <div key={name} className="mb-4">
            <Label htmlFor={name} className="block mb-1">
              {label}
            </Label>
            <Input
              id={name}
              type="text"
              name={name}
              placeholder={label}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors[name as keyof Errors] && (
              <p className="mt-1 text-sm text-red-600 font-semibold">
                {errors[name as keyof Errors]}
              </p>
            )}
          </div>
        ))}

        <div className="mb-4">
          <Label htmlFor="submitted_at" className="block mb-1">
            Submitted Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="submitted_at"
                className="w-full justify-between font-normal"
              >
                {form.submitted_at
                  ? new Date(form.submitted_at + 'T00:00:00').toLocaleDateString()
                  : 'Select date'}
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
                    const isoDate = `${year}-${month}-${day}`; // 'YYYY-MM-DD'

                    setForm({ ...form, submitted_at: isoDate });
                    setErrors({ ...errors, submitted_at: '' });
                    setCalendarOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.submitted_at && (
            <p className="mt-1 text-sm text-red-600 font-semibold">
              {errors.submitted_at}
            </p>
          )}
        </div>

          {success && (
            <Alert variant="default" className="bg-green-100 border-green-400 text-green-700 mb-4">
              <AlertDescription>✅ Lead added successfully!</AlertDescription>
            </Alert>
          )}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
