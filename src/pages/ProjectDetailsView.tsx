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
import ProjectModel, { ProjectModelProps } from "../core/models/ProjectModel";
import { useProjectStore } from "../store/ProjectStore";
import { useParams, useNavigate } from "react-router-dom";

// Helpers
type EditableProject = Omit<ProjectModelProps, "projectImages" | "projectCoverImage"> & {
    projectImages: (string | File)[];
    projectCoverImage: string | File;
};

function getImageArray(images: string) {
    return images
        ? images.split(",").map(img => img.trim()).filter(Boolean)
        : [];
}

export default function ProjectDetailsPage() {
    const { projectName } = useParams<{ projectName: string }>();
    const navigate = useNavigate();
    // Zustand store selectors
    const { getProject, deleteProject, updateProject, loading } = useProjectStore();
    // Project state
    const [project, setProject] = useState<ProjectModel | undefined>(undefined);

    // For edit mode and form fields.
    const [editMode, setEditMode] = useState(false);
    const [editedProject, setEditedProject] = useState<EditableProject | null>(null);
    const pristineRef = useRef<EditableProject | null>(null);

    // Dialog for delete
    const [openDelete, setOpenDelete] = useState(false);
    // File refs
    const coverInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    // --- Sync project from store (once) ---
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (projectName && isMounted) {
                // Supports both sync and async getProject
                const result = await getProject(projectName);
                if (result && isMounted) setProject(result);
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, [projectName, getProject]);

    // --- Whenever project changes, reset editable state ---
    useEffect(() => {
        if (project) {
            const data: EditableProject = {
                id: project.id,
                projectName: project.projectName,
                projectCoverImage: project.projectCoverImage,
                projectImages: getImageArray(project.projectImages),
                projectDescription: project.projectDescription,
                projectType: project.projectType ?? "",
                projectLink: project.projectLink ?? "",
                projectGithub: project.projectGithub ?? "",
            };
            setEditedProject(data);
            pristineRef.current = data;
            setEditMode(false);
        }
    }, [project]);

    // Render loading or not found states
    if (!project) {
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
    if (!editedProject) return null; // Shouldn't happen

    // --- Handlers ---
    const handleEdit = () => {
        pristineRef.current = editedProject;
        setEditMode(true);
    };

    const handleCancel = () => {
        if (pristineRef.current) {
            setEditedProject(pristineRef.current);
        }
        setEditMode(false);
    };

    const handleSave = async () => {
        const { projectName, projectDescription, projectType, projectLink, projectGithub } = editedProject;

        await updateProject({
            originalProjectName: project.projectName,
            project: {
                id: project.id,
                projectName,
                projectDescription,
                projectType: projectType || null,
                projectLink: projectLink || null,
                projectGithub: projectGithub || null,
            },
            coverImage: editedProject.projectCoverImage,
            screenshotFiles: editedProject.projectImages,
        });

        setEditMode(false);
    };

    // Image change: Cover
    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEditedProject(old => old ? { ...old, projectCoverImage: e.target.files![0] } : old);
        }
    };
    // Add screenshot(s)
    const handleAddScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && editedProject) {
            setEditedProject(old => old
                ? ({ ...old, projectImages: [...old.projectImages, ...Array.from(e.target.files!)] })
                : old
            );
        }
    };
    // Remove screenshot image
    const handleRemoveScreenshot = (imgIndex: number) => {
        setEditedProject(old => old
            ? ({ ...old, projectImages: old.projectImages.filter((_, i) => i !== imgIndex) })
            : old
        );
    };
    // Delete project dialog
    const handleDelete = () => setOpenDelete(true);
    const handleDeleteConfirm = async () => {
        await deleteProject(project.projectName);
        setOpenDelete(false);
        navigate("/");
    };
    const handleDeleteCancel = () => setOpenDelete(false);

    // Editable text fields
    const handleTextEdit = (field: keyof EditableProject) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedProject(old => old ? { ...old, [field]: e.target.value } : old);
    };

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
                                src={getCoverUrl(editedProject.projectCoverImage)}
                                alt="Cover"
                                sx={{ objectFit: "cover" }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={coverInputRef}
                                style={{ display: "none" }}
                                onChange={handleCoverFileChange}
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
                            image={editedProject.projectCoverImage as string}
                            alt={editedProject.projectName}
                            sx={{ objectFit: "cover" }}
                        />
                    )}

                    {/* Project TYPE */}
                    {editedProject.projectType && (
                        <Chip
                            label={editedProject.projectType}
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
                                value={editedProject.projectName}
                                label="Project Name"
                                fullWidth
                                onChange={handleTextEdit("projectName")}
                                inputProps={{ maxLength: 100 }}
                                size="small"
                            />
                        ) : (
                            editedProject.projectName
                        )}
                    </Typography>

                    {/* Description */}
                    <Box sx={{ mb: 2 }}>
                        {editMode ? (
                            <TextField
                                value={editedProject.projectDescription}
                                label="Description"
                                fullWidth
                                minRows={3}
                                multiline
                                onChange={handleTextEdit("projectDescription")}
                            />
                        ) : (
                            <Typography color="text.secondary">{editedProject.projectDescription}</Typography>
                        )}
                    </Box>

                    {/* Links */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                        <MuiLink
                            href={editedProject.projectLink || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "primary.main",
                                opacity: editedProject.projectLink ? 1 : 0.3,
                                cursor: editedProject.projectLink ? "pointer" : "not-allowed",
                                ml: 0,
                            }}
                        >
                            <Launch sx={{ mr: 0.5 }} fontSize="small" />
                            {editedProject.projectLink ? "Live Demo" : "No link"}
                        </MuiLink>
                        <MuiLink
                            href={editedProject.projectGithub || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "text.secondary",
                                opacity: editedProject.projectGithub ? 1 : 0.3,
                                cursor: editedProject.projectGithub ? "pointer" : "not-allowed",
                                ml: 2,
                            }}
                        >
                            <GitHub sx={{ mr: 0.5 }} fontSize="small" />
                            {editedProject.projectGithub ? "GitHub" : "No GitHub"}
                        </MuiLink>
                    </Box>

                    {/* Project Type */}
                    <Box sx={{ mb: 2 }}>
                        {editMode ? (
                            <TextField
                                label="Project Type"
                                fullWidth
                                value={editedProject.projectType}
                                onChange={handleTextEdit("projectType")}
                                size="small"
                            />
                        ) : editedProject.projectType ? (
                            <Typography color="text.secondary">
                                Type: {editedProject.projectType}
                            </Typography>
                        ) : null}
                    </Box>

                    {/* Screenshots */}
                    <Typography variant="h6" gutterBottom>
                        Screenshots
                    </Typography>
                    <ImageList cols={3} rowHeight={140} sx={{ width: "100%", mb: editMode ? 2 : 4 }}>
                        {editedProject.projectImages.map((img, idx) => (
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
                                        onChange={handleAddScreenshots}
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
}