'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Meeting {
  id: number;
  student_name: string;
  subject: string;
  meeting_date: string;
  meeting_time: string;
  reason: string;
  status: 'pending' | 'accept' | 'rejected';
  parent_name: string;
}

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rejectionDialog, setRejectionDialog] = useState({
    isOpen: false,
    meetingId: 0,
    reason: ''
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/meetings?teacherId=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, [user?.id]);

  const handleAction = async (meetingId: number, action: 'accept' | 'reject') => {
    if (action === 'reject') {
      setRejectionDialog({
        isOpen: true,
        meetingId,
        reason: ''
      });
      return;
    }

    try {
      const response = await fetch('/api/meetings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId,
          status: action,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Meeting ${action}ed successfully`);
        setMeetings(meetings.map(m => 
          m.id === meetingId ? { ...m, status: action } : m
        ));
      }
    } catch (error) {
      console.error(`Error ${action}ing meeting:`, error);
      toast.error(`Failed to ${action} meeting`);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: rejectionDialog.meetingId,
          status: 'rejected',
          message: rejectionDialog.reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Meeting rejected successfully');
        setMeetings(meetings.map(m => 
          m.id === rejectionDialog.meetingId ? { ...m, status: 'rejected' } : m
        ));
        setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' });
      }
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      toast.error('Failed to reject meeting');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meeting Requests</h1>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Pending: {meetings.filter(m => m.status === 'pending').length}
          </Badge>
        </div>

        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Parent Name</p>
                    <p className="font-medium">{meeting.parent_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{meeting.student_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{meeting.subject}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {format(new Date(meeting.meeting_date), 'PPP')} at {meeting.meeting_time}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{meeting.reason}</p>
                  </div>
                </div>

                {meeting.status === 'pending' && (
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => handleAction(meeting.id, 'accept')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleAction(meeting.id, 'reject')}
                      variant="destructive"
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={rejectionDialog.isOpen}
          onOpenChange={(open) => !open && setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Meeting Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionDialog.reason}
                onChange={(e) => setRejectionDialog({ ...rejectionDialog, reason: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionDialog.reason.trim()}
              >
                Reject Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}