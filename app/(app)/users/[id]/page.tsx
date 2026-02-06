'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { UserRound } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

export default function UserDetailPage() {
    const { id } = useParams();
    const { users } = useUsers();

    // In a real app, we would fetch a single user by ID here.
    // For mock data, we just find it.
    const user = users.find(u => u._id === id);

    if (!user) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-destructive">User Not Found</h1>
                <p>ID: {id}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title={`User: ${user.displayName || user.username}`}
                description="View user details"
                icon={<UserRound />}
            />

            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium capitalize">{typeof user.role === 'string' ? user.role : user.role.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{user.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
