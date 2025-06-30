import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useState } from "react";
import SkillModel from "../models/SkillModel";
import { useSkillStore } from "../../store/SkillsStore";
import { CloudinaryService } from "../services/cloudinaryServices";

type Props = {
  open: boolean;
  onClose: () => void;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AddSkillModal({ open, onClose }: Props) {
  const addSkill = useSkillStore((s) => s.addSkill);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(0);
  const [skillDescription, setSkillDescription] = useState("");
  const [skillImage, setSkillImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await CloudinaryService.uploadImage(file);
      setSkillImage(res.secureUrl);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!skillName || !skillImage) return alert("Name and image required");

    const newSkill = new SkillModel({
      skillName,
      skillImage,
      skillLevel,
      skillDescription,
    });

    await addSkill(newSkill);
    onClose(); // close modal
    reset();
  };

  const reset = () => {
    setSkillName("");
    setSkillImage("");
    setSkillLevel(0);
    setSkillDescription("");
    setUploading(false);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Add New Skill</Typography>
        <Stack spacing={2}>
          <TextField
            label="Skill Name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />
          <TextField
            label="Skill Level (0–100)"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={skillLevel}
            onChange={(e) => setSkillLevel(parseInt(e.target.value))}
          />
          <TextField
            label="Skill Description"
            multiline
            rows={3}
            value={skillDescription}
            onChange={(e) => setSkillDescription(e.target.value)}
          />

          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {uploading && <LinearProgress />}

          {skillImage && (
            <img
              src={skillImage}
              alt="Uploaded Skill"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={uploading}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
