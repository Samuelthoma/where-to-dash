"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const getAdminClient = () => createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
}

export async function addMemberAction(email: string, password: string) {
    const adminAuthClient = getAdminClient();
    const { error } = await adminAuthClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, message: `Successfully added ${email} to the team.` };
}

export async function getTeamMembersAction() {
    const adminAuthClient = getAdminClient();
    const { data, error } = await adminAuthClient.auth.admin.listUsers();

    if (error) return { success: false, error: error.message, users: [] };

    const safeUsers = data.users.map(u => ({
        id: u.id,
        email: u.email || "No email",
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
    }));

    return { success: true, users: safeUsers };
}

export async function removeMemberAction(userId: string) {
    const adminAuthClient = getAdminClient();
    const { error } = await adminAuthClient.auth.admin.deleteUser(userId);

    if (error) return { success: false, error: error.message };
    return { success: true, message: "User access revoked successfully." };
}

export async function changePasswordAction(userId: string, newPassword: string) {
    const adminAuthClient = getAdminClient();
    const { error } = await adminAuthClient.auth.admin.updateUserById(userId, {
        password: newPassword
    });

    if (error) return { success: false, error: error.message };
    return { success: true, message: "Password updated successfully." };
}