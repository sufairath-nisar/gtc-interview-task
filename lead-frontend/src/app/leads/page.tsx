import { api } from '@/lib/api';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SourceFilter from '@/components/SourceFilter';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
}

interface Props {
  searchParams: {
    source?: string;
  };
}

export default async function LeadsPage({ searchParams }: Props) {
  let leads: Lead[] = [];

  try {
    const res = await api.get('/leads');
    leads = res.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return (
      <div className="max-w-4xl mx-auto text-red-600 p-4">
        Failed to load leads. Please check the API server.
      </div>
    );
  }

  const sourceFilter = searchParams.source || '';
  const filteredLeads = sourceFilter
    ? leads.filter((lead) => lead.source === sourceFilter)
    : leads;

  const uniqueSources = Array.from(new Set(leads.map((lead) => lead.source)));

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">All Leads</h1>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <SourceFilter uniqueSources={uniqueSources} sourceFilter={sourceFilter} />
        <Link href="/leads/new" className="">
          <Button>Add Lead</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{formatDate(lead.submitted_at)}</TableCell>
              <TableCell>
                <Link href={`/leads/${lead._id}`}>
                  <Button variant="link" className="text-blue-600 cursor-pointer">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
