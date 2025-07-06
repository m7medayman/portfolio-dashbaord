import { create } from "zustand";
import { collection, getDoc, getDocsFromServer, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../core/firebaseConf/firebase";
import ProjectModel, { ProjectModelProps } from "../core/models/ProjectModel";
import { CloudinaryService } from "../core/services/cloudinaryServices";

type ProjectImageInput = File | string; // Accept either URL or File

export type ProjectAddPayload = {
  project: Omit<ProjectModelProps, "projectCoverImage" | "projectImages">;
  coverImage: ProjectImageInput;
  screenshotFiles: ProjectImageInput[];
};

type ProjectStore = {
  projects: ProjectModel[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (payload: ProjectAddPayload) => Promise<void>;
  updateProject: (payload: ProjectAddPayload & { originalProjectName: string }) => Promise<ProjectModel | undefined>;
  deleteProject: (projectId: string) => Promise<void>;
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

    // PREPARE new project before any uploads
    const docRef = doc(collection(db, "projects")); // generates new doc ID
    const id = docRef.id;
    const optimisticCoverImage =
      coverImage && typeof coverImage === "string" ? coverImage : "";
    const optimisticImageUrls = screenshotFiles.map((img) =>
      typeof img === "string" ? img : ""
    );

    const optimisticProjectData: ProjectModelProps = {
      ...project,
      id,
      projectCoverImage: optimisticCoverImage,
      projectImages: optimisticImageUrls.join(","),
    };
    const optimisticProject = new ProjectModel(optimisticProjectData);

    // Step 1: OPTIMISTICALLY add to UI
    const prevProjects = get().projects;
    set((state) => ({
      projects: [...state.projects, optimisticProject],
      loading: true,
    }));

    try {
      // Now do actual uploads
      const realCoverUrl = coverImage ? await uploadIfNeeded(coverImage) : "";
      const realImgUrls = await Promise.all(
        screenshotFiles.map(uploadIfNeeded)
      );
      const projectData: ProjectModelProps = {
        ...project,
        id,
        projectCoverImage: realCoverUrl,
        projectImages: realImgUrls.join(","),
      };
      const newProject = new ProjectModel(projectData);

      // Send to backend
      await setDoc(docRef, newProject.toJson());

      // Update UI with latest data (if needed)
      set((state) => ({
        projects: state.projects.map((proj) =>
          proj.id === id ? newProject : proj
        ),
        loading: false,
      }));
    } catch (error) {
      // Step 2: Rollback UI if backend failed
      set({ projects: prevProjects, loading: false });
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

    // Make optimistic project (without waiting for upload)
    const optimisticCoverImage =
      coverImage && typeof coverImage === "string" ? coverImage : "";
    const optimisticImages = screenshotFiles.map((img) =>
      typeof img === "string" ? img : ""
    );

    const optimisticProjectData: ProjectModelProps = {
      ...project,
      projectCoverImage: optimisticCoverImage,
      projectImages: optimisticImages.join(","),
    };
    const optimisticProject = new ProjectModel(optimisticProjectData);

    // Step 1: OPTIMISTIC UI
    const prevProjects = get().projects;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === project.id ? optimisticProject : p
      ),
      loading: true,
    }));


    try {
      // Do uploads for images
      const realCoverUrl = coverImage ? await uploadIfNeeded(coverImage) : "";
      const realImgUrls = await Promise.all(
        screenshotFiles.map(uploadIfNeeded)
      );

      const updatedProjectData: ProjectModelProps = {
        ...project,
        projectCoverImage: realCoverUrl,
        projectImages: realImgUrls.join(","),
      };
      const updatedProject = new ProjectModel(updatedProjectData);
      const docRef = doc(db, "projects", project.id);

      // Firestore update
      await setDoc(docRef, updatedProject.toJson());

      // Confirm final state in Store
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === project.id ? updatedProject : p
        ),
        loading: false,
      }));
      return updatedProject;
    } catch (error) {
      // Step 2: Rollback UI if backend failed
      set({ projects: prevProjects, loading: false });
      alert("Failed to update project: " + error);
      console.error("Failed to update project:", error);
    }
  },

  deleteProject: async (projectId: string) => {
    // Step 1: OPTIMISTIC DELETE
    const prevProjects = get().projects;
    set({
      projects: prevProjects.filter((p) => p.id !== projectId),
    });

    try {
      // Firestore delete
      const docRef = doc(db, "projects", projectId);
      await deleteDoc(docRef);
      console.log(`Project with ID ${projectId} deleted`);
    } catch (error) {
      // Step 2: Rollback on ERROR
      set({ projects: prevProjects });
      alert("Failed to delete project: " + error);
      console.error("Failed to delete project:", error);
    }
  },
}));