'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/leads/${id}`);
      setDeleted(true);
      setTimeout(() => setDeleted(false), 3000);
      fetchLeads();
    } catch (error) {
      console.error('Failed to delete lead.', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Admin: Manage Leads</h1>
        <Link href="/leads/new">
          <Button>Add Lead</Button>
        </Link>
      </div>

      {deleted && (
        <div className="fixed top-4 right-4 z-50">
          <Alert variant="destructive" className="bg-red-100 border border-red-400 text-red-700">
            <AlertDescription>Lead soft deleted successfully.</AlertDescription>
          </Alert>
        </div>
      )}

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
          {leads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{formatDate(lead.submitted_at)}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/leads/admin/edit/${lead._id}`}>
                  <Button variant="link" className="text-green-600 cursor-pointer">Edit</Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-red-600 cursor-pointer"
                      onClick={() => setSelectedLeadId(lead._id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will soft delete the lead. You cannot undo this.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => selectedLeadId && handleDelete(selectedLeadId)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
