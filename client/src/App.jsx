import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RuleLibrary from './pages/RuleLibrary';
import Calculator from './pages/Calculator';
import ComplianceCheck from './pages/ComplianceCheck';
import AIAssistant from './pages/AIAssistant';
import ZoneFinder from './pages/ZoneFinder';
import Projects from './pages/Projects';
import DistrictRules from './pages/DistrictRules';
import TableViewer from './pages/TableViewer';
import RegulationBrowser from './pages/RegulationBrowser';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rules" element={<RuleLibrary />} />
            <Route path="/district-rules" element={<DistrictRules />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/compliance" element={<ComplianceCheck />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/zone-finder" element={<ZoneFinder />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tables" element={<TableViewer />} />
            <Route path="/regulations" element={<RegulationBrowser />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
