export default function AuditLoading() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-pulse">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-card rounded-xl border border-border">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded mt-2" />
          </div>
        ))}
      </div>
      <div className="h-40 bg-muted/30 rounded-xl" />
      <div className="h-64 bg-muted/30 rounded-xl" />
    </div>
  );
}
