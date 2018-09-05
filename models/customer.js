var exports = module.exports = {};

var Customer = {
    top10CustomerHighestPayment: (client,filter,callback) => {
      const query =  `
          SELECT DISTINCT customer.first_name, customer.last_name,
          sum (products.price)
          FROM
           orders
           inner join products on products.id = orders.product_id
           inner join customer on customer.id = orders.customer_id
          GROUP BY
           customer.first_name,customer.last_name order by sum DESC limit 10
      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    }
};

module.exports = Customer;