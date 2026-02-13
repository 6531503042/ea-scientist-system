import { UserManagementSkeleton } from './_components/UserManagementSkeleton';

export default function UsersLoading() {
    return (
        <div className="flex flex-col h-full">
            <UserManagementSkeleton activeTab="users" />
        </div>
    );
}
