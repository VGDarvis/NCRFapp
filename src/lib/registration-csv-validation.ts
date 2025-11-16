export interface RegistrationCSVRow {
  event_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  school_name?: string;
  grade_level?: string;
  graduation_year?: string;
  checked_in_at?: string; // ISO timestamp for historical check-ins
  status?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRegistrationRow(row: RegistrationCSVRow): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!row.event_id?.trim()) {
    errors.push('event_id is required');
  }

  if (!row.email?.trim()) {
    errors.push('email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push('email must be valid format');
  }

  if (!row.first_name?.trim()) {
    errors.push('first_name is required');
  }

  if (!row.last_name?.trim()) {
    errors.push('last_name is required');
  }

  // Validate phone format if provided
  if (row.phone && !/^[\d\s\-\+\(\)]+$/.test(row.phone)) {
    errors.push('phone must contain only numbers and common separators');
  }

  // Validate graduation_year if provided
  if (row.graduation_year) {
    const year = parseInt(row.graduation_year);
    if (isNaN(year) || year < 2000 || year > 2050) {
      errors.push('graduation_year must be between 2000 and 2050');
    }
  }

  // Validate checked_in_at timestamp if provided
  if (row.checked_in_at) {
    const timestamp = new Date(row.checked_in_at);
    if (isNaN(timestamp.getTime())) {
      errors.push('checked_in_at must be valid ISO timestamp (e.g., 2024-11-15T14:30:00Z)');
    }
  }

  // Validate status if provided
  if (row.status && !['confirmed', 'pending', 'cancelled'].includes(row.status.toLowerCase())) {
    errors.push('status must be one of: confirmed, pending, cancelled');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
