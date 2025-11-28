"""
Configuration for UDCPR/Mumbai-DCPR Extraction
"""
import os
import re
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent.parent
DATA_DIR = BASE_DIR / 'data'
OUTPUT_DIR = DATA_DIR / 'extracted'

# Input files
UDCPR_DOCX = DATA_DIR / 'UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.docx'
MUMBAI_DCPR_DOCX = DATA_DIR / 'MUBAI-DCPR.docx'

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/udcpr-master')

# Extraction patterns
CHAPTER_PATTERNS = [
    r'^CHAPTER\s+([IVX\d]+)[:\s\-]+(.+?)$',
    r'^Chapter\s+([IVX\d]+)[:\s\-]+(.+?)$',
    r'^([IVX\d]+)\.\s+(.+?)$'
]

SECTION_PATTERNS = [
    r'^SECTION\s+([IVX\d]+)[:\s\-]+(.+?)$',
    r'^Section\s+([IVX\d]+)[:\s\-]+(.+?)$',
    r'^(\d+)\.\s+(.+?)$'
]

CLAUSE_PATTERNS = [
    r'^(\d+\.\d+(?:\.\d+)?)\s+(.+?)$',
    r'^Rule\s+(\d+\.\d+(?:\.\d+)?)[:\s\-]+(.+?)$',
    r'^Regulation\s+(\d+\.\d+(?:\.\d+)?)[:\s\-]+(.+?)$'
]

# Categories mapping
CATEGORY_KEYWORDS = {
    'FSI': ['floor space index', 'fsi', 'floor area ratio', 'far', 'built-up area', 'bua'],
    'Setback': ['setback', 'margin', 'open space', 'front yard', 'rear yard', 'side yard'],
    'Height': ['height', 'storey', 'floor', 'elevation', 'vertical'],
    'Parking': ['parking', 'vehicle', 'car', 'two-wheeler', 'basement parking'],
    'Heritage': ['heritage', 'conservation', 'listed building', 'protected monument'],
    'TDR': ['tdr', 'transferable development rights', 'development rights'],
    'Amenity': ['amenity', 'recreation', 'playground', 'garden', 'open space'],
    'Environmental': ['environment', 'pollution', 'waste', 'drainage', 'sewage'],
    'Safety': ['safety', 'fire', 'emergency', 'evacuation', 'exit'],
    'Accessibility': ['accessibility', 'disabled', 'ramp', 'lift', 'elevator'],
    'CRZ': ['crz', 'coastal', 'beach', 'shoreline', 'tidal'],
    'TOD': ['tod', 'transit oriented', 'metro', 'railway station'],
    'Affordable Housing': ['affordable', 'ews', 'lig', 'economically weaker', 'low income'],
    'Mixed Use': ['mixed use', 'mixed-use', 'commercial residential'],
    'Special Buildings': ['special building', 'assembly', 'institutional', 'educational'],
    'Land Use': ['land use', 'zoning', 'zone', 'residential', 'commercial', 'industrial'],
    'Zoning': ['zone', 'zoning', 'land use zone'],
    'Infrastructure': ['infrastructure', 'road', 'water supply', 'electricity'],
    'Social Infrastructure': ['school', 'hospital', 'dispensary', 'community hall'],
    'Redevelopment': ['redevelopment', 'reconstruction', 'rehabilitation', 'slum'],
    'Regularization': ['regularization', 'unauthorized', 'illegal construction'],
    'Building Requirements': ['building requirement', 'construction', 'structural'],
    'Structural': ['structural', 'foundation', 'column', 'beam', 'slab'],
    'Fire Safety': ['fire', 'fire safety', 'fire fighting', 'sprinkler'],
    'Procedures': ['procedure', 'application', 'approval', 'permission', 'noc'],
    'Penalties': ['penalty', 'fine', 'violation', 'contravention'],
    'General': ['general', 'definition', 'interpretation', 'scope']
}

# Zone types
ZONE_TYPES = [
    'R1', 'R2', 'R3', 'R4', 'R-1', 'R-2', 'R-3', 'R-4',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
    'C-1', 'C-2', 'C-3', 'C-4', 'C-5', 'C-6', 'C-7', 'C-8',
    'I1', 'I2', 'I3', 'I-1', 'I-2', 'I-3',
    'M1', 'M2', 'M3', 'M-1', 'M-2', 'M-3',
    'Mixed', 'Special', 'All'
]

# Maharashtra districts
MAHARASHTRA_DISTRICTS = [
    'Mumbai', 'Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg',
    'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur',
    'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon',
    'Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli',
    'Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli',
    'Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim'
]

# Output settings
OUTPUT_JSON = OUTPUT_DIR / 'extracted_rules.json'
OUTPUT_EXCEL = OUTPUT_DIR / 'extracted_rules.xlsx'
LOG_FILE = OUTPUT_DIR / 'extraction_log.txt'

# Create output directory if it doesn't exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
