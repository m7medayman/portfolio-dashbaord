import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../core/firebaseConf/firebase";
import UserModel, { UserModelParams } from "../core/models/UserModel";

type UserStore = {
  user: UserModel;
  loading: boolean;
  fetchUser: () => Promise<void>;
  saveUser: (userData: Partial<UserModelParams>) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: new UserModel({
    name: "",
    email: "",
    hero: "",
    aboutMe: "",
    image: "",
    address: "",
  }),
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const docRef = doc(db, "user", "default");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserModelParams;
        set({ user: new UserModel(data) });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      set({ loading: false });
    }
  },

  saveUser: async (updatedFields) => {
    const prevUser = get().user;
    const newUser = new UserModel({ ...prevUser, ...updatedFields });

    // Optimistically update UI
    set({ user: newUser });

    try {
      const docRef = doc(db, "user", "default");
      await setDoc(docRef, newUser.toJson());
    } catch (error) {
      console.error("Failed to save user:", error);
      // Rollback on failure
      set({ user: prevUser });
    }
  },
}));
