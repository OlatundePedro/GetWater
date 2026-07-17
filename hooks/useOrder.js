import { useCallback, useEffect, useState } from "react";
import { supabase } from "../config/supabase"; // adjust path to your existing client

const STATUS_TO_STEP = {
  order_made: 0,
  packaged: 1,
  in_transit: 2,
  delivered: 3,
};

export function useOrder(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) setError(error);
    else setOrder(data);
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // live updates: any change to this order row (e.g. status flipped by your
  // admin panel or fulfillment webhook) pushes straight into local state
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const updateAddress = async (newAddress) => {
    setSaving(true);
    const { data, error } = await supabase
      .from("orders")
      .update({ delivery_address: newAddress })
      .eq("id", orderId)
      .select()
      .single();
    setSaving(false);

    if (error) throw error;
    setOrder(data);
    return data;
  };

  return {
    order,
    loading,
    error,
    saving,
    currentStepIndex: order ? (STATUS_TO_STEP[order.status] ?? 0) : 0,
    updateAddress,
  };
}
