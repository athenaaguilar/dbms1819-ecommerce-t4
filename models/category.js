var exports = module.exports = {};

var Category = {
      create: (client,categoryData,callback) => {
      var category = [categoryData.category_name ];
      const categoryInsertQuery =  `
       INSERT INTO products_category (name) 
       VALUES ($1)
      `;
      client.query(categoryInsertQuery,category)
      .then(res => callback('SUCCESS'))
      .catch(e => callback('ERROR'))
    },

    list: (client,filter,callback) => {
      const categoryListQuery =  `
        SELECT
          *
        FROM
          products_category ORDER by id ASC
      `;
      client.query(categoryListQuery,(req,result)=>{
      //  console.log(result.rows)
        callback(result.rows)
      });
    },
    getById: (client,id,callback) => {
      const categoryListQuery =  `
        SELECT
          *
        FROM
          products_category 
        WHERE
          id = '${id.categoryId}'
      `;
      client.query(categoryListQuery,(req,result)=>{
       console.log(result.rows)
        callback(result.rows)
      });
    },
    update: (client,categoryId,categoryData,callback) => {
      const categoryListQuery =  `
        UPDATE
          products_category
        SET
          name = '${categoryData.name}'
        WHERE id = '${categoryId.categoryId}'
      `;
      client.query(categoryListQuery,(req,result)=>{
      //  console.log(result.rows)
        callback(result)
      });
    }
};
module.exports = Category;

