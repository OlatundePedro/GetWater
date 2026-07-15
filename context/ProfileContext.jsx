import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Failed to load profile:", error.message);
    }

    setProfile(
      data || {
        id: user.id,
        full_name: user.user_metadata?.full_name || "",
        phone: "",
        address: "",
        avatar_url: null,
      },
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...profile, ...updates, updated_at: new Date() })
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loading, updateProfile, refreshProfile: fetchProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
