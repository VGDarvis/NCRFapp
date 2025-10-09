-- Phase 2: County Mapping & Statistical Intelligence
-- Create counties table for mapping counties to their cities

CREATE TABLE IF NOT EXISTS public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  cities TEXT[] NOT NULL DEFAULT '{}',
  population INTEGER,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for fast lookups
CREATE INDEX idx_counties_name ON public.counties(county_name);
CREATE INDEX idx_counties_state ON public.counties(state_code);
CREATE INDEX idx_counties_cities ON public.counties USING GIN(cities);
CREATE INDEX idx_counties_lookup ON public.counties(county_name, state_code);

-- Enable RLS
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Everyone can view counties"
  ON public.counties FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage counties"
  ON public.counties FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add county column to school_database
ALTER TABLE public.school_database
ADD COLUMN IF NOT EXISTS county TEXT;

-- Create index for county searches
CREATE INDEX IF NOT EXISTS idx_school_database_county ON public.school_database(county);

-- Seed major US counties data
INSERT INTO public.counties (county_name, state_code, state_name, cities, population) VALUES
  ('Los Angeles County', 'CA', 'California', 
   ARRAY['Los Angeles', 'Long Beach', 'Glendale', 'Santa Clarita', 'Lancaster', 'Palmdale', 
         'Pomona', 'Torrance', 'Pasadena', 'El Monte', 'Downey', 'Inglewood', 'West Covina',
         'Norwalk', 'Burbank', 'Compton', 'Carson', 'Santa Monica', 'Whittier', 'Hawthorne',
         'Alhambra', 'Lakewood', 'Bellflower', 'Baldwin Park', 'Gardena', 'Montebello',
         'Monterey Park', 'Rosemead', 'Redondo Beach', 'South Gate', 'Pico Rivera', 'Huntington Park',
         'Paramount', 'Arcadia', 'Culver City', 'Manhattan Beach', 'Azusa', 'Diamond Bar',
         'La Mirada', 'San Fernando', 'Duarte', 'Monrovia', 'La Puente', 'Lawndale',
         'Lynwood', 'South Pasadena', 'San Marino', 'Temple City', 'La Cañada Flintridge',
         'Hermosa Beach', 'Palos Verdes Estates', 'Rancho Palos Verdes', 'Rolling Hills',
         'Signal Hill', 'Cudahy', 'Maywood', 'Vernon', 'Commerce', 'Bell', 'Bell Gardens',
         'South El Monte', 'El Segundo', 'Westlake Village', 'Agoura Hills',
         'Calabasas', 'Hidden Hills', 'Malibu', 'Claremont', 'La Verne', 'San Dimas',
         'Glendora', 'Covina', 'West Hollywood', 'Beverly Hills', 'Cerritos', 'Artesia',
         'Hawaiian Gardens', 'Lomita', 'Walnut', 'Industry', 'Irwindale', 'Bradbury'], 10014009),
  
  ('Cook County', 'IL', 'Illinois',
   ARRAY['Chicago', 'Evanston', 'Skokie', 'Oak Park', 'Berwyn', 'Oak Lawn', 'Cicero', 
         'Palatine', 'Schaumburg', 'Des Plaines', 'Mount Prospect', 'Hoffman Estates',
         'Glenview', 'Buffalo Grove', 'Wheeling', 'Northbrook', 'Arlington Heights',
         'Park Ridge', 'Wilmette', 'Niles', 'Morton Grove', 'Lincolnwood', 'Rosemont',
         'Elk Grove Village', 'Rolling Meadows', 'Streamwood', 'Hanover Park'], 5275541),
  
  ('Harris County', 'TX', 'Texas',
   ARRAY['Houston', 'Pasadena', 'Baytown', 'Pearland', 'League City', 'Bellaire', 
         'Deer Park', 'Humble', 'Katy', 'Missouri City', 'Sugar Land', 'Friendswood',
         'La Porte', 'Seabrook', 'South Houston', 'Stafford', 'Webster', 'Jacinto City',
         'West University Place', 'Bunker Hill Village', 'Piney Point Village', 'Hedwig Village',
         'Hilshire Village', 'Hunters Creek Village', 'Spring Valley Village', 'Southside Place',
         'Tomball', 'Jersey Village', 'El Lago', 'Nassau Bay', 'Taylor Lake Village'], 4731145),
  
  ('Maricopa County', 'AZ', 'Arizona',
   ARRAY['Phoenix', 'Mesa', 'Chandler', 'Glendale', 'Scottsdale', 'Tempe', 'Peoria',
         'Surprise', 'Gilbert', 'Avondale', 'Goodyear', 'Buckeye', 'El Mirage', 'Fountain Hills',
         'Guadalupe', 'Litchfield Park', 'Paradise Valley', 'Queen Creek', 'Tolleson',
         'Wickenburg', 'Youngtown', 'Cave Creek', 'Carefree'], 4485414),
  
  ('San Diego County', 'CA', 'California',
   ARRAY['San Diego', 'Chula Vista', 'Oceanside', 'Escondido', 'Carlsbad', 'El Cajon',
         'Vista', 'San Marcos', 'Encinitas', 'National City', 'La Mesa', 'Santee', 'Poway',
         'Coronado', 'Imperial Beach', 'Lemon Grove', 'Solana Beach', 'Del Mar'], 3298634),
  
  ('Orange County', 'CA', 'California',
   ARRAY['Anaheim', 'Santa Ana', 'Irvine', 'Huntington Beach', 'Garden Grove', 'Fullerton',
         'Costa Mesa', 'Mission Viejo', 'Westminster', 'Newport Beach', 'Buena Park', 'Lake Forest',
         'Tustin', 'Yorba Linda', 'San Clemente', 'Laguna Niguel', 'La Habra', 'Fountain Valley',
         'Placentia', 'Rancho Santa Margarita', 'Aliso Viejo', 'Brea', 'Stanton', 'Cypress',
         'Dana Point', 'Laguna Beach', 'Laguna Hills', 'Laguna Woods', 'La Palma', 'Los Alamitos',
         'San Juan Capistrano', 'Seal Beach', 'Villa Park'], 3186989),
  
  ('Miami-Dade County', 'FL', 'Florida',
   ARRAY['Miami', 'Hialeah', 'Miami Gardens', 'Miami Beach', 'Homestead', 'North Miami',
         'Coral Gables', 'Doral', 'Cutler Bay', 'Miami Lakes', 'Aventura', 'Palmetto Bay',
         'Pinecrest', 'North Miami Beach', 'South Miami', 'Florida City', 'Key Biscayne',
         'Opa-locka', 'Miami Springs', 'Surfside', 'Bal Harbour', 'Bay Harbor Islands',
         'Biscayne Park', 'El Portal', 'Golden Beach', 'Indian Creek', 'Medley', 'Sweetwater',
         'Virginia Gardens', 'West Miami'], 2701767),
  
  ('Dallas County', 'TX', 'Texas',
   ARRAY['Dallas', 'Irving', 'Garland', 'Grand Prairie', 'Mesquite', 'Carrollton',
         'Richardson', 'Rowlett', 'DeSoto', 'Cedar Hill', 'Duncanville', 'Farmers Branch',
         'University Park', 'Highland Park', 'Lancaster', 'Sachse', 'Seagoville', 'Balch Springs',
         'Hutchins', 'Wilmer', 'Glenn Heights', 'Addison', 'Cockrell Hill', 'Sunnyvale'], 2613539),
  
  ('Riverside County', 'CA', 'California',
   ARRAY['Riverside', 'Moreno Valley', 'Corona', 'Murrieta', 'Temecula', 'Menifee', 'Indio',
         'Lake Elsinore', 'Eastvale', 'Cathedral City', 'Palm Desert', 'Hemet', 'Perris',
         'Jurupa Valley', 'Palm Springs', 'San Jacinto', 'La Quinta', 'Beaumont', 'Wildomar',
         'Banning', 'Coachella', 'Desert Hot Springs', 'Norco', 'Canyon Lake', 'Calimesa'], 2470546),
  
  ('San Bernardino County', 'CA', 'California',
   ARRAY['San Bernardino', 'Fontana', 'Rancho Cucamonga', 'Ontario', 'Victorville', 'Hesperia',
         'Chino', 'Chino Hills', 'Upland', 'Rialto', 'Yucaipa', 'Redlands', 'Apple Valley',
         'Highland', 'Colton', 'Montclair', 'Adelanto', 'Grand Terrace', 'Loma Linda',
         'Barstow', 'Twentynine Palms', 'Needles', 'Big Bear Lake'], 2180085),
  
  ('Tarrant County', 'TX', 'Texas',
   ARRAY['Fort Worth', 'Arlington', 'Grand Prairie', 'Mansfield', 'Euless', 'Bedford',
         'Grapevine', 'Hurst', 'North Richland Hills', 'Southlake', 'Colleyville', 'Keller',
         'Haltom City', 'Watauga', 'Saginaw', 'Burleson', 'Benbrook', 'Crowley', 'Forest Hill',
         'Richland Hills', 'Azle', 'Lake Worth', 'River Oaks', 'Sansom Park', 'White Settlement',
         'Everman', 'Kennedale', 'Lakeside', 'Pantego', 'Westlake', 'Westover Hills'], 2110640),
  
  ('Bexar County', 'TX', 'Texas',
   ARRAY['San Antonio', 'Live Oak', 'Universal City', 'Schertz', 'Converse', 'Kirby',
         'Windcrest', 'Balcones Heights', 'Castle Hills', 'China Grove', 'Alamo Heights',
         'Terrell Hills', 'Olmos Park', 'Shavano Park', 'Hill Country Village', 'Hollywood Park'], 2009324),
  
  ('Broward County', 'FL', 'Florida',
   ARRAY['Fort Lauderdale', 'Pembroke Pines', 'Hollywood', 'Miramar', 'Coral Springs',
         'Pompano Beach', 'Davie', 'Plantation', 'Sunrise', 'Deerfield Beach', 'Weston',
         'Tamarac', 'Lauderhill', 'Margate', 'Coconut Creek', 'North Lauderdale', 'Oakland Park',
         'Hallandale Beach', 'Cooper City', 'Parkland', 'Wilton Manors', 'Lighthouse Point',
         'Lauderdale Lakes', 'Lauderdale-by-the-Sea', 'Dania Beach', 'Hillsboro Beach',
         'Sea Ranch Lakes', 'Lazy Lake'], 1944375),
  
  ('Clark County', 'NV', 'Nevada',
   ARRAY['Las Vegas', 'Henderson', 'North Las Vegas', 'Boulder City', 'Mesquite'], 2265461),
  
  ('Wayne County', 'MI', 'Michigan',
   ARRAY['Detroit', 'Livonia', 'Westland', 'Dearborn', 'Taylor', 'Dearborn Heights',
         'Southfield', 'Canton', 'Warren', 'Redford', 'Troy', 'Farmington Hills', 'Sterling Heights',
         'Lincoln Park', 'Garden City', 'Wyandotte', 'Inkster', 'Allen Park', 'Romulus',
         'Melvindale', 'Riverview', 'Grosse Pointe Woods', 'Grosse Pointe', 'Harper Woods',
         'Ecorse', 'River Rouge', 'Highland Park', 'Hamtramck'], 1793561),
  
  ('Santa Clara County', 'CA', 'California',
   ARRAY['San Jose', 'Sunnyvale', 'Santa Clara', 'Mountain View', 'Milpitas', 'Palo Alto',
         'Cupertino', 'Gilroy', 'Morgan Hill', 'Campbell', 'Los Gatos', 'Saratoga',
         'Los Altos', 'Monte Sereno'], 1936259),
  
  ('Alameda County', 'CA', 'California',
   ARRAY['Oakland', 'Fremont', 'Hayward', 'Berkeley', 'San Leandro', 'Livermore', 'Alameda',
         'Pleasanton', 'Union City', 'Newark', 'Dublin', 'San Lorenzo', 'Castro Valley',
         'Ashland', 'Cherryland', 'Emeryville', 'Piedmont', 'Albany'], 1682353);