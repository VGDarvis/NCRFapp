import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw } from 'lucide-react';
import { useExhibitors } from '@/hooks/useExhibitors';
import { generateWebsiteURL } from '@/lib/website-finder-utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export const WebsiteMapIntegration = () => {
  const { exhibitors, updateExhibitor } = useExhibitors();

  const exhibitorsWithoutWebsite = exhibitors.filter(e => !e.website_url);
  const exhibitorsWithWebsite = exhibitors.filter(e => e.website_url);

  const handleAutoFindWebsites = () => {
    let updated = 0;
    exhibitorsWithoutWebsite.forEach(exhibitor => {
      const url = generateWebsiteURL(exhibitor.org_name);
      updateExhibitor({
        id: exhibitor.id,
        updates: { website_url: url },
      });
      updated++;
    });

    toast.success(`Generated ${updated} website URLs`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Website Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {exhibitorsWithWebsite.length} of {exhibitors.length} exhibitors have website URLs
            </p>

            <Button onClick={handleAutoFindWebsites} disabled={exhibitorsWithoutWebsite.length === 0}>
              <Globe className="w-4 h-4 mr-2" />
              Auto-Generate Websites ({exhibitorsWithoutWebsite.length})
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Exhibitors Without Websites</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {exhibitorsWithoutWebsite.length === 0 ? (
            <p className="text-sm text-muted-foreground">All exhibitors have website URLs</p>
          ) : (
            exhibitorsWithoutWebsite.map(exhibitor => (
              <div key={exhibitor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{exhibitor.org_name}</span>
                <Badge variant="outline">{exhibitor.org_type}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
