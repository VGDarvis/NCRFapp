export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BoothCSVRow {
  table_no: string;
  org_name: string;
  org_type: string;
  x_position?: string;
  y_position?: string;
  booth_width?: string;
  booth_depth?: string;
  zone?: string;
  sponsor_tier?: string;
  offers_on_spot_admission?: string;
  waives_application_fee?: string;
  scholarship_info?: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
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
  if (!row.table_no?.trim()) {
    errors.push('Table number is required');
  }
  if (!row.org_name?.trim()) {
    errors.push('Organization name is required');
  }
  if (!row.org_type?.trim()) {
    errors.push('Organization type is required');
  }

  // Validate org_type
  const validOrgTypes = ['university', 'community_college', 'hbcu', 'military', 'corporate', 'government', 'nonprofit', 'other'];
  if (row.org_type && !validOrgTypes.includes(row.org_type.toLowerCase())) {
    errors.push(`Invalid org_type. Must be one of: ${validOrgTypes.join(', ')}`);
  }

  // Validate sponsor_tier
  if (row.sponsor_tier) {
    const validTiers = ['platinum', 'gold', 'silver', 'bronze'];
    if (!validTiers.includes(row.sponsor_tier.toLowerCase())) {
      errors.push(`Invalid sponsor_tier. Must be one of: ${validTiers.join(', ')}`);
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
  if (row.booth_width && isNaN(Number(row.booth_width))) {
    errors.push('booth_width must be a number');
  }
  if (row.booth_depth && isNaN(Number(row.booth_depth))) {
    errors.push('booth_depth must be a number');
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
