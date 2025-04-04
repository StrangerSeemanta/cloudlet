import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReactNode } from "react";

export function AlertDestructive({
  children,
}: {
  children: ReactNode | string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
