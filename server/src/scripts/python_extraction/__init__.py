"""
UDCPR/Mumbai-DCPR Python Extraction System

Complete extraction pipeline for parsing DOCX files and importing to MongoDB.

Usage:
    python extract_all.py       # Full extraction with database import
    python test_extraction.py   # Test extraction without database import

Modules:
    - docx_parser: Parse DOCX files and extract structure
    - rule_classifier: Classify and categorize rules
    - database_importer: Import to MongoDB
    - config: Configuration and patterns
"""

__version__ = '1.0.0'
__author__ = 'UDCPR Master Team'
