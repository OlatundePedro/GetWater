import { useRouter } from "expo-router";
import { Alert } from "react-native";
import ProfileScreen from "../../components/profile/ProfileScreen";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();

  const handleUpdateField = async (field, value) => {
    try {
      await updateProfile({ [field]: value });
    } catch (err) {
      Alert.alert("Update failed", err.message);
    }
  };

  const handleUploadAvatar = async (url) => {
    try {
      await updateProfile({ avatar_url: url });
    } catch (err) {
      Alert.alert("Upload failed", err.message);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <ProfileScreen
      profile={profile}
      email={user?.email}
      onUpdateField={handleUpdateField}
      onUploadAvatar={handleUploadAvatar}
      onLogout={handleLogout}
    />
  );
}
