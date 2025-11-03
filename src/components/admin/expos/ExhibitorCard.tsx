import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Globe, CheckCircle } from 'lucide-react';
import type { Exhibitor } from '@/hooks/useExhibitors';
import { useState } from 'react';
import { useExhibitors } from '@/hooks/useExhibitors';

interface ExhibitorCardProps {
  exhibitor: Exhibitor;
}

export const ExhibitorCard = ({ exhibitor }: ExhibitorCardProps) => {
  const { deleteExhibitor } = useExhibitors();

  const handleDelete = () => {
    if (confirm(`Delete exhibitor "${exhibitor.org_name}"?`)) {
      deleteExhibitor(exhibitor.id);
    }
  };

  return (
    <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold line-clamp-2">{exhibitor.org_name}</h3>
            {exhibitor.is_verified && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {exhibitor.org_type && (
              <Badge variant="outline" className="text-xs">
                {exhibitor.org_type}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {(exhibitor.contact_name || exhibitor.contact_email || exhibitor.contact_phone) && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {exhibitor.contact_name && <p>{exhibitor.contact_name}</p>}
          {exhibitor.contact_email && <p className="text-xs">{exhibitor.contact_email}</p>}
          {exhibitor.contact_phone && <p className="text-xs">{exhibitor.contact_phone}</p>}
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
          onClick={handleDelete}
          className="text-destructive hover:text-destructive ml-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
