import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/tables - Get all tables
router.get('/', async (req, res) => {
  try {
    const tablesPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
    
    // Check if the complete tables file exists
    if (fs.existsSync(tablesPath)) {
      const tablesData = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
      res.json(tablesData);
    } else {
      // Fallback to the original tables file
      const fallbackPath = path.join(__dirname, '../data/extracted/all_tables.json');
      if (fs.existsSync(fallbackPath)) {
        const tablesData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        res.json(tablesData);
      } else {
        // Return sample data if no files exist
        res.json({
          udcpr: [
            {
              number: '3A',
              title: 'Internal Roads for Residential Development',
              type: 'Road/Infrastructure Table',
              source: 'UDCPR',
              content: 'Table showing minimum width requirements for internal roads in residential layouts based on length of road. Essential for subdivision planning and layout approval.\n\nSr. No. | Length of Internal Road (m.) | Width of Internal Road (m.)\n1 | Up to 150 | 6.0\n2 | 150 to 300 | 7.5\n3 | 300 to 500 | 9.0\n4 | Above 500 | 12.0'
            },
            {
              number: '6A',
              title: 'FSI by Road Width for Municipal Corporations',
              type: 'FSI Table',
              source: 'UDCPR',
              content: 'Comprehensive FSI table showing Basic FSI, Premium FSI on payment, Maximum TDR loading, and Maximum building potential based on road width categories.\n\nRoad Width | Basic FSI | Premium FSI | Max TDR | Max Building Potential\nBelow 9.0m | 1.50 | -- | -- | 1.50\n9.0m to 18.0m | 2.00 | 0.30 | 0.30 | 2.60\n18.0m to 30.0m | 2.00 | 0.30 | 0.50 | 2.80\n30.0m and above | 2.00 | 0.30 | 0.70 | 3.00'
            },
            {
              number: '6B',
              title: 'Front Marginal Distances/Setback',
              type: 'Setback Table',
              source: 'UDCPR',
              content: 'Front setback requirements for residential buildings and mixed-use buildings based on road width categories.\n\nRoad Width | Residential Building | Mixed-use Building\nLess than 4.5m | 2.25m from center | 2.25m + 1.50m from center\n4.5m to 6.0m | NIL | 1.50m\n6.0m to 12.0m | 1.00m | 2.00m\n12.0m and above | 2.00m | 2.50m'
            },
            {
              number: '6C',
              title: 'Side and Rear Marginal Distances',
              type: 'Setback Table',
              source: 'UDCPR',
              content: 'Side and rear setback requirements based on plot area categories for congested areas.\n\nPlot Area | Side Margin | Rear Margin\nUp to 1000 sq.m. | 0.00m | 0.00m\nAbove 1000 & up to 4000 sq.m. | 1.00m | 1.00m\nAbove 4000 sq.m. | 1.50m | 1.50m'
            },
            {
              number: '7A',
              title: 'Higher FSI Categories',
              type: 'FSI Table',
              source: 'UDCPR',
              content: 'Special FSI provisions for higher categories with premium calculations and conditions for various development types and special zones.'
            }
          ],
          mumbai: [
            {
              number: 'M1',
              title: 'Mumbai FSI Rates',
              type: 'FSI Table',
              source: 'Mumbai',
              content: 'Mumbai-specific FSI rates and calculations for different zones within Greater Mumbai area.'
            },
            {
              number: 'M2',
              title: 'Mumbai Parking Requirements',
              type: 'Parking Table',
              source: 'Mumbai',
              content: 'Parking requirements specific to Mumbai Municipal Corporation area with ECS calculations.'
            }
          ],
          metadata: {
            totalTables: 7,
            extractionDate: new Date().toISOString()
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// GET /api/tables/:number - Get specific table by number
router.get('/:number', async (req, res) => {
  try {
    const tableNumber = req.params.number;
    const tablesPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
    
    if (fs.existsSync(tablesPath)) {
      const tablesData = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
      const allTables = [...tablesData.udcpr, ...tablesData.mumbai];
      const table = allTables.find(t => t.number === tableNumber);
      
      if (table) {
        res.json(table);
      } else {
        res.status(404).json({ error: 'Table not found' });
      }
    } else {
      res.status(404).json({ error: 'Tables data not available' });
    }
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ error: 'Failed to fetch table' });
  }
});

// GET /api/tables/search/:query - Search tables
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const tablesPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
    
    if (fs.existsSync(tablesPath)) {
      const tablesData = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
      const allTables = [...tablesData.udcpr, ...tablesData.mumbai];
      
      const matchingTables = allTables.filter(table => 
        table.number.toLowerCase().includes(query) ||
        table.title.toLowerCase().includes(query) ||
        table.content.toLowerCase().includes(query) ||
        table.type.toLowerCase().includes(query)
      );
      
      res.json({
        query: req.params.query,
        results: matchingTables,
        count: matchingTables.length
      });
    } else {
      res.status(404).json({ error: 'Tables data not available' });
    }
  } catch (error) {
    console.error('Error searching tables:', error);
    res.status(500).json({ error: 'Failed to search tables' });
  }
});

export default router;
