export function generateWebsiteURL(orgName: string): string {
  const name = orgName.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
  
  // Known patterns for universities
  const patterns: Record<string, string> = {
    'alabama a&m university': 'https://www.aamu.edu',
    'alabama state university': 'https://www.alasu.edu',
    'alcorn state university': 'https://www.alcorn.edu',
    'benedict college': 'https://www.benedict.edu',
    'california state university fullerton': 'https://www.fullerton.edu',
    'california state university sacramento': 'https://www.csus.edu',
    'claflin university': 'https://www.claflin.edu',
    'clark atlanta university': 'https://www.cau.edu',
    'columbia college chicago': 'https://www.colum.edu',
    'concordia university texas': 'https://www.concordia.edu',
    'delaware state university': 'https://www.desu.edu',
    'edward waters university': 'https://www.ewc.edu',
    'florida a&m university': 'https://www.famu.edu',
    'harris-stowe state university': 'https://www.hssu.edu',
    'howard university': 'https://www.howard.edu',
    'huston tillotson university': 'https://www.htu.edu',
    'jackson state university': 'https://www.jsums.edu',
    'johnson c. smith university': 'https://www.jcsu.edu',
    'lemoyne owen college': 'https://www.loc.edu',
    'liberty university': 'https://www.liberty.edu',
    'livingstone college': 'https://www.livingstone.edu',
    'long island university': 'https://www.liu.edu',
    'paine college': 'https://www.paine.edu',
    'philander smith university': 'https://www.philander.edu',
    'san diego state university': 'https://www.sdsu.edu',
    'south carolina state university': 'https://www.scsu.edu',
    'stanford university': 'https://www.stanford.edu',
    'talladega college': 'https://www.talladega.edu',
    'texas southern university': 'https://www.tsu.edu',
    'university of houston': 'https://www.uh.edu',
    'university of washington bothell': 'https://www.uwb.edu',
    'virginia military institute': 'https://www.vmi.edu',
    'wiley university': 'https://www.wileyc.edu',
  };
  
  // Check for direct match
  const directMatch = Object.keys(patterns).find(key => 
    name.includes(key) || key.includes(name)
  );
  if (directMatch) return patterns[directMatch];
  
  // Military academies
  if (name.includes('coast guard')) return 'https://www.uscg.mil';
  if (name.includes('naval academy')) return 'https://www.usna.edu';
  
  // Fallback: generate URL from name
  const cleanName = name
    .replace(/university|college|state|of|the/gi, '')
    .trim()
    .split(' ')[0];
  
  return `https://www.${cleanName}.edu`;
}

export function getLogoURL(orgName: string): string | null {
  // For now, return null - logos can be fetched via Clearbit or other services
  // This would be enhanced with actual logo fetching logic
  return null;
}
