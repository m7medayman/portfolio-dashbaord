import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  Link,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';
import ProjectModel from '../../core/models/ProjectModel'; // Adjust import path as needed

interface ProjectCardProps {
  project: ProjectModel;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [coverImageError, setCoverImageError] = useState(false);

  // Parse project images string to array (assuming comma-separated or similar)
  const getProjectImages = (): string[] => {
    if (!project.projectImages) return [];
    // Adjust parsing logic based on your actual format
    return project.projectImages.split(',').slice(0, 4).map(img => img.trim());
  };

  const projectImages = getProjectImages();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* Cover Image */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <CardMedia
          component="img"
          image={coverImageError ? '/placeholder-image.jpg' : project.projectCoverImage}
          alt={project.projectName}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setCoverImageError(true);
            setImageLoading(false);
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoading ? 'none' : 'block',
          }}
        />
        
        {/* Project Type Chip */}
        {project.projectType && (
          <Chip
            label={project.projectType}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          />
        )}
      </Box>

      {/* Project Images Grid */}
      {projectImages.length > 0 && (
        <Box sx={{ p: 1 }}>
          <ImageList
            sx={{
              width: '100%',
              height: 'auto',
              margin: 0,
            }}
            cols={4}
            gap={4}
          >
            {projectImages.map((image, index) => (
              <ImageListItem key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%', // 1:1 Aspect Ratio for thumbnails
                    backgroundColor: 'grey.200',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={image}
                    alt={`${project.projectName} screenshot ${index + 1}`}
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-thumbnail.jpg';
                    }}
                  />
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.projectName}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.projectDescription}
        </Typography>

        {/* Action Links */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          {project.projectLink && (
            <IconButton
              component={Link}
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
              aria-label="View live project"
            >
              <Launch />
            </IconButton>
          )}
          {project.projectGithub && (
            <IconButton
              component={Link}
              href={project.projectGithub}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'grey.800',
                  color: 'white',
                },
              }}
              aria-label="View on GitHub"
            >
              <GitHub />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;