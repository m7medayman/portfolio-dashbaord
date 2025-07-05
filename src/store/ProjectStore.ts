// projectStore.ts (using Zustand)

import { create } from "zustand";
import { collection, getDoc,getDocsFromServer , doc, setDoc, deleteDoc } from "firebase/firestore";
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
  getProject: (projectName: string) => Promise<ProjectModel | undefined>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,


fetchProjects: async () => {
  set({ loading: true, projects: [] });
  console.log("Fetching projects...");

  try {
    const snapshot = await getDocsFromServer(collection(db, "projects"));

    const projects: ProjectModel[] = snapshot.docs.map((docSnap) =>
      new ProjectModel({
        ...(docSnap.data() as ProjectModelProps),
        id: docSnap.id, // Ensure Firestore doc ID is used
      })
    );

    set({ projects, loading: false });
    console.log("Projects fetched from server:", projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    set({ loading: false });
  }
},

getProject: async (id: string) => {
  try {
    const docRef = doc(db, "projects", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as ProjectModelProps;
      return new ProjectModel({ ...data, id: snapshot.id });
    } else {
      console.warn(`No project found with id: ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error("Failed to fetch project by id:", error);
    return undefined;
  }
},
addProject: async ({ project, coverImage, screenshotFiles }) => {
  const uploadIfNeeded = async (img: ProjectImageInput) =>
    typeof img === "string" ? img : (await CloudinaryService.uploadImage(img)).secureUrl;

  set({ loading: true });
  try {
    const coverImageUrl = coverImage ? await uploadIfNeeded(coverImage) : "";
    const imageUrls = await Promise.all(screenshotFiles.map(uploadIfNeeded));

    const docRef = doc(collection(db, "projects")); // generates new doc ID
    const id = docRef.id;

    const projectData: ProjectModelProps = {
      ...project,
      id,
      projectCoverImage: coverImageUrl,
      projectImages: imageUrls.join(","),
    };

    const newProject = new ProjectModel(projectData);
    await setDoc(docRef, newProject.toJson());

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
    const coverImageUrl = coverImage ? await uploadIfNeeded(coverImage) : "";
    const imageUrls = await Promise.all(screenshotFiles.map(uploadIfNeeded));

    const updatedProjectData: ProjectModelProps = {
      ...project,
      projectCoverImage: coverImageUrl,
      projectImages: imageUrls.join(","),
    };

    const updatedProject = new ProjectModel(updatedProjectData);
    const docRef = doc(db, "projects", project.id); // use ID for updates
    await setDoc(docRef, updatedProject.toJson());

    set(state => ({
      projects: state.projects.map(p =>
        p.id === project.id ? updatedProject : p
      ),
      loading: false,
    }));
  } catch (error) {
    set({ loading: false });
    alert("Failed to update project: " + error);
    console.error("Failed to update project:", error);
  }
},


deleteProject: async (projectId: string) => {
  const prevProjects = get().projects;
  const updatedProjects = prevProjects.filter(p => p.id !== projectId);
  set({ projects: updatedProjects }); // optimistic

  try {
    const docRef = doc(db, "projects", projectId);
    await deleteDoc(docRef);
    console.log(`Project with ID ${projectId} deleted`);
  } catch (error) {
    console.error("Failed to delete project:", error);
    set({ projects: prevProjects }); // rollback
  }
}

}));