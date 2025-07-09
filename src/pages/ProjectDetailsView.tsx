import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip,
    ImageList,
    ImageListItem,
    Fab,
    IconButton,
    TextField,
    Link as MuiLink,
    Dialog,
    DialogTitle,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Add, CloudUpload, GitHub, Launch } from "@mui/icons-material";
import ProjectModel from "../core/models/ProjectModel";
import { useProjectListStore } from "../store/ProjectApiStore";
import { useParams, useNavigate } from "react-router-dom";
import { createEditProjectStore,EditProjectStore,useEditProjectStore } from "../store/EditProjectStroe";
import { useStore } from "zustand";

export default function ProjectDetailsPage() {
    const navigate = useNavigate();
      const { projectName: id } = useParams<{ projectName: string }>();
    const { getProject, deleteProject, updateProject, loading } = useProjectListStore();
    
    const [project, setProject] = useState<ProjectModel | undefined>(undefined);
    const [editStore, setEditStore] = useState<EditProjectStore | null>(null);
    
    // ✅ Use the custom hook - no more subscription issues!
    const editState = useEditProjectStore(editStore);  // For edit mode
    const [editMode, setEditMode] = useState(false);

    // Dialog for delete
    const [openDelete, setOpenDelete] = useState(false);

    // File refs
    const coverInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    // --- Sync project from store (once) ---
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (id && isMounted) {
                const result = await getProject(id);
                if (result && isMounted) {
                    setProject(result);
                    // Create edit store with initial project data
                    setEditStore(() => createEditProjectStore(result));
                }
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, [id, getProject]);

    // Render loading or not found states
    if (!project || !editState) {
        return loading ? (
            <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        ) : (
            <Box sx={{ mt: 10, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" color="error">Project Not Found</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <a href="#" onClick={() => navigate(-1)}>Go Back</a>
                </Typography>
            </Box>
        );
    }

    // --- Handlers ---
    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        editState.cancelEdit();
        setEditMode(false);
    };

    const handleSave = async () => {
        const { projectName, projectDescription, projectType, projectLink, projectGithub, keywords } = editState;

        const updatedProject = await updateProject({
            originalProjectName: project.projectName,
            project: {
                id: project.id,
                keywords: keywords || [],
                projectName,
                projectDescription,
                projectType: projectType || null,
                projectLink: projectLink || null,
                projectGithub: projectGithub || null,
            },
            coverImage: editState.projectCoverImage,
            screenshotFiles: editState.projectImages,
        });

        if (updatedProject) {
            setProject(updatedProject);
            // Recreate edit store with updated project data
            setEditStore(() => createEditProjectStore(updatedProject));
        }

        setEditMode(false);
    };

    // Remove screenshot image
    const handleRemoveScreenshot = (imgIndex: number) => {
        editState.removeScreenshot(imgIndex);
    };

    // Delete project dialog
    const handleDelete = () => setOpenDelete(true);
    const handleDeleteConfirm = async () => {
        await deleteProject(project.projectName);
        setOpenDelete(false);
        navigate("/");
    };
    const handleDeleteCancel = () => setOpenDelete(false);

    // Render helpers
    const getCoverUrl = (cover: string | File) =>
        typeof cover === "string" ? cover : URL.createObjectURL(cover);
    const getScreenshotUrl = (img: string | File) =>
        typeof img === "string" ? img : URL.createObjectURL(img);

    // --- Render Main UI ---
    return (
        <Box sx={{ maxWidth: 800, m: "auto", pt: 4, position: "relative" }}>
            <Card elevation={3}>
                {/* Cover */}
                <Box sx={{ position: "relative" }}>
                    {editMode ? (
                        <>
                            <CardMedia
                                component="img"
                                height={300}
                                src={getCoverUrl(editState.projectCoverImage)}
                                alt="Cover"
                                sx={{ objectFit: "cover" }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={coverInputRef}
                                style={{ display: "none" }}
                                onChange={editState.updateCoverImage}
                                disabled={!editMode}
                                data-testid="cover-upload"
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 16,
                                    left: 16,
                                    bgcolor: "rgba(255,255,255,0.75)",
                                    borderRadius: 2,
                                    px: 1,
                                    py: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    zIndex: 1,
                                }}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <CloudUpload fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">Change Cover</Typography>
                            </Box>
                        </>
                    ) : (
                        <CardMedia
                            component="img"
                            height={300}
                            image={editState.projectCoverImage as string}
                            alt={editState.projectName}
                            sx={{ objectFit: "cover" }}
                        />
                    )}

                    {/* Project TYPE */}
                    {editState.projectType && (
                        <Chip
                            label={editState.projectType}
                            sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                bgcolor: "primary.dark",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    )}
                </Box>

                <CardContent>
                    {/* Project Name */}
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                        {editMode ? (
                            <TextField
                                value={editState.projectName}
                                label="Project Name"
                                fullWidth
                                onChange={editState.updateField("projectName")}
                                size="small"
                            />
                        ) : (
                            editState.projectName
                        )}
                    </Typography>

                    {/* Description */}
                    <Box sx={{ mb: 2 }}>
                        {editMode ? (
                            <TextField
                                value={editState.projectDescription}
                                label="Description"
                                fullWidth
                                minRows={3}
                                multiline
                                onChange={editState.updateField("projectDescription")}
                            />
                        ) : (
                            <Typography color="text.secondary">{editState.projectDescription}</Typography>
                        )}
                    </Box>

                    {/* Keywords */}
                    {editState.keywords && editState.keywords.length > 0 && (
                        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {editState.keywords.map((keyword, idx) => (
                                <Chip
                                    key={idx}
                                    label={keyword}
                                    onDelete={editMode ? () => editState.deleteKeyword(idx) : undefined}
                                    size="small"
                                />
                            ))}
                            {editMode && (
                                <Chip
                                    label="+ Add"
                                    onClick={editState.addKeyword}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    )}

                    {/* Links */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                        {editMode ? (
                            <>
                                <TextField
                                    label="Live Demo URL"
                                    value={editState.projectLink || ""}
                                    onChange={editState.updateField("projectLink")}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="GitHub URL"
                                    value={editState.projectGithub || ""}
                                    onChange={editState.updateField("projectGithub")}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </>
                        ) : (
                            <>
                                <MuiLink
                                    href={editState.projectLink || undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "primary.main",
                                        opacity: editState.projectLink ? 1 : 0.3,
                                        cursor: editState.projectLink ? "pointer" : "not-allowed",
                                        ml: 0,
                                    }}
                                >
                                    <Launch sx={{ mr: 0.5 }} fontSize="small" />
                                    {editState.projectLink ? "Live Demo" : "No link"}
                                </MuiLink>
                                <MuiLink
                                    href={editState.projectGithub || undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "text.secondary",
                                        opacity: editState.projectGithub ? 1 : 0.3,
                                        cursor: editState.projectGithub ? "pointer" : "not-allowed",
                                        ml: 2,
                                    }}
                                >
                                    <GitHub sx={{ mr: 0.5 }} fontSize="small" />
                                    {editState.projectGithub ? "GitHub" : "No GitHub"}
                                </MuiLink>
                            </>
                        )}
                    </Box>

                    {/* Project Type */}
                    <Box sx={{ mb: 2 }}>
                        {editMode ? (
                            <TextField
                                label="Project Type"
                                fullWidth
                                value={editState.projectType || ""}
                                onChange={editState.updateField("projectType")}
                                size="small"
                            />
                        ) : editState.projectType ? (
                            <Typography color="text.secondary">
                                Type: {editState.projectType}
                            </Typography>
                        ) : null}
                    </Box>

                    {/* Screenshots */}
                    <Typography variant="h6" gutterBottom>
                        Screenshots
                    </Typography>
                    <ImageList cols={3} rowHeight={140} sx={{ width: "100%", mb: editMode ? 2 : 4 }}>
                        {editState.projectImages.map((img, idx) => (
                            <ImageListItem key={idx}>
                                <Box sx={{ position: "relative" }}>
                                    <img
                                        src={getScreenshotUrl(img)}
                                        alt={`Screenshot ${idx + 1}`}
                                        style={{ width: "100%", height: 140, objectFit: "cover" }}
                                    />
                                    {editMode && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                bgcolor: "rgba(255,255,255,0.8)",
                                                ":hover": { bgcolor: "error.main", color: "#fff" },
                                            }}
                                            onClick={() => handleRemoveScreenshot(idx)}
                                            aria-label="Delete screenshot"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </ImageListItem>
                        ))}
                        {editMode && (
                            <ImageListItem>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        width: "100%",
                                        height: 140,
                                        alignItems: "center",
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
                                        ref={imagesInputRef}
                                        style={{ display: "none" }}
                                        onChange={editState.updateImages}
                                    />
                                </Button>
                            </ImageListItem>
                        )}
                    </ImageList>
                </CardContent>
            </Card>

            {/* FAB */}
            <Fab
                color={editMode ? "secondary" : "primary"}
                sx={{
                    position: "fixed",
                    right: 32,
                    bottom: 32,
                    zIndex: 10,
                    boxShadow: 6,
                }}
                onClick={editMode ? handleCancel : handleEdit}
                aria-label={editMode ? "Cancel" : "Edit"}
            >
                {editMode ? <Cancel /> : <Edit />}
            </Fab>

            {/* Save/Delete action bar in edit mode */}
            {/* Save/Delete action bar in edit mode */}
            {editMode && (
                <Box
                    sx={{
                        maxWidth: 800,
                        m: "auto",
                        mt: 2,
                        p: 2,
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.97)",
                        borderTop: "1px solid #eee",
                        borderRadius: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Box>
            )}

            {/* Delete confirmation dialog */}
            <Dialog open={openDelete} onClose={handleDeleteCancel}>
                <DialogTitle>Delete this project?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button color="error" onClick={handleDeleteConfirm} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};