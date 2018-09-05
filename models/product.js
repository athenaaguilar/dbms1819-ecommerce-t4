var exports = module.exports = {};

var Product = {
      create: (client,productData,callback) => {
      var productData = [productData.product_name,productData.product_desc,productData.product_tagline,productData.product_price,productData.product_warranty,productData.product_category,productData.product_brand,productData.product_image];
      const productInsertQuery =  `
       INSERT INTO products (name,descriptions,tagline,price,warranty,category_id,brand_id,img)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `;
      client.query(productInsertQuery,productData)
      .then(res => callback('SUCCESS'))
      .catch(e => callback('ERROR'))
    },
     list: (client,filter,callback) => {
      const productListQuery =  `
      SELECT 
        *
      FROM 
        products 
      ORDER by 
        id ASC;
      `;
      client.query(productListQuery,(req,result)=>{
        console.log(result.rows)
        callback(result.rows)
      });
    }
};
module.exports = Product;