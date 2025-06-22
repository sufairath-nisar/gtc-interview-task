import EditLeadForm from './EditLeadForm';
import { api } from '@/lib/api';

export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const res = await api.get(`/leads/${id}`);
    const lead = res.data;

    return <EditLeadForm lead={lead} />;
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    return <div className="text-red-600 text-center mt-6">Error: Failed to fetch lead.</div>;
  }
}
