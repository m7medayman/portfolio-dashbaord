import UserModel from "../core/models/UserModel";
import { useUserStore } from "../store/UserStore"
import { useEffect, useState } from "react"
import EditableCardText from "../core/component/ EditableText";
import { Stack } from "@mui/material";
import EditableAvatar from "../core/component/EditableAvatar";
import {CloudinaryService} from "../core/services/cloudinaryServices";
export default function UserInfo() {
    const user = useUserStore((state) => state.user);
      const fetchUser = useUserStore((state) => state.fetchUser);
      const saveUser = useUserStore((state) => state.saveUser);
        const [uploading, setUploading] = useState(false);
    useEffect(() => {
        fetchUser();
    },[fetchUser]);
    const uploadImageService =CloudinaryService.uploadImage ;
    const getImageUrl =CloudinaryService.getImageUrl ;
     const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const result = await CloudinaryService.uploadImage(file);
      saveUser({ image: result.secureUrl });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };
    return (
        <Stack spacing={2} p={2}>
            <EditableAvatar image={user.image} onImageChange={uploadImage}/>
           
            <EditableCardText value={user.name} onSave={(val) => saveUser({ name: val }) } label="Name" />
            <EditableCardText value={user.email} onSave={(val) => saveUser({ email: val }) } label="Email" />
            <EditableCardText value={user.hero} onSave={(val) =>   saveUser({ hero: val }) } label="Hero" />
            <EditableCardText value={user.aboutMe} onSave={(val) => saveUser({ aboutMe: val }) } label="About Me" />
            <EditableCardText value={user.address} onSave={(val) => saveUser({ address: val }) } label="Address" />
        </Stack>
    )
}