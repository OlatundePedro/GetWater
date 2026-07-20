import { useCallback, useEffect, useState } from "react";
import { supabase } from "../config/supabase"; // adjust path to your existing client

export const NEXT_STATUS = {
  order_made: "packaged",
  packaged: "in_transit",
  in_transit: "delivered",
  delivered: null,
};

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
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

  // keep the admin list live too — new orders appear, status edits from
  // elsewhere (or a second admin device) reflect instantly
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    setUpdatingId(order.id);
    const { error } = await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", order.id);
    setUpdatingId(null);

    if (error) throw error;
  };

  return {
    orders,
    loading,
    error,
    updatingId,
    advanceStatus,
    refresh: fetchOrders,
  };
}
