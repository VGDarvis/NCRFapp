import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, Globe, CheckCircle } from 'lucide-react';
import type { Booth } from '@/hooks/useBooths';
import { useState } from 'react';
import { BoothEditDialog } from './BoothEditDialog';
import { useExhibitors } from '@/hooks/useExhibitors';

interface ExhibitorCardProps {
  exhibitor: Booth;
}

export const ExhibitorCard = ({ exhibitor }: ExhibitorCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { deleteExhibitor } = useExhibitors(exhibitor.event_id, {});

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'platinum': return 'bg-slate-400 text-slate-900';
      case 'gold': return 'bg-yellow-500 text-yellow-950';
      case 'silver': return 'bg-slate-300 text-slate-900';
      case 'bronze': return 'bg-amber-700 text-amber-50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete exhibitor "${exhibitor.org_name}"?`)) {
      deleteExhibitor(exhibitor.id);
    }
  };

  return (
    <>
      <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">{exhibitor.org_name}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {exhibitor.org_type && (
                <Badge variant="outline" className="text-xs">
                  {exhibitor.org_type}
                </Badge>
              )}
              {exhibitor.sponsor_tier && (
                <Badge className={getTierColor(exhibitor.sponsor_tier)}>
                  {exhibitor.sponsor_tier}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {exhibitor.table_no && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Booth {exhibitor.table_no}</span>
          </div>
        )}

        <div className="space-y-1">
          {exhibitor.offers_on_spot_admission && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>On-Spot Admission</span>
            </div>
          )}
          {exhibitor.waives_application_fee && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-4 h-4" />
              <span>Fee Waiver</span>
            </div>
          )}
          {exhibitor.scholarship_info && (
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <CheckCircle className="w-4 h-4" />
              <span>Scholarships</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          {exhibitor.website_url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(exhibitor.website_url!, '_blank')}
            >
              <Globe className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <BoothEditDialog
        booth={exhibitor}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onBoothUpdated={() => setIsEditOpen(false)}
      />
    </>
  );
};
