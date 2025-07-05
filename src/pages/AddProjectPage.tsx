// AddProjectPage.tsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  Box,
  IconButton,
  Paper,
  circularProgressClasses,
  CircularProgress
} from "@mui/material";
import { useProjectStore, ProjectAddPayload } from "../store/ProjectStore";
import ProjectModel from "../core/models/ProjectModel";
import DeleteIcon from "@mui/icons-material/Delete";

// Helper: Accepts File[] and returns an array of local preview URLs
function filesToPreviewUrls(files: File[]) {
  return files.map((file) => URL.createObjectURL(file));
}

const AddProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { addProject, loading } = useProjectStore();

  // Handle Cover Image Selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Handle Project Images (multiple) selection
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImages(files);
    setImagePreviews(filesToPreviewUrls(files));
  };

  const removeImage = (idx: number) => {
    const newFiles = images.filter((_, i) => i !== idx);
    setImages(newFiles);
    setImagePreviews(filesToPreviewUrls(newFiles));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you should upload images to your storage first and get URLs.
    // For demo, we use preview URLs, but in real-world, upload to get URLs!

    // Multiple images
    const projectImages = imagePreviews.join(","); // Store as comma-separated for your model

    const newProject = new ProjectModel({
      projectName,
      projectDescription,
      projectType,
      projectCoverImage: coverPreview || "", // Simulate cover image URL
      projectImages,
      projectLink,
      projectGithub,
      id: "",
    });

    await addProject({
      project: {
        id: "",
        projectName,
        projectDescription,
        projectType,
        projectLink,
        projectGithub,
        // ...any other fields (except cover/image which are passed separately)
      },
      coverImage: coverImage ?? "", // File object
      screenshotFiles: images, // Array of File objects
    });

    // Clean Form
    setProjectName("");
    setProjectDescription("");
    setProjectType("");
    setProjectLink("");
    setProjectGithub("");
    setCoverImage(null);
    setCoverPreview(null);
    setImages([]);
    setImagePreviews([]);
    alert("Project added!");
  };

  return (
    <Paper sx={{ maxWidth: 550, mx: "auto", p: 3, mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" mb={2}>Add New Project</Typography>
        <Stack spacing={2}>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Project Description"
            multiline
            minRows={3}
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Project Type"
            value={projectType}
            onChange={e => setProjectType(e.target.value)}
            fullWidth
          />
          <TextField
            label="Live Link"
            value={projectLink}
            onChange={e => setProjectLink(e.target.value)}
            fullWidth
          />
          <TextField
            label="GitHub Link"
            value={projectGithub}
            onChange={e => setProjectGithub(e.target.value)}
            fullWidth
          />

          {/* Cover Image */}
          <Box>
            <Typography variant="subtitle2">Cover Image</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              style={{ margin: "8px 0" }}
            />
            {coverPreview && (
              <Box mt={1}>
                <img
                  src={coverPreview}
                  alt="Project Cover"
                  width={120}
                  style={{ borderRadius: 8, border: "1px solid #eee" }}
                />
              </Box>
            )}
          </Box>

          {/* Multiple Project Images */}
          <Box>
            <Typography variant="subtitle2">Project Screenshots (multiple)</Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              style={{ margin: "8px 0" }}
            />
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              {imagePreviews.map((src, idx) => (
                <Box key={idx} sx={{ position: "relative", width: 75, height: 75 }}>
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    width={75}
                    height={75}
                    style={{
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #eee"
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "white",
                      boxShadow: 2
                    }}
                    onClick={() => removeImage(idx)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>

          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Project"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddProjectPage;