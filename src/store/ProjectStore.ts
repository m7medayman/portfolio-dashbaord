// projectStore.ts (using Zustand)

import { create } from "zustand";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../core/firebaseConf/firebase";
import ProjectModel, { ProjectModelProps } from "../core/models/ProjectModel";
import { CloudinaryService } from "../core/services/cloudinaryServices";

type ProjectImageInput = File | string; // Accept either URL or File

export type ProjectAddPayload = {
  project: Omit<ProjectModelProps, "projectCoverImage" | "projectImages">,
  coverImage: ProjectImageInput,
  screenshotFiles: ProjectImageInput[],
};

type ProjectStore = {
  projects: ProjectModel[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (payload: ProjectAddPayload) => Promise<void>;
  updateProject: (payload: ProjectAddPayload & { originalProjectName: string }) => Promise<void>;
  deleteProject: (projectName: string) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const projects: ProjectModel[] = snapshot.docs.map(
        (doc) => new ProjectModel(doc.data() as ProjectModelProps)
      );
      set({ projects, loading: false });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      set({ loading: false });
    }
  },

  addProject: async ({ project, coverImage, screenshotFiles }) => {
    // Helper to upload if file, or return URL if string
    const uploadIfNeeded = async (img: ProjectImageInput) =>
      typeof img === "string" ? img : (await CloudinaryService.uploadImage(img)).secureUrl;

    set({ loading: true });
    try {
      // Upload coverImage
      const coverImageUrl = coverImage
        ? await uploadIfNeeded(coverImage)
        : "";

      // Upload each screenshot if it's a File
      const imageUrls = await Promise.all(
        screenshotFiles.map(uploadIfNeeded)
      );

      // Save project to Firestore
      const projectData: ProjectModelProps = {
        ...project,
        projectCoverImage: coverImageUrl,
        projectImages: imageUrls.join(","),
      };

      const newProject = new ProjectModel(projectData);
      const docRef = doc(db, "projects", project.projectName);
      await setDoc(docRef, newProject.toJson());

      // Update local state
      set(state => ({
        projects: [...state.projects, newProject],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      alert("Failed to add project: " + error);
      console.error("Failed to add project:", error);
    }
  },

  updateProject: async ({
    project,
    coverImage,
    screenshotFiles,
    originalProjectName,
  }) => {
    const uploadIfNeeded = async (img: ProjectImageInput) =>
      typeof img === "string" ? img : (await CloudinaryService.uploadImage(img)).secureUrl;

    set({ loading: true });
    try {
      // Upload cover
      const coverImageUrl = coverImage
        ? await uploadIfNeeded(coverImage)
        : "";

      // Upload screenshots
      const imageUrls = await Promise.all(screenshotFiles.map(uploadIfNeeded));

      const updatedProjectData: ProjectModelProps = {
        ...project,
        projectCoverImage: coverImageUrl,
        projectImages: imageUrls.join(","),
      };

      const updatedProject = new ProjectModel(updatedProjectData);
      const docRef = doc(db, "projects", originalProjectName);
      await setDoc(docRef, updatedProject.toJson());

      // Update state
      set(state => ({
        projects: state.projects.map(p =>
          p.projectName === originalProjectName ? updatedProject : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      alert("Failed to update project: " + error);
      console.error("Failed to update project:", error);
    }
  },

  deleteProject: async (projectName: string) => {
    const prevProjects = get().projects;
    const updatedProjects = prevProjects.filter(
      (p) => p.projectName !== projectName
    );
    set({ projects: updatedProjects }); // optimistic

    try {
      const docRef = doc(db, "projects", projectName);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Failed to delete project:", error);
      set({ projects: prevProjects }); // rollback
    }
  }
}));