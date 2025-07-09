// store/EditProjectStore.ts
import ProjectModel, { ProjectModelProps } from "../core/models/ProjectModel";
import { create } from "zustand";
import { useStore } from "zustand";
import { useState, useEffect } from "react";

type EditStoreInputType = Omit<ProjectModelProps, "projectImages" | "projectCoverImage"> & {
    projectImages: (string | File)[];
    projectCoverImage: string | File;
    cancelEdit: () => void;
    updateField: (field: keyof Omit<EditStoreInputType, 'cancelEdit' | 'updateField' | 'updateCoverImage' | 'updateImages'>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateCoverImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeScreenshot: (index: number) => void;
    addKeyword: () => void;
    deleteKeyword: (index: number) => void;
};

// Type for the store
export type EditProjectStore = ReturnType<typeof createEditProjectStore>;

// Function 1: Create Store (you already have this)
export const createEditProjectStore = (initialValues: ProjectModel) => {
    const baseData = initialValues.toJson();

    return create<EditStoreInputType>((set) => ({
        ...baseData,
        projectCoverImage: baseData.projectCoverImage ?? "",
        projectImages: baseData.projectImages ? baseData.projectImages.split(",") : [],

        cancelEdit: () => set(() => ({
            ...baseData,
            projectCoverImage: baseData.projectCoverImage ?? "",
            projectImages: baseData.projectImages ? baseData.projectImages.split(",") : [],
        })),

        updateField:
            (field) =>
                (e) => {
                    set((old) => ({ ...old, [field]: e.target.value }));
                },

        updateCoverImage: (e) => {
            if (e.target.files && e.target.files[0]) {
                set((old) => ({
                    ...old,
                    projectCoverImage: e.target.files![0],
                }));
            }
        },

        updateImages: (e) => {
            if (e.target.files) {
                set((old) => ({
                    ...old,
                    projectImages: [...old.projectImages, ...Array.from(e.target.files!)],
                }));
            }
        },
        removeScreenshot: (index: number) => {
            set((old) => ({
                ...old,
                projectImages: old.projectImages.filter((_, i) => i !== index),
            }));
        },
        addKeyword: () => {
            const keyword = prompt("Enter a keyword:");
            if (keyword && keyword.trim()) {
                set((old) => ({
                    ...old,
                    keywords: [...old.keywords, keyword.trim()],
                }));
            }
        },
        deleteKeyword: (index: number) => {
            set((old) => ({
                ...old,
                keywords: old.keywords.filter((_, i) => i !== index),
            }));
        }
    }));
};

// Function 2: Use Store (custom hook that handles subscriptions)
export const useEditProjectStore = (store: EditProjectStore | null): EditStoreInputType | null => {
    const [state, setState] = useState<EditStoreInputType | null>(null);

    useEffect(() => {
        if (!store) {
            setState(null);
            return;
        }

        // Set initial state
        setState(store.getState());

        // Subscribe to changes
        const unsubscribe = store.subscribe(() => {
            setState(store.getState());
        });

        // Cleanup
        return unsubscribe;
    }, [store]);

    return state;
};