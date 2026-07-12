import { useRouter } from "expo-router";
import CartScreen from "../../components/Cart/CartScreen";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const router = useRouter();
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <CartScreen
      items={items}
      total={total}
      onBack={() => router.back()}
      onIncrease={(id) => updateQuantity(id, 1)}
      onDecrease={(id) => updateQuantity(id, -1)}
      onRemove={removeItem}
      onCheckout={() => router.push("/checkout")}
    />
  );
}
