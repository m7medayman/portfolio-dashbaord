import {
  Avatar,
  Badge,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useRef, useState } from "react";
import AddSkillModal from "./AddSkillModal";

type Props = {
  image: string;
  onImageChange: (file: File) => Promise<void> | void; // supports async
};

export default function EditableAvatar({ image, onImageChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await onImageChange(file); // if async, wait for upload to finish
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          loading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              size="small"
              onClick={handleClick}
              sx={{
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#f0f0f0" },
                boxShadow: 1,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        <Avatar
          src={image}
          sx={{
            width: "200px",
            height: "200px",
          }}
        />
      </Badge>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Box>
    
  );
}
