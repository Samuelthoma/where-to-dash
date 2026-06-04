"use client";

import { useState, useEffect } from "react";
import { LogOut, UserPlus, Shield, Users, Trash2, Key, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  logoutAction,
  addMemberAction,
  getTeamMembersAction,
  removeMemberAction,
  changePasswordAction
} from "./action";

type TeamMember = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in?: string;
};

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const loadMembers = async () => {
    setIsLoadingMembers(true);
    const result = await getTeamMembersAction();
    if (result.success && result.users) {
      setMembers(result.users);
    } else {
      toast.error("Failed to load team members");
    }
    setIsLoadingMembers(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const result = await addMemberAction(email, password);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      setEmail("");
      setPassword("");
      loadMembers();
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (id: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to completely remove ${userEmail}? This cannot be undone.`)) return;

    const result = await removeMemberAction(id);
    if (result.success) {
      toast.success(result.message);
      loadMembers(); 
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdatePassword = async (id: string) => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const result = await changePasswordAction(id, newPassword);
    if (result.success) {
      toast.success(result.message);
      setEditingUserId(null);
      setNewPassword("");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-300 p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and team access.
          </p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                Add Team Member
              </CardTitle>
              <CardDescription>
                Create credentials for a new admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="teammate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temporary Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2 gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {isAdding ? "Creating..." : "Add to Team"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Active Team Members
              </CardTitle>
              <CardDescription>
                Anyone listed here has full read/write access to the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <div className="text-center text-sm text-muted-foreground py-8">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">No members found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 font-medium rounded-tl-md">Email</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                        <th className="px-4 py-3 font-medium text-right rounded-tr-md">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {members.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-foreground">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {editingUserId === user.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="password"
                                  placeholder="New password"
                                  className="w-35 h-8 text-xs"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleUpdatePassword(user.id)}>
                                  Save
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => setEditingUserId(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 gap-1"
                                  onClick={() => setEditingUserId(user.id)}
                                >
                                  <Key className="h-3 w-3" />
                                  Reset
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleRemoveMember(user.id, user.email)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}