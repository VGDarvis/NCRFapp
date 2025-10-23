export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BoothCSVRow {
  booth_number: string;
  org_name: string;
  org_type: string;
  tier?: string;
  contact_email?: string;
  phone?: string;
  website?: string;
  x_position?: string;
  y_position?: string;
  offers_on_spot_admission?: string;
  waives_application_fee?: string;
  scholarship_info?: string;
}

export interface SeminarCSVRow {
  title: string;
  presenter_name: string;
  presenter_org?: string;
  start_time: string;
  end_time: string;
  room_name: string;
  description?: string;
  category?: string;
}

export function validateBoothRow(row: BoothCSVRow): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!row.booth_number?.trim()) {
    errors.push('Booth number is required');
  }
  if (!row.org_name?.trim()) {
    errors.push('Organization name is required');
  }
  if (!row.org_type?.trim()) {
    errors.push('Organization type is required');
  }

  // Validate org_type
  const validOrgTypes = ['university', 'community_college', 'hbcu', 'military', 'trade_school', 'scholarship_org', 'other'];
  if (row.org_type && !validOrgTypes.includes(row.org_type.toLowerCase())) {
    errors.push(`Invalid org_type. Must be one of: ${validOrgTypes.join(', ')}`);
  }

  // Validate tier
  if (row.tier) {
    const validTiers = ['platinum', 'gold', 'silver', 'bronze'];
    if (!validTiers.includes(row.tier.toLowerCase())) {
      errors.push(`Invalid tier. Must be one of: ${validTiers.join(', ')}`);
    }
  }

  // Validate email
  if (row.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.contact_email)) {
    errors.push('Invalid email format');
  }

  // Validate positions
  if (row.x_position && isNaN(Number(row.x_position))) {
    errors.push('x_position must be a number');
  }
  if (row.y_position && isNaN(Number(row.y_position))) {
    errors.push('y_position must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateSeminarRow(row: SeminarCSVRow): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!row.title?.trim()) {
    errors.push('Title is required');
  }
  if (!row.presenter_name?.trim()) {
    errors.push('Presenter name is required');
  }
  if (!row.start_time?.trim()) {
    errors.push('Start time is required');
  }
  if (!row.end_time?.trim()) {
    errors.push('End time is required');
  }
  if (!row.room_name?.trim()) {
    errors.push('Room name is required');
  }

  // Validate time format (HH:MM AM/PM or ISO format)
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  if (row.start_time && !timeRegex.test(row.start_time) && isNaN(Date.parse(row.start_time))) {
    errors.push('Invalid start_time format (use "10:00 AM" or ISO format)');
  }
  if (row.end_time && !timeRegex.test(row.end_time) && isNaN(Date.parse(row.end_time))) {
    errors.push('Invalid end_time format (use "11:00 AM" or ISO format)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
