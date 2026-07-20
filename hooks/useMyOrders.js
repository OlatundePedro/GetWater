import { useCallback, useEffect, useState } from "react";
import { supabase } from "../config/supabase"; // adjust path to your existing client

export function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    // no .eq('user_id', ...) needed — the "Users can view their own orders"
    // RLS policy already restricts this to rows where user_id = auth.uid()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error);
    else setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let channel;
    let cancelled = false;

    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id;
      if (!uid || cancelled) return;

      // IMPORTANT: the filter below restricts this subscription to only
      // this user's own rows. Without it, Realtime's postgres_changes
      // stream pushes every row's INSERT/UPDATE/DELETE to every connected
      // client regardless of RLS — this is what caused customers to see
      // each other's orders appear in their list over time.
      channel = supabase
        .channel(`my-orders-${uid}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            setOrders((prev) => {
              if (payload.eventType === "INSERT") {
                return [payload.new, ...prev];
              }
              if (payload.eventType === "UPDATE") {
                return prev.map((o) =>
                  o.id === payload.new.id ? payload.new : o,
                );
              }
              if (payload.eventType === "DELETE") {
                return prev.filter((o) => o.id !== payload.old.id);
              }
              return prev;
            });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading, error, refresh: fetchOrders };
}
