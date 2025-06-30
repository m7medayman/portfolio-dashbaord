// src/pages/SkillInfo.tsx
import React, { use, useEffect } from "react";
import { useSkillStore } from "../store/SkillsStore";
import SkillCard from "../core/component/SkillCard"; // Adjust path
import { SkillModelType } from "../core/models/SkillModel"
import { Box, Card, CardContent, Icon, Typography } from "@mui/material";

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

  useEffect(() => {
    if (skills.length === 0) {
      useSkillStore.getState().fetchSkills();
    }
  }, [skills]);
  const update= useSkillStore.getState().updateSkill


  return (
    
    <Box  display="flex"

    sx={{
    mt: 4,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
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
      <Card sx={{ width: 300, height: 400, mx: "auto", my: 2, p: 2, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
        </CardContent>
      </Card>
    </Box>
  );
}
