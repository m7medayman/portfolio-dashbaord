import React, { useState, MouseEvent } from 'react';
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
import ProjectModel from '../../core/models/ProjectModel';

interface ProjectCardProps {
  project: ProjectModel;
  onClick?: ((project: ProjectModel) => void) | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [coverImageError, setCoverImageError] = useState(false);

  const getProjectImages = (): string[] => {
    if (!project.projectImages) return [];
    return project.projectImages.split(',').slice(0, 4).map(img => img.trim());
  };
  const projectImages = getProjectImages();

  const handleCardClick = () => {
    if (onClick) onClick(project);
  };

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...(onClick && {
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme => theme.shadows[8],
          }
        })
      }}
      onClick={onClick ? handleCardClick : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {/* Cover Image */}
      <Box sx={{ position: 'relative', aspectRatio: '16 / 9', width: '100%' }}>
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
                    width: '100%',
                    aspectRatio: '1 / 1',
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

        {/* Links */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          {project.projectLink?.trim() && (
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
              onClick={stopPropagation}
            >
              <Launch />
            </IconButton>
          )}
          {project.projectGithub?.trim() && (
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
              onClick={stopPropagation}
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