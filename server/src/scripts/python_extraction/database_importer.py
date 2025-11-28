"""
Database Importer - Import extracted and classified rules into MongoDB
"""
from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Any
import json
from config import MONGODB_URI


class DatabaseImporter:
    def __init__(self, mongodb_uri: str = MONGODB_URI):
        self.client = MongoClient(mongodb_uri)
        self.db = self.client.get_database()
        self.rules_collection = self.db['rules']
        self.district_rules_collection = self.db['districtrules']
        
    def import_rules(self, rules: List[Dict[str, Any]], source: str = 'UDCPR') -> Dict[str, int]:
        """Import rules into appropriate collections"""
        print(f"\n{'='*80}")
        print(f"IMPORTING RULES TO DATABASE - Source: {source}")
        print(f"{'='*80}\n")
        
        stats = {
            'total': len(rules),
            'general_rules': 0,
            'district_rules': 0,
            'skipped': 0,
            'errors': 0
        }
        
        for i, rule in enumerate(rules, 1):
            try:
                # Prepare rule for database
                prepared_rule = self._prepare_rule(rule, source)
                
                # Determine if general or district-specific
                if rule.get('isGeneral', True):
                    self._insert_general_rule(prepared_rule)
                    stats['general_rules'] += 1
                else:
                    self._insert_district_rule(prepared_rule)
                    stats['district_rules'] += 1
                
                if i % 100 == 0:
                    print(f"   Imported {i}/{len(rules)} rules...")
                    
            except Exception as e:
                print(f"   ⚠️ Error importing rule {i}: {str(e)}")
                stats['errors'] += 1
        
        print(f"\n✅ Import complete!\n")
        print("Statistics:")
        print(f"   Total rules: {stats['total']}")
        print(f"   General rules: {stats['general_rules']}")
        print(f"   District rules: {stats['district_rules']}")
        print(f"   Errors: {stats['errors']}")
        
        return stats
    
    def _prepare_rule(self, rule: Dict[str, Any], source: str) -> Dict[str, Any]:
        """Prepare rule for database insertion"""
        prepared = {
            'chapter': rule.get('chapter', 'Unknown'),
            'section': rule.get('section', ''),
            'clause': rule.get('clause', ''),
            'reference': rule.get('reference', ''),
            'title': rule.get('title', ''),
            'summary': rule.get('summary', '')[:500],  # Limit summary length
            'fullText': rule.get('fullText', ''),
            'category': rule.get('category', 'General'),
            'subcategory': rule.get('subcategory', ''),
            'applicableZones': rule.get('applicableZones', []),
            'applicableDistricts': rule.get('applicableDistricts', []),
            'isGeneral': rule.get('isGeneral', True),
            'tags': rule.get('tags', []),
            'status': 'Active',
            'effectiveDate': datetime(2020, 1, 1),
            'createdAt': datetime.now(),
            'updatedAt': datetime.now(),
            'source': source,
            'numericalData': rule.get('numericalData', {})
        }
        
        return prepared
    
    def _insert_general_rule(self, rule: Dict[str, Any]):
        """Insert into general rules collection"""
        # Check if rule already exists
        existing = self.rules_collection.find_one({'reference': rule['reference']})
        
        if existing:
            # Update existing rule
            self.rules_collection.update_one(
                {'reference': rule['reference']},
                {'$set': rule}
            )
        else:
            # Insert new rule
            self.rules_collection.insert_one(rule)
    
    def _insert_district_rule(self, rule: Dict[str, Any]):
        """Insert into district rules collection"""
        # For district-specific rules, create separate entries for each district
        districts = rule.get('applicableDistricts', [])
        
        for district in districts:
            district_rule = rule.copy()
            district_rule['district'] = district
            district_rule['region'] = self._get_region(district)
            
            # Check if rule already exists
            existing = self.district_rules_collection.find_one({
                'reference': rule['reference'],
                'district': district
            })
            
            if existing:
                # Update existing rule
                self.district_rules_collection.update_one(
                    {'reference': rule['reference'], 'district': district},
                    {'$set': district_rule}
                )
            else:
                # Insert new rule
                self.district_rules_collection.insert_one(district_rule)
    
    def _get_region(self, district: str) -> str:
        """Get region for a district"""
        regions = {
            'Konkan': ['Mumbai', 'Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg'],
            'Pune': ['Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur'],
            'Nashik': ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon'],
            'Aurangabad': ['Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli'],
            'Nagpur': ['Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli'],
            'Amravati': ['Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim']
        }
        
        for region, districts in regions.items():
            if district in districts:
                return region
        
        return 'Unknown'
    
    def get_import_stats(self) -> Dict[str, int]:
        """Get current database statistics"""
        return {
            'general_rules': self.rules_collection.count_documents({}),
            'district_rules': self.district_rules_collection.count_documents({}),
            'total': self.rules_collection.count_documents({}) + self.district_rules_collection.count_documents({})
        }
    
    def close(self):
        """Close database connection"""
        self.client.close()


if __name__ == '__main__':
    # Test connection
    importer = DatabaseImporter()
    stats = importer.get_import_stats()
    
    print("\nCurrent Database Stats:")
    print(f"  General Rules: {stats['general_rules']}")
    print(f"  District Rules: {stats['district_rules']}")
    print(f"  Total: {stats['total']}")
    
    importer.close()
