import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FolderOpen } from 'lucide-react';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    location: '',
    plotArea: '',
    userId: 'demo-user-id' // Replace with actual auth
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects', { params: { userId: 'demo-user-id' } });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/projects', newProject);
      setShowForm(false);
      setNewProject({ projectName: '', location: '', plotArea: '', userId: 'demo-user-id' });
      loadProjects();
    } catch (error) {
      alert('Failed to create project: ' + error.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>My Projects</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#06b6d4', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Create New Project</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <input 
              type="text"
              placeholder="Project Name"
              value={newProject.projectName}
              onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
            />
            <input 
              type="text"
              placeholder="Location"
              value={newProject.location}
              onChange={(e) => setNewProject({...newProject, location: e.target.value})}
            />
            <input 
              type="number"
              placeholder="Plot Area (sq.m)"
              value={newProject.plotArea}
              onChange={(e) => setNewProject({...newProject, plotArea: e.target.value})}
            />
            <button onClick={handleCreate} style={{ background: '#10b981', color: 'white' }}>
              Create Project
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {projects.map((project) => (
          <div key={project._id} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <FolderOpen size={32} color="#06b6d4" />
              <div style={{ flex: 1 }}>
                <h3>{project.projectName}</h3>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  {project.location} • {project.plotArea} sq.m
                </p>
              </div>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '12px',
                background: project.complianceStatus === 'pass' ? '#d1fae5' : '#fee2e2',
                color: project.complianceStatus === 'pass' ? '#065f46' : '#991b1b'
              }}>
                {project.complianceStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
