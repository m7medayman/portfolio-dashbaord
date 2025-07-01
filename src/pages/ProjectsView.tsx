import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ProjectCard from '../core/component/ProjectCard'; // Adjust path as
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add'; // or any icon you like
import { useNavigate } from "react-router-dom";


// Create a mock ProjectModel matching expected props
const mockProject = {
    projectName: 'AI Weather Assistant',
    projectDescription: `An AI-powered assistant that provides real-time weather forecasts, alerts, and personalized travel/weather recommendations.
This project utilizes React, Node.js, and OpenAI APIs to deliver accurate and engaging weather reports.`,
    projectType: 'Web App',
    projectCoverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    projectImages: [
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    ].join(','),
    projectLink: 'https://your-weather-app-demo.com',
    projectGithub: 'https://github.com/youruser/weather-assistant'
    // Add additional fields as needed
};
const ProjectArr = Array(10).fill(mockProject);

function ProjectCardTestPage() {
    const navigate = useNavigate();
    return (

        <Container sx={{ py: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                {ProjectArr.map((project, index) => (

                    <ProjectCard project={project} />

                ))}
            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1100,
                }}
                onClick={() => {
                    navigate("/add_project");
                    // or navigate, open modal, etc.
                }}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
}

export default ProjectCardTestPage;