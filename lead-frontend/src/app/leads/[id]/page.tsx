import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const res = await api.get(`/leads/${params.id}`);
  const lead = res.data;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm text-gray-500">Name</Label>
            <p className="text-base font-medium text-gray-800">{lead.name}</p>
            <Separator />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Email</Label>
            <p className="text-base font-medium text-gray-800">{lead.email}</p>
            <Separator />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Phone</Label>
            <p className="text-base font-medium text-gray-800">{lead.phone}</p>
            <Separator />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Source</Label>
            <p className="text-base font-medium text-gray-800">{lead.source}</p>
            <Separator />
          </div>
          <div>
            <Label className="text-sm text-gray-500">Submitted</Label>
            <p className="text-base font-medium text-gray-800">{formatDate(lead.submitted_at)}</p>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}
