export function generateOrderId() {
  const timestampPart = Date.now().toString().slice(-7);
  return timestampPart;
}
