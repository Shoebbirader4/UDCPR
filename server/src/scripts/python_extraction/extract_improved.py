"""
Improved Extraction Script - Extract ALL content from DOCX files
"""
import json
import sys
from datetime import datetime
from pathlib import Path

from improved_parser import parse_udcpr_improved, parse_mumbai_dcpr_improved
from rule_classifier import classify_rules
from database_importer import DatabaseImporter
from config import OUTPUT_JSON, OUTPUT_DIR, LOG_FILE


class ImprovedExtractionPipeline:
    def __init__(self):
        self.log_messages = []
        self.start_time = datetime.now()
        
    def log(self, message: str, level: str = 'INFO'):
        """Log message to console and file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        self.log_messages.append(log_entry)
    
    def run(self):
        """Run improved extraction pipeline"""
        self.log("="*80)
        self.log("IMPROVED UDCPR/MUMBAI-DCPR EXTRACTION PIPELINE")
        self.log("Extracting ALL content from DOCX files")
        self.log("="*80)
        
        try:
            # Step 1: Parse DOCX files with improved parser
            self.log("\n📄 STEP 1: Parsing DOCX Files (Improved Method)")
            self.log("-"*80)
            
            self.log("Parsing UDCPR (this may take a few minutes)...")
            udcpr_data = parse_udcpr_improved()
            self.log(f"✅ UDCPR parsed: {udcpr_data['stats']['total_rules']} rules")
            
            self.log("\nParsing Mumbai-DCPR (this may take a few minutes)...")
            mumbai_data = parse_mumbai_dcpr_improved()
            self.log(f"✅ Mumbai-DCPR parsed: {mumbai_data['stats']['total_rules']} rules")
            
            total_rules = udcpr_data['stats']['total_rules'] + mumbai_data['stats']['total_rules']
            self.log(f"\n📊 Total rules extracted: {total_rules}")
            
            # Step 2: Classify rules
            self.log("\n🏷️  STEP 2: Classifying Rules")
            self.log("-"*80)
            
            self.log("Classifying UDCPR rules...")
            udcpr_classified = classify_rules(udcpr_data['rules'])
            
            self.log("\nClassifying Mumbai-DCPR rules...")
            mumbai_classified = classify_rules(mumbai_data['rules'])
            
            # Step 3: Save to JSON (backup)
            self.log("\n💾 STEP 3: Saving to JSON")
            self.log("-"*80)
            
            output_file = OUTPUT_DIR / 'extracted_rules_improved.json'
            all_data = {
                'udcpr': {
                    'rules': udcpr_classified,
                    'stats': udcpr_data['stats']
                },
                'mumbai_dcpr': {
                    'rules': mumbai_classified,
                    'stats': mumbai_data['stats']
                },
                'extraction_metadata': {
                    'timestamp': datetime.now().isoformat(),
                    'total_rules': len(udcpr_classified) + len(mumbai_classified),
                    'method': 'improved_parser'
                }
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(all_data, f, indent=2, ensure_ascii=False)
            
            self.log(f"✅ Saved to {output_file}")
            
            # Step 4: Import to MongoDB
            self.log("\n🗄️  STEP 4: Importing to MongoDB")
            self.log("-"*80)
            
            importer = DatabaseImporter()
            
            self.log("Importing UDCPR rules...")
            udcpr_stats = importer.import_rules(udcpr_classified, source='UDCPR')
            
            self.log("\nImporting Mumbai-DCPR rules...")
            mumbai_stats = importer.import_rules(mumbai_classified, source='Mumbai-DCPR')
            
            # Get final database stats
            final_stats = importer.get_import_stats()
            importer.close()
            
            # Step 5: Generate summary
            self.log("\n📊 STEP 5: Extraction Summary")
            self.log("="*80)
            
            self.log("\n📄 UDCPR:")
            self.log(f"   Parsed rules: {udcpr_data['stats']['total_rules']}")
            self.log(f"   Classified rules: {len(udcpr_classified)}")
            self.log(f"   General rules imported: {udcpr_stats['general_rules']}")
            self.log(f"   District rules imported: {udcpr_stats['district_rules']}")
            
            self.log("\n📄 Mumbai-DCPR:")
            self.log(f"   Parsed rules: {mumbai_data['stats']['total_rules']}")
            self.log(f"   Classified rules: {len(mumbai_classified)}")
            self.log(f"   General rules imported: {mumbai_stats['general_rules']}")
            self.log(f"   District rules imported: {mumbai_stats['district_rules']}")
            
            self.log("\n🗄️  DATABASE TOTALS:")
            self.log(f"   General rules: {final_stats['general_rules']}")
            self.log(f"   District rules: {final_stats['district_rules']}")
            self.log(f"   Total rules: {final_stats['total']}")
            
            # Calculate execution time
            execution_time = (datetime.now() - self.start_time).total_seconds()
            self.log(f"\n⏱️  Execution time: {execution_time:.2f} seconds")
            
            self.log("\n✅ IMPROVED EXTRACTION COMPLETE!")
            self.log("="*80)
            
            # Save log file
            self._save_log()
            
            return True
            
        except Exception as e:
            self.log(f"\n❌ ERROR: {str(e)}", level='ERROR')
            self.log(f"Exception type: {type(e).__name__}", level='ERROR')
            import traceback
            self.log(f"Traceback:\n{traceback.format_exc()}", level='ERROR')
            self._save_log()
            return False
    
    def _save_log(self):
        """Save log to file"""
        log_file = OUTPUT_DIR / 'extraction_log_improved.txt'
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.log_messages))
        print(f"\n📝 Log saved to {log_file}")


def main():
    """Main entry point"""
    pipeline = ImprovedExtractionPipeline()
    success = pipeline.run()
    
    if success:
        print("\n🎉 All done! Your database is now populated with ALL UDCPR and Mumbai-DCPR content.")
        print("\n💡 Next steps:")
        print("   1. Verify the data in MongoDB")
        print("   2. Test the API endpoints")
        print("   3. Check the frontend search functionality")
        sys.exit(0)
    else:
        print("\n❌ Extraction failed. Check the log file for details.")
        sys.exit(1)


if __name__ == '__main__':
    main()
