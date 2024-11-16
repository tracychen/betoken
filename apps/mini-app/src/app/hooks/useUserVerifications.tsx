"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { getUserVerifications } from "../actions/user-verifications";
import { UserVerification } from "@betoken/database";

export const useUserVerifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const { user } = usePrivy();

  const fetchUserVerifications = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    setIsLoading(true);
    try {
      const verifications = await getUserVerifications(user.id);
      setVerifications(verifications);
    } catch (error) {
      console.error("Error fetching user validations", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserVerifications();
  }, [fetchUserVerifications]);

  return { isLoading, verifications };
};
