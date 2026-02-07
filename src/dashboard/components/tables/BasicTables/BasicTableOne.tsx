import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { supabase } from "../../../../../lib/supabase";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  name: string;
  email?: string;
  created_at?: string;
  avatar_url?: string;
}

export default function UserProfilesTable() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);

      try {
        // First, get all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          toast.error("Failed to load profiles");
          setProfiles([]);
          setLoading(false);
          return;
        }

        // Then, get auth users (requires admin access or use service role)
        // Since we can't access other users' auth data directly, we'll try to get the current user
        // and for others, we'll show their ID as email placeholder
        const profilesWithEmails = await Promise.all(
          (profilesData || []).map(async (profile) => {
            try {
              // Try to get user data from auth.users (this requires admin API or service role key)
              const { data: { user }, error } = await supabase.auth.admin.getUserById(profile.id);
              
              return {
                ...profile,
                email: user?.email || `${profile.id.substring(0, 8)}@user.com`,
              };
            } catch (err) {
              // If admin API is not available, fallback to profile data
              console.log("Cannot access auth data, using fallback");
              return {
                ...profile,
                email: profile.email || "No email available",
              };
            }
          })
        );

        setProfiles(profilesWithEmails);
      } catch (err) {
        console.error("Error:", err);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Generate initials from name for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            No Profiles Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no user profiles available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          User Profiles
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {profiles.length} {profiles.length === 1 ? "user" : "users"} registered
        </p>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Joined Date
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    {profile.avatar_url ? (
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={profile.avatar_url}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(
                          profile.name
                        )}`}
                      >
                        {getInitials(profile.name)}
                      </div>
                    )}
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {profile.name || "Unknown User"}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        ID: {profile.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {profile.email || "No email"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color="success">
                    Admin
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}