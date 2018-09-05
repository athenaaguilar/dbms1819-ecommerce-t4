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
<<<<<<< HEAD
    },
    top10CustomerOrder: (client,filter,callback) => {
      const query =  `
        SELECT
       customer_id, customer.first_name, customer.last_name,
       COUNT (customer_id)
      FROM
       orders
       inner join customer on customer.id = orders.customer_id
      GROUP BY
       customer_id,customer.first_name,customer.last_name order by count DESC limit 10

      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    },
    top10MostOrderedProducts: (client,filter,callback) => {
      const query =  `
          SELECT
           product_id, products.name,
           COUNT (product_id)
          FROM
           orders
           inner join products on products.id = orders.product_id
          GROUP BY
           customer_id,products.name,orders.product_id order by count DESC limit 10
      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    },
    top10LeastOrderedProducts: (client,filter,callback) => {
      const query =  `
          SELECT
           product_id, products.name,
           COUNT (product_id)
          FROM
           orders
           inner join products on products.id = orders.product_id
          GROUP BY
           customer_id,products.name,orders.product_id order by count ASC limit 10
      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    },
    top3OrderedBrands: (client,filter,callback) => {
      const query =  `
        SELECT DISTINCT products_brand.name,
        sum (orders.quantity)
        FROM
         orders
         inner join products on products.id = orders.product_id
         inner join products_brand on products_brand.id = products.brand_id
        GROUP BY
          products_brand.name order by sum DESC limit 3
      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    },
    top3OrderedCategory: (client,filter,callback) => {
      const query =  `
         SELECT DISTINCT products_category.name,
          sum (orders.quantity)
          FROM
           orders
           inner join products on products.id = orders.product_id
           inner join products_category on products_category.id = products.category_id
          GROUP BY
            products_category.name order by sum DESC limit 3
 
      `;
      client.query(query,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    }
};

=======
    }
};
>>>>>>> 5767731b498741800b94cff4596ec306dd54ecac
module.exports = Order;