"""
Rule Classifier - Categorize and enrich extracted rules
"""
import re
from typing import List, Dict, Any
from config import CATEGORY_KEYWORDS, ZONE_TYPES, MAHARASHTRA_DISTRICTS


class RuleClassifier:
    def __init__(self):
        self.category_keywords = CATEGORY_KEYWORDS
        self.zone_types = ZONE_TYPES
        self.districts = MAHARASHTRA_DISTRICTS
    
    def classify_rule(self, rule: Dict[str, Any]) -> Dict[str, Any]:
        """Classify a single rule with category, zones, and tags"""
        text = f"{rule.get('title', '')} {rule.get('summary', '')} {rule.get('fullText', '')}".lower()
        
        # Determine category
        rule['category'] = self._determine_category(text)
        rule['subcategory'] = self._determine_subcategory(text, rule['category'])
        
        # Extract applicable zones
        rule['applicableZones'] = self._extract_zones(text)
        
        # Extract applicable districts
        rule['applicableDistricts'] = self._extract_districts(text)
        
        # Determine if general or district-specific
        rule['isGeneral'] = len(rule['applicableDistricts']) == 0
        
        # Generate tags
        rule['tags'] = self._generate_tags(rule)
        
        # Extract numerical values
        rule['numericalData'] = self._extract_numerical_data(text)
        
        return rule
    
    def _determine_category(self, text: str) -> str:
        """Determine primary category based on keywords"""
        scores = {}
        
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > 0:
                scores[category] = score
        
        if scores:
            return max(scores, key=scores.get)
        return 'General'
    
    def _determine_subcategory(self, text: str, category: str) -> str:
        """Determine subcategory based on category"""
        subcategories = {
            'FSI': ['base fsi', 'premium fsi', 'additional fsi', 'incentive fsi'],
            'Setback': ['front setback', 'rear setback', 'side setback', 'corner plot'],
            'Height': ['maximum height', 'minimum height', 'floor height', 'parapet'],
            'Parking': ['car parking', 'two-wheeler parking', 'visitor parking', 'mechanical parking'],
            'Heritage': ['grade i', 'grade ii', 'grade iii', 'conservation'],
        }
        
        if category in subcategories:
            for subcat in subcategories[category]:
                if subcat in text:
                    return subcat.title()
        
        return ''
    
    def _extract_zones(self, text: str) -> List[str]:
        """Extract applicable zone types"""
        zones = []
        
        for zone in self.zone_types:
            # Match zone with word boundaries
            pattern = r'\b' + re.escape(zone) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                zones.append(zone)
        
        # If no specific zones found, check for "all zones"
        if not zones and re.search(r'\ball\s+zones?\b', text, re.IGNORECASE):
            zones.append('All')
        
        return list(set(zones))  # Remove duplicates
    
    def _extract_districts(self, text: str) -> List[str]:
        """Extract applicable districts"""
        districts = []
        
        for district in self.districts:
            pattern = r'\b' + re.escape(district) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                districts.append(district)
        
        return list(set(districts))
    
    def _generate_tags(self, rule: Dict[str, Any]) -> List[str]:
        """Generate searchable tags"""
        tags = []
        
        # Add category as tag
        if rule.get('category'):
            tags.append(rule['category'])
        
        # Add subcategory as tag
        if rule.get('subcategory'):
            tags.append(rule['subcategory'])
        
        # Add zones as tags
        tags.extend(rule.get('applicableZones', []))
        
        # Add districts as tags
        tags.extend(rule.get('applicableDistricts', []))
        
        # Extract key terms from title
        title = rule.get('title', '')
        key_terms = re.findall(r'\b[A-Z][A-Za-z]{3,}\b', title)
        tags.extend(key_terms[:5])  # Limit to 5 key terms
        
        return list(set(tags))  # Remove duplicates
    
    def _extract_numerical_data(self, text: str) -> Dict[str, Any]:
        """Extract numerical values (FSI, setbacks, heights, etc.)"""
        data = {}
        
        # FSI values
        fsi_match = re.search(r'fsi[:\s]+(\d+\.?\d*)', text, re.IGNORECASE)
        if fsi_match:
            data['fsi'] = float(fsi_match.group(1))
        
        # Setback values (in meters)
        setback_patterns = {
            'front': r'front\s+setback[:\s]+(\d+\.?\d*)\s*m',
            'rear': r'rear\s+setback[:\s]+(\d+\.?\d*)\s*m',
            'side': r'side\s+setback[:\s]+(\d+\.?\d*)\s*m',
        }
        
        for key, pattern in setback_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                data[f'{key}_setback'] = float(match.group(1))
        
        # Height values
        height_match = re.search(r'height[:\s]+(\d+\.?\d*)\s*m', text, re.IGNORECASE)
        if height_match:
            data['height'] = float(height_match.group(1))
        
        # Parking requirements
        parking_match = re.search(r'(\d+)\s+(?:car\s+)?parking', text, re.IGNORECASE)
        if parking_match:
            data['parking_spaces'] = int(parking_match.group(1))
        
        return data


def classify_rules(rules: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Classify multiple rules"""
    classifier = RuleClassifier()
    
    print(f"\n{'='*80}")
    print("CLASSIFYING RULES")
    print(f"{'='*80}\n")
    print(f"Total rules to classify: {len(rules)}")
    
    classified_rules = []
    for i, rule in enumerate(rules, 1):
        classified_rule = classifier.classify_rule(rule)
        classified_rules.append(classified_rule)
        
        if i % 100 == 0:
            print(f"   Classified {i}/{len(rules)} rules...")
    
    print(f"\n✅ Classification complete!\n")
    
    # Print statistics
    categories = {}
    for rule in classified_rules:
        cat = rule.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print("Category Distribution:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"   {cat}: {count}")
    
    return classified_rules


if __name__ == '__main__':
    # Test with sample rule
    sample_rule = {
        'title': 'FSI for Residential Zone R-1',
        'summary': 'Base FSI of 1.0 for residential buildings in R-1 zone',
        'fullText': 'The base FSI for residential buildings in R-1 zone shall be 1.0. Additional FSI may be granted for affordable housing.'
    }
    
    classifier = RuleClassifier()
    result = classifier.classify_rule(sample_rule)
    
    print("\nSample Classification:")
    print(f"Category: {result['category']}")
    print(f"Zones: {result['applicableZones']}")
    print(f"Tags: {result['tags']}")
    print(f"Numerical Data: {result['numericalData']}")
