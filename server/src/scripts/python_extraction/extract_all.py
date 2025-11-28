"""
Main Extraction Script - Complete UDCPR/Mumbai-DCPR Extraction Pipeline
"""
import json
import sys
from datetime import datetime
from pathlib import Path

from docx_parser import parse_udcpr, parse_mumbai_dcpr
from rule_classifier import classify_rules
from database_importer import DatabaseImporter
from config import OUTPUT_JSON, OUTPUT_EXCEL, LOG_FILE


class ExtractionPipeline:
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
        """Run complete extraction pipeline"""
        self.log("="*80)
        self.log("UDCPR/MUMBAI-DCPR COMPLETE EXTRACTION PIPELINE")
        self.log("="*80)
        
        try:
            # Step 1: Parse DOCX files
            self.log("\n📄 STEP 1: Parsing DOCX Files")
            self.log("-"*80)
            
            self.log("Parsing UDCPR...")
            udcpr_data = parse_udcpr()
            self.log(f"✅ UDCPR parsed: {udcpr_data['stats']['total_rules']} rules, {udcpr_data['stats']['total_tables']} tables")
            
            self.log("\nParsing Mumbai-DCPR...")
            mumbai_data = parse_mumbai_dcpr()
            self.log(f"✅ Mumbai-DCPR parsed: {mumbai_data['stats']['total_rules']} rules, {mumbai_data['stats']['total_tables']} tables")
            
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
            
            all_data = {
                'udcpr': {
                    'rules': udcpr_classified,
                    'tables': udcpr_data['tables'],
                    'annexures': udcpr_data['annexures'],
                    'stats': udcpr_data['stats']
                },
                'mumbai_dcpr': {
                    'rules': mumbai_classified,
                    'tables': mumbai_data['tables'],
                    'annexures': mumbai_data['annexures'],
                    'stats': mumbai_data['stats']
                },
                'extraction_metadata': {
                    'timestamp': datetime.now().isoformat(),
                    'total_rules': len(udcpr_classified) + len(mumbai_classified),
                    'total_tables': udcpr_data['stats']['total_tables'] + mumbai_data['stats']['total_tables']
                }
            }
            
            with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
                json.dump(all_data, f, indent=2, ensure_ascii=False)
            
            self.log(f"✅ Saved to {OUTPUT_JSON}")
            
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
            self.log(f"   Tables extracted: {udcpr_data['stats']['total_tables']}")
            
            self.log("\n📄 Mumbai-DCPR:")
            self.log(f"   Parsed rules: {mumbai_data['stats']['total_rules']}")
            self.log(f"   Classified rules: {len(mumbai_classified)}")
            self.log(f"   General rules imported: {mumbai_stats['general_rules']}")
            self.log(f"   District rules imported: {mumbai_stats['district_rules']}")
            self.log(f"   Tables extracted: {mumbai_data['stats']['total_tables']}")
            
            self.log("\n🗄️  DATABASE TOTALS:")
            self.log(f"   General rules: {final_stats['general_rules']}")
            self.log(f"   District rules: {final_stats['district_rules']}")
            self.log(f"   Total rules: {final_stats['total']}")
            
            # Calculate execution time
            execution_time = (datetime.now() - self.start_time).total_seconds()
            self.log(f"\n⏱️  Execution time: {execution_time:.2f} seconds")
            
            self.log("\n✅ EXTRACTION COMPLETE!")
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
        with open(LOG_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.log_messages))
        print(f"\n📝 Log saved to {LOG_FILE}")


def main():
    """Main entry point"""
    pipeline = ExtractionPipeline()
    success = pipeline.run()
    
    if success:
        print("\n🎉 All done! Your database is now populated with UDCPR and Mumbai-DCPR rules.")
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
