"""
Test Extraction - Test parsing without database import
"""
import json
from docx_parser import parse_udcpr, parse_mumbai_dcpr
from rule_classifier import classify_rules


def test_extraction():
    """Test extraction and show sample results"""
    print("\n" + "="*80)
    print("TESTING EXTRACTION (No Database Import)")
    print("="*80 + "\n")
    
    # Test UDCPR
    print("📄 Testing UDCPR Parsing...")
    print("-"*80)
    udcpr_data = parse_udcpr()
    
    print(f"\n✅ UDCPR Results:")
    print(f"   Total rules: {udcpr_data['stats']['total_rules']}")
    print(f"   Total tables: {udcpr_data['stats']['total_tables']}")
    print(f"   Total annexures: {udcpr_data['stats']['total_annexures']}")
    
    # Show sample rules
    if udcpr_data['rules']:
        print(f"\n📋 Sample UDCPR Rules (first 3):")
        for i, rule in enumerate(udcpr_data['rules'][:3], 1):
            print(f"\n   Rule {i}:")
            print(f"      Chapter: {rule.get('chapter', 'N/A')}")
            print(f"      Section: {rule.get('section', 'N/A')}")
            print(f"      Clause: {rule.get('clause', 'N/A')}")
            print(f"      Title: {rule.get('title', 'N/A')[:80]}...")
            print(f"      Text length: {len(rule.get('fullText', ''))} characters")
    
    # Test Mumbai-DCPR
    print("\n\n📄 Testing Mumbai-DCPR Parsing...")
    print("-"*80)
    mumbai_data = parse_mumbai_dcpr()
    
    print(f"\n✅ Mumbai-DCPR Results:")
    print(f"   Total rules: {mumbai_data['stats']['total_rules']}")
    print(f"   Total tables: {mumbai_data['stats']['total_tables']}")
    print(f"   Total annexures: {mumbai_data['stats']['total_annexures']}")
    
    # Show sample rules
    if mumbai_data['rules']:
        print(f"\n📋 Sample Mumbai-DCPR Rules (first 3):")
        for i, rule in enumerate(mumbai_data['rules'][:3], 1):
            print(f"\n   Rule {i}:")
            print(f"      Chapter: {rule.get('chapter', 'N/A')}")
            print(f"      Section: {rule.get('section', 'N/A')}")
            print(f"      Clause: {rule.get('clause', 'N/A')}")
            print(f"      Title: {rule.get('title', 'N/A')[:80]}...")
            print(f"      Text length: {len(rule.get('fullText', ''))} characters")
    
    # Test classification
    print("\n\n🏷️  Testing Classification...")
    print("-"*80)
    
    # Classify a few sample rules
    sample_rules = udcpr_data['rules'][:10] if udcpr_data['rules'] else []
    if sample_rules:
        classified = classify_rules(sample_rules)
        
        print(f"\n✅ Classification Results (first 3):")
        for i, rule in enumerate(classified[:3], 1):
            print(f"\n   Rule {i}:")
            print(f"      Category: {rule.get('category', 'N/A')}")
            print(f"      Subcategory: {rule.get('subcategory', 'N/A')}")
            print(f"      Zones: {', '.join(rule.get('applicableZones', [])) or 'None'}")
            print(f"      Districts: {', '.join(rule.get('applicableDistricts', [])) or 'General'}")
            print(f"      Tags: {', '.join(rule.get('tags', [])[:5])}")
            if rule.get('numericalData'):
                print(f"      Numerical Data: {rule['numericalData']}")
    
    # Summary
    print("\n\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"\n📊 Total Extraction:")
    print(f"   UDCPR rules: {udcpr_data['stats']['total_rules']}")
    print(f"   Mumbai-DCPR rules: {mumbai_data['stats']['total_rules']}")
    print(f"   Total rules: {udcpr_data['stats']['total_rules'] + mumbai_data['stats']['total_rules']}")
    print(f"   Total tables: {udcpr_data['stats']['total_tables'] + mumbai_data['stats']['total_tables']}")
    
    print("\n✅ Extraction test complete!")
    print("   If results look good, run: run_extraction.bat")
    print("   This will import everything to MongoDB.\n")
    
    # Save sample to file
    sample_output = {
        'udcpr_sample': udcpr_data['rules'][:5],
        'mumbai_sample': mumbai_data['rules'][:5],
        'stats': {
            'udcpr_total': udcpr_data['stats']['total_rules'],
            'mumbai_total': mumbai_data['stats']['total_rules'],
            'combined_total': udcpr_data['stats']['total_rules'] + mumbai_data['stats']['total_rules']
        }
    }
    
    with open('test_sample.json', 'w', encoding='utf-8') as f:
        json.dump(sample_output, f, indent=2, ensure_ascii=False)
    
    print("📝 Sample output saved to: test_sample.json\n")


if __name__ == '__main__':
    test_extraction()
