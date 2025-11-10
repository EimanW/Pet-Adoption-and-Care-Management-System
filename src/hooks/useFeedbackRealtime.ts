import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useFeedbackRealtime = (petId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('pet-feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pet_feedback',
          ...(petId && { filter: `pet_id=eq.${petId}` })
        },
        () => {
          // Invalidate feedback queries when changes occur
          queryClient.invalidateQueries({ queryKey: ['pet-feedback'] });
          if (petId) {
            queryClient.invalidateQueries({ queryKey: ['pet-feedback', petId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [petId, queryClient]);
};
