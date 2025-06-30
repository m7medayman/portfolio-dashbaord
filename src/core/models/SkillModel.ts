export type SkillModelType = {
  skillName: string;
  skillImage: string;
  skillLevel: number; // 0–100
  skillDescription: string;
};

class SkillModel {
  skillName: string;
  skillImage: string;
  skillLevel: number;
  skillDescription: string;

  constructor({
    skillName,
    skillImage,
    skillLevel,
    skillDescription,
  }: SkillModelType) {
    this.skillName = skillName;
    this.skillImage = skillImage;
    this.skillLevel = skillLevel;
    this.skillDescription = skillDescription;
  }

  toJson(): SkillModelType {
    return {
      skillName: this.skillName,
      skillImage: this.skillImage,
      skillLevel: this.skillLevel,
      skillDescription: this.skillDescription,
    };
  }
}

export default SkillModel;
