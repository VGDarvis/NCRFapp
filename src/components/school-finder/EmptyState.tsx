import { Search } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full glass-premium flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {message}
      </h3>
      <p className="text-muted-foreground max-w-md">
        Try searching for schools by name, location, programs, or use natural language like "engineering schools in California"
      </p>
    </div>
  );
}
