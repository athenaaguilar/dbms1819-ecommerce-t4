var exports = module.exports = {};

var Customer = {
    top10CustomerHighestPayment: (client,filter,callback) => {
      const query =  `
          SELECT DISTINCT customer.first_name, customer.last_name,
          sum (products.price * orders.quantity)
          FROM
           orders
           inner join products on products.id = orders.product_id
           inner join customer on customer.id = orders.customer_id
          GROUP BY
           customer.first_name,customer.last_name order by sum DESC limit 10
      `;
      client.query(query,(req,result)=>{
        callback(result.rows)
      });
    },
    getByEmail: (client,email,callback) => {
      const query =  `
          select * from customer where email = '${email}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0])
      });
    },
    getById: (client,id,callback) => {
      const query =  `
          select * from customer where id = '${id}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
    signup: (client,customerData,callback) => {
    var customerData = [customerData.email,customerData.fName,customerData.lName,customerData.street,customerData.mun,customerData.prov,customerData.zip,customerData.pass,customerData.userType];
    const query =  `
     INSERT INTO customer (email,first_name,last_name,street,municipality,province,zipcode,password,user_type) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `;
    client.query(query,customerData)
    .then(res => callback('SUCCESS'))
    .catch(e => callback('ERROR'))
  },
      getCustomerData: (client,id,callback) => {
      const query =  `
          select * from customer where id = '${id.id}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows);
      });
    },
    update: (client,customerId,customerData,callback) => {
      const query =  `
        UPDATE
          customer
        SET
          email = '${customerData.email}', first_name = '${customerData.fName}', last_name = '${customerData.lName}', street = '${customerData.street}', municipality = '${customerData.mun}', province = '${customerData.prov}', zipcode = '${customerData.zip}', password = '${customerData.pass}'
        WHERE id = '${customerId.id}'
      `;
      client.query(query,(req,result)=>{
      //  console.log(result.rows)
        callback(result)
      });
    }
    
};

module.exports = Customer;