"use client";

import { useCallback, useEffect, useState } from "react";

import { getCurrentUserIdAction } from "@/actions/admin/get-current-user-id-action";
import {
  createUserAction,
  deleteUserAction,
  getAllUsersAction,
} from "@/actions/admin/user-management-actions";
import { UserManagementTab } from "@/components/Dashboard/UserManagementTab";
import { CreateUserData, User } from "@/types/user";

export function UserManagementContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>("");

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Carregar ID do admin logado
      const userIdResult = await getCurrentUserIdAction();
      if (userIdResult.success && userIdResult.userId) {
        setAdminId(userIdResult.userId);
      }

      const result = await getAllUsersAction();

      if (result.success && result.users) {
        setUsers(result.users);
      } else {
        console.error("Erro ao carregar usuários:", result.error);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = useCallback(async (data: CreateUserData) => {
    const result = await createUserAction(data);

    if (result.success && result.user) {
      setUsers((prev) => [...prev, result.user!]);
    } else {
      throw new Error(result.error || "Erro ao criar usuário");
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    const result = await deleteUserAction(userId);

    if (result.success) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } else {
      throw new Error(result.error || "Erro ao excluir usuário");
    }
  }, []);

  const handleUpdateUser = useCallback(
    (userId: string, updates: Partial<User>) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updates } : user,
        ),
      );
    },
    [],
  );

  const handleToggleStatus = useCallback(
    (userId: string, newStatus: boolean) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: newStatus } : user,
        ),
      );
    },
    [],
  );

  return (
    <UserManagementTab
      users={users}
      onCreateUser={handleCreateUser}
      onDeleteUser={handleDeleteUser}
      onUpdateUser={handleUpdateUser}
      onToggleStatus={handleToggleStatus}
      isLoading={isLoading}
      adminId={adminId}
    />
  );
}
