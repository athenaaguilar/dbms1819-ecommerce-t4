var exports = module.exports = {};

var Order = {
    list: (client,filter,callback) => {
      const orderListQuery =  `
        SELECT 
          customer.first_name AS fname,
          customer.last_name AS lname,
          customer.email AS email,
          products.name AS product,
          orders.quantity AS qty,
          orders.order_date AS orderdate 
        FROM orders 
        INNER JOIN customer 
        ON customer.id=orders.customer_id 
        INNER JOIN products 
        ON products.id=orders.product_id 
        ORDER BY orderdate DESC

      `;
      client.query(orderListQuery,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    }
};
module.exports = Order;