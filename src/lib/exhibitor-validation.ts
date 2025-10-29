export interface ExhibitorCSVRow {
  confirmed: boolean;
  boothNumber: string;
  organizationName: string;
  paymentStatus: string;
  paid: boolean;
  welcomeLetterSent: boolean;
  applicationFeesWaived: boolean;
  scholarshipsOnSpot: boolean;
  acceptingOnSpot: boolean;
  specialBooth: boolean;
  programBookletAd: boolean;
  specialNotes: string;
  contactName: string;
  phone: string;
  email: string;
  repsName: string;
}

export function parseExhibitorCSV(row: any): ExhibitorCSVRow | null {
  // Skip empty rows or rows without organization name
  const orgName = row['HOUSTON\nNOVEMBER 1, 2025\n#OF BOOTHS'];
  if (!orgName || orgName.trim() === '') return null;

  return {
    confirmed: row['CONFIRMED'] === 'TRUE',
    boothNumber: row['BOOTH\nNUMBER'] || '',
    organizationName: orgName.trim(),
    paymentStatus: row['HOUSTON\nNOVEMBER 1, 2025\n#OF BOOTHS'] || '',
    paid: row['PAID'] === 'TRUE',
    welcomeLetterSent: row['WELCOME \nLETTER\nSENT'] === 'TRUE',
    applicationFeesWaived: row['APPLICATION \nFEES \nWAIVED'] === 'TRUE',
    scholarshipsOnSpot: row['SCHOLARSHIPS\nON THE\n SPOT'] === 'TRUE',
    acceptingOnSpot: row['ACCEPTING\nON THE\n SPOT'] === 'TRUE',
    specialBooth: row['SPECIAL \nBOOTH'] === 'TRUE',
    programBookletAd: row['PROGRAM\nBOOKLET\nAD'] === 'TRUE',
    specialNotes: row[' SPECIAL NOTES'] || '',
    contactName: row['CONTACT NAME'] || '',
    phone: row['PHONE'] || '',
    email: row['EMAIL'] || '',
    repsName: row['REPS NAME'] || '',
  };
}

export function detectOrgType(orgName: string): string {
  const name = orgName.toUpperCase();
  
  // HBCUs
  const hbcuNames = [
    'ALABAMA A&M', 'ALABAMA STATE', 'ALCORN STATE', 'BENEDICT',
    'CLAFLIN', 'CLARK ATLANTA', 'DELAWARE STATE', 'EDWARD WATERS',
    'FLORIDA A&M', 'FAMU', 'HARRIS-STOWE', 'HOWARD',
    'HUSTON TILLOTSON', 'JACKSON STATE', 'JOHNSON C. SMITH',
    'LEMOYNE OWEN', 'LIVINGSTONE', 'PAINE', 'PHILANDER SMITH',
    'SOUTH CAROLINA STATE', 'TALLADEGA', 'TEXAS SOUTHERN',
    'WILEY'
  ];
  
  if (hbcuNames.some(hbcu => name.includes(hbcu))) return 'hbcu';
  
  // Military
  if (name.includes('MILITARY') || name.includes('NAVAL') || 
      name.includes('COAST GUARD') || name.includes('ACADEMY')) {
    if (name.includes('NAVY') || name.includes('NAVAL') || 
        name.includes('COAST GUARD') || name.includes('VIRGINIA MILITARY')) {
      return 'military';
    }
  }
  
  // Universities and Colleges
  if (name.includes('UNIVERSITY') || name.includes('COLLEGE')) {
    return 'university';
  }
  
  // Corporate/Nonprofit
  if (name.includes('BANK') || name.includes('FOUNDATION') || 
      name.includes('FUND') || name.includes('ACADEMY') ||
      name.includes('UTILITIES') || name.includes('TRAVEL')) {
    return 'corporate';
  }
  
  // NCRF internal
  if (name.includes('NCRF')) return 'ncrf';
  
  return 'other';
}

export function getSponsorTier(paymentStatus: string, paid: boolean): string {
  if (!paid && paymentStatus !== 'PAID') return 'bronze';
  
  const status = paymentStatus.toUpperCase();
  if (status.includes('PLATINUM')) return 'platinum';
  if (status.includes('GOLD')) return 'gold';
  if (status.includes('SILVER')) return 'silver';
  
  return 'bronze';
}

export function validateExhibitorRow(row: ExhibitorCSVRow): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!row.organizationName || row.organizationName.trim() === '') {
    errors.push('Organization name is required');
  }
  
  if (row.email && !isValidEmail(row.email)) {
    errors.push('Invalid email format');
  }
  
  if (row.phone && !isValidPhone(row.phone)) {
    errors.push('Invalid phone format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /[\d\s\-\(\)]+/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
