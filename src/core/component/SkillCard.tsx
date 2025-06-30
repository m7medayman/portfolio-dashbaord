import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Slider,
  Box,
  Stack,
} from "@mui/material";
import { SkillModelType } from "../models/SkillModel"; // adjust path if needed

type SkillCardProps = {
  skill: SkillModelType;
  onSave: (updated: SkillModelType) => void;
  onDelete: (skillName: string) => void;
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, onSave ,onDelete}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkill, setEditedSkill] = useState<SkillModelType>(skill);


  const handleSave = () => {
    onSave(editedSkill);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(editedSkill.skillName);
  };

  return (
    <Card sx={{ maxWidth: 300, mx: "auto", my: 2, p: 2, borderRadius: 3, boxShadow: 2 }}>
      <CardMedia
        component="img"
        src={editedSkill.skillImage}
        alt={editedSkill.skillName}
        sx={{ height: 180, borderRadius: 2, objectFit: "contain" }}
      />
      <CardContent>
        <Stack spacing={2}>
          {isEditing ? (
            <>
              <TextField
                label="Skill Name"
                value={editedSkill.skillName}
                onChange={(e) =>
                  setEditedSkill({ ...editedSkill, skillName: e.target.value })
                }
              />
              <TextField
                label="Image URL"
                value={editedSkill.skillImage}
                onChange={(e) =>
                  setEditedSkill({ ...editedSkill, skillImage: e.target.value })
                }
              />
              <Box>
                <Typography gutterBottom>Skill Level: {editedSkill.skillLevel}%</Typography>
                <Slider
                  value={editedSkill.skillLevel}
                  onChange={(_, value) =>
                    setEditedSkill({ ...editedSkill, skillLevel: value as number })
                  }
                  step={1}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Box>
              <TextField
                label="Skill Description"
                multiline
                minRows={3}
                fullWidth
                value={editedSkill.skillDescription}
                onChange={(e) =>
                  setEditedSkill({ ...editedSkill, skillDescription: e.target.value })
                }
              />
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" onClick={handleDelete} color="error">
                Delete
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5">{skill.skillName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Level: {skill.skillLevel}%
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                {skill.skillDescription || "No description"}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditedSkill(skill);
                  setIsEditing(true);
                }}
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillCard;
