import { create } from "zustand";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../core/firebaseConf/firebase";
import SkillModel, { SkillModelType } from "../core/models/SkillModel";

type SkillStore = {
  skills: SkillModel[];
  loading: boolean;
  fetchSkills: () => Promise<void>;
  addSkill: (skill: SkillModel) => Promise<void>;
  updateSkill: (skill: SkillModel) => Promise<void>;
  deleteSkill: (skillName: string) => Promise<void>;
};

export const useSkillStore = create<SkillStore>((set, get) => ({
  skills: [],
  loading: false,

  fetchSkills: async () => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, "skills"));
    const skills: SkillModel[] = snapshot.docs.map(
      (doc) => new SkillModel(doc.data() as SkillModelType)
    );
    set({ skills, loading: false });
  },

  addSkill: async (skill: SkillModel) => {
    const prevSkills = get().skills;
    const updatedSkills = [...prevSkills, skill];
    set({ skills: updatedSkills }); // optimistic

    try {
      const docRef = doc(db, "skills", skill.skillName);
      await setDoc(docRef, skill.toJson());
    } catch (error) {
      console.error("Failed to add skill:", error);
      set({ skills: prevSkills }); // rollback
    }
  },

  updateSkill: async (updatedSkill: SkillModel) => {
    const prevSkills = get().skills;
    const updatedSkills = prevSkills.map((s) =>
      s.skillName === updatedSkill.skillName ? updatedSkill : s
    );
    set({ skills: updatedSkills }); // optimistic

    try {
      const docRef = doc(db, "skills", updatedSkill.skillName);
      await setDoc(docRef, updatedSkill.toJson());
    } catch (error) {
      console.error("Failed to update skill:", error);
      set({ skills: prevSkills }); // rollback
    }
  },
  deleteSkill: async (skillName: string) => {
    const prevSkills = get().skills;
    const updatedSkills = prevSkills.filter(
      (s) => s.skillName !== skillName
    );
    set({ skills: updatedSkills }); // optimistic

    try {
      const docRef = doc(db, "skills", skillName);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      set({ skills: prevSkills }); // rollback
    }
  }
}));
