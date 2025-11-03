import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const BoothAssignmentWizard = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Alert>
          <InfoIcon className="w-4 h-4" />
          <AlertDescription>
            The Booth Assignment Wizard has been reorganized. Use the <strong>Booth List Editor</strong> tab in the Expo Management module to assign booth numbers and positions to exhibitors for specific events.
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
};
