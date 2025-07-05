import React, { useEffect } from 'react';
import {
    Container,
    Fab,
    Typography,
    Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../core/component/ProjectCard';
import { useProjectStore } from '../store/ProjectStore';

function ProjectCardTestPage() {
    const navigate = useNavigate();
    const { projects, fetchProjects } = useProjectStore();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return (
        <Container sx={{ py: 4 }}>
            {projects.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary">
                        No projects available.
                    </Typography>
                </Box>
            ) : (
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={3}
                >
                    {projects.map((project) => (
                        <Box
                            key={project.projectLink}
                            flexBasis={{
                                xs: '100%', // full width on extra-small
                                sm: '47%',  // two per row on small
                                md: '30%',  // three per row on medium+
                            }}
                            flexGrow={1}
                        >
                            <ProjectCard project={project} />
                        </Box>
                    ))}
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1100,
                }}
                onClick={() => navigate('/add_project')}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
}

export default ProjectCardTestPage;
