// Prevents odd inference and enforces app router behavior
export const dynamic = 'force-dynamic';

import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type LeadPageProps = {
  params: { id: string };
};

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { data: lead } = await api.get(`/leads/${params.id}`);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {['name', 'email', 'phone', 'source', 'submitted_at'].map((field, i) => (
            <div key={i}>
              <Label className="text-sm text-gray-500">
                {field === 'submitted_at' ? 'Submitted' : field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <p className="text-base font-medium text-gray-800">
                {field === 'submitted_at' ? formatDate(lead[field]) : lead[field]}
              </p>
              {i < 4 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
