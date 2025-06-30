import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Collapse,
  Box,
  Stack
} from "@mui/material";

type EditableCardTextProps = {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  label?: string;
};

const EditableCardText: React.FC<EditableCardTextProps> = ({
  value,
  onSave,
  label,
  placeholder = "Click to add text...",
}) => {
  const [isActive, setIsActive] = useState(false); // card clicked
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleCardClick = () => {
    if (!isEditing) setIsActive(!isActive);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setTemp(value);
  };

  const handleSave = () => {
    onSave(temp.trim());
    setIsEditing(false);
    setIsActive(false);
  };

  return (
   <Stack spacing={2}>
    <Typography variant="h6" >
        {label}
    </Typography>
     <Card
      variant="outlined"
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        padding: 2,
        borderRadius: 2,
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 0.2s ease-in-out',
      }}
    >
      <CardContent>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            variant="outlined"
          />
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {value || <span style={{ color: "#aaa" }}>{placeholder}</span>}
          </Typography>
        )}

        <Collapse in={isActive || isEditing} timeout="auto">
          <Box mt={2}>
            {isEditing ? (
              <Button onClick={handleSave} variant="contained" size="small">
                Save
              </Button>
            ) : (
              <Button onClick={handleEditToggle} variant="outlined" size="small">
                Edit
              </Button>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
   </Stack>
  );
};

export default EditableCardText;
