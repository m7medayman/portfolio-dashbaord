// AddProjectPage.tsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  Box,
  IconButton,
  Paper,
  CircularProgress,
  ImageList,
  ImageListItem
} from "@mui/material";
import { useProjectListStore } from "../store/ProjectApiStore";
import ProjectModel from "../core/models/ProjectModel";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, CloudUpload } from "@mui/icons-material";
import { createEditProjectStore, useEditProjectStore } from "../store/EditProjectStroe";
import { useNavigate } from "react-router-dom";

const AddProjectPage: React.FC = () => {
  const { addProject, loading } = useProjectListStore();
  const navigate = useNavigate();

  // Create an empty project for the store
  const [editStore] = useState(() => {
    const emptyProject = new ProjectModel({
      id: "",
      projectName: "",
      projectDescription: "",
      projectType: "",
      projectLink: "",
      projectGithub: "",
      projectCoverImage: "",
      projectImages: "",
      keywords: []
    });
    return createEditProjectStore(emptyProject);
  });

  // Use the edit store
  const editState = useEditProjectStore(editStore);

  if (!editState) {
    return <CircularProgress />;
  }

  // Helper to get preview URLs
  const getCoverUrl = (cover: string | File) =>
    typeof cover === "string" ? cover : URL.createObjectURL(cover);

  const getScreenshotUrl = (img: string | File) =>
    typeof img === "string" ? img : URL.createObjectURL(img);

  const handleEnhanceProjectWithAi = async (

  ) => {
    const resp = await editState.enhanceProjectDescription(editState.projectDescription);
    console.log("the front project response is :", resp);

  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      projectName,
      projectDescription,
      projectType,
      projectLink,
      projectGithub,
      keywords,
      projectCoverImage,
      projectImages
    } = editState;

    // Validate required fields
    if (!projectName || !projectDescription) {
      alert("Please fill in required fields");
      return;
    }

    await addProject({
      project: {
        id: "",
        keywords: keywords || [],
        projectName,
        projectDescription,
        projectType: projectType || null,
        projectLink: projectLink || null,
        projectGithub: projectGithub || null,
      },
      coverImage: projectCoverImage as File | string,
      screenshotFiles: projectImages,
    });

    // Navigate to projects list or reset form
    navigate("/");
  };

  return (
    <Paper sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" mb={2}>Add New Project</Typography>
        <Stack spacing={3}>
          {/* Project Name */}
          <TextField
            label="Project Name"
            value={editState.projectName}
            onChange={editState.updateField("projectName")}
            fullWidth
            required
          />

          {/* Project Description */}
          <TextField
            label="Project Description"
            multiline
            minRows={3}
            value={editState.projectDescription}
            onChange={editState.updateField("projectDescription")}
            fullWidth
            required
          />
          <Button onClick={() => handleEnhanceProjectWithAi()}>
            Enhance Description
          </Button>

          {/* Project Type */}
          <TextField
            label="Project Type"
            value={editState.projectType || ""}
            onChange={editState.updateField("projectType")}
            fullWidth
          />

          {/* Keywords Section */}
          <Box>
            <Typography variant="subtitle2" mb={1}>Keywords</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {editState.keywords.map((keyword, idx) => (
                <Chip
                  key={idx}
                  label={keyword}
                  onDelete={() => editState.deleteKeyword(idx)}
                  size="small"
                />
              ))}
              <Chip
                label="+ Add"
                onClick={editState.addKeyword}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Links */}
          <TextField
            label="Live Demo URL"
            value={editState.projectLink || ""}
            onChange={editState.updateField("projectLink")}
            fullWidth
          />

          <TextField
            label="GitHub URL"
            value={editState.projectGithub || ""}
            onChange={editState.updateField("projectGithub")}
            fullWidth
          />

          {/* Cover Image */}
          <Box>
            <Typography variant="subtitle2" mb={1}>Cover Image</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
            >
              Upload Cover Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={editState.updateCoverImage}
              />
            </Button>

            {editState.projectCoverImage && (
              <Box mt={1}>
                <img
                  src={getCoverUrl(editState.projectCoverImage)}
                  alt="Project Cover"
                  style={{
                    maxWidth: 200,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #eee"
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Screenshots */}
          <Box>
            <Typography variant="subtitle2" mb={1}>Project Screenshots</Typography>
            <ImageList cols={4} rowHeight={120} sx={{ width: "100%", mb: 2 }}>
              {editState.projectImages.map((img, idx) => (
                <ImageListItem key={idx}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={getScreenshotUrl(img)}
                      alt={`Screenshot ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 4
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.8)",
                        ":hover": { bgcolor: "error.main", color: "#fff" },
                      }}
                      onClick={() => editState.removeScreenshot(idx)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ImageListItem>
              ))}

              {/* Add Image Button */}
              <ImageListItem>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    width: "100%",
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    border: "2px dashed #c8c8c8",
                  }}
                  startIcon={<Add />}
                >
                  Add
                  <input
                    accept="image/*"
                    type="file"
                    multiple
                    hidden
                    onChange={editState.updateImages}
                  />
                </Button>
              </ImageListItem>
            </ImageList>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Project"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddProjectPage;