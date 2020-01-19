module.exports = (allowedOrderBy) => ({ order, orderBy }) => {
  let orderByField = orderBy;
  let orderInt = parseInt(order, 10);

  if (orderInt !== 1 && orderInt !== -1) {
    orderInt = 1;
  }

  if (!allowedOrderBy.includes(orderByField)) {
    orderByField = allowedOrderBy[0];
  }

  return { order: orderInt, orderBy: orderByField };
};
