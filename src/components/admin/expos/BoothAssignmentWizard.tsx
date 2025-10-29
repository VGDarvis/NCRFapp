import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Grid3x3 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useExhibitors } from '@/hooks/useExhibitors';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const BoothAssignmentWizard = () => {
  const [selectedExhibitor, setSelectedExhibitor] = useState<string | null>(null);
  const [boothNumber, setBoothNumber] = useState('');
  const { events } = useEvents();

  const houstonEvent = events?.find(e => 
    e.event_type === 'college_fair' && 
    e.start_at && new Date(e.start_at) > new Date()
  );

  const { exhibitors, updateExhibitor } = useExhibitors(houstonEvent?.id || null, {
    unassignedOnly: true,
  });

  const handleAssign = (exhibitorId: string) => {
    if (!boothNumber) {
      toast.error('Please enter a booth number');
      return;
    }

    updateExhibitor({
      id: exhibitorId,
      updates: { table_no: boothNumber },
    });

    setBoothNumber('');
    setSelectedExhibitor(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Grid3x3 className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold">Booth Assignment Wizard</h3>
            <p className="text-sm text-muted-foreground">
              Assign booth numbers to unassigned exhibitors
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {exhibitors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              All exhibitors have been assigned booth numbers
            </div>
          ) : (
            exhibitors.map(exhibitor => (
              <Card key={exhibitor.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{exhibitor.org_name}</h4>
                    <div className="flex gap-2 mt-2">
                      {exhibitor.org_type && (
                        <Badge variant="outline">{exhibitor.org_type}</Badge>
                      )}
                      {exhibitor.offers_on_spot_admission && (
                        <Badge variant="secondary">On-Spot</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Booth #"
                      value={selectedExhibitor === exhibitor.id ? boothNumber : ''}
                      onChange={(e) => {
                        setSelectedExhibitor(exhibitor.id);
                        setBoothNumber(e.target.value);
                      }}
                      className="w-24"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAssign(exhibitor.id)}
                      disabled={selectedExhibitor !== exhibitor.id || !boothNumber}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Assign
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
