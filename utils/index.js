export const calcCartSummary = (cartItems) => {
  const itemsCount = cartItems.reduce((a, c) => a + c.quantity, 0);
  const itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 20;
  const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
  const totalPrice =
    Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;
  return { itemsCount, itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  if (doc.reviews) {
    doc.reviews = doc.reviews.map(convertDocToObj);
  }
  return doc;
};
