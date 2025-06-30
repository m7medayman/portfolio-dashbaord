// src/pages/SkillInfo.tsx
import React, { use, useEffect, useState } from "react";
import { useSkillStore } from "../store/SkillsStore";
import SkillCard from "../core/component/SkillCard"; // Adjust path
import { SkillModelType } from "../core/models/SkillModel"
import { Box, Card, CardContent, Icon, Typography,ButtonBase } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddSkillModal from "../core/component/AddSkillModal";
import { Add } from "@mui/icons-material";

const mockSkills: SkillModelType[] = [
  {
    skillName: "React",
    skillImage: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
    skillLevel: 80,
    skillDescription: "JavaScript library for building user interfaces.",
  },
  {
    skillName: "TypeScript",
    skillImage: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
    skillLevel: 70,
    skillDescription: "Strongly typed programming language that builds on JavaScript.",
  },
];

export default function SkillInfo() {
  const skills  = mockSkills;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  }
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  }

  useEffect(() => {
    if (skills.length === 0) {
      useSkillStore.getState().fetchSkills();
    }
  }, [skills]);
  const update= useSkillStore.getState().updateSkill


  return (
    
    <Box  

    sx={{
    mt: 4,
    flexWrap: "wrap",
    display: 'inline-flex',
    

    gap: 2, // or 0
    '& > *': {
      m: 0, // remove margins from all children
    },
  }}
  >
 

      {skills.map((skill, index) => (
        <SkillCard
        onDelete={function (skillName: string) {
          
        }}
          key={index}
          skill={skill}
          onSave={function (updated) {}}
        />
        
      ))}
   <ButtonBase
      onClick={openAddDialog}
      sx={{
        width: 300,
        height: 400,
        mx: "auto",
        my: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 2,
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // clip ripple
      }}
     
    >
      <CardContent sx={{ alignSelf: "center" }}>
        <AddIcon sx={{ fontSize: 100 }} />
      </CardContent>
    </ButtonBase>
    <AddSkillModal onClose={()=>closeAddDialog()} open={isAddDialogOpen}/>
    
    </Box>
  );
}
