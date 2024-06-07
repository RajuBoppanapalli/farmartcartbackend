
let mysql = require("mysql2")


let connection = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "root",
  database: "farmart"

});

function startConnection() {
  connection.connect((err) => {
    if (err) throw err;
    console.log("connected!")
  })
}

// registration function  by customer and vendor 
async function registration(full_name, email, phone, password, shop_name, shop_url, vendor_phone, registrationType,) {
  startConnection();


  if (registrationType === 'customer') {

    let data = await connection.promise().query(
      `INSERT INTO customers (full_name, email, phone, password) VALUES (?, ?, ?, ?)`,
      [full_name, email, phone, password]
    );
    return data[0];
  } else if (registrationType === 'vendor') {

    let data = await connection.promise().query(
      `INSERT INTO vendors (full_name, email, phone, password, shop_name, shop_url, vendor_phone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone, password, shop_name, shop_url, vendor_phone]
    );
    return data[0];
  }

}

//get customers function 
async function getcustomer() {
  startConnection();
  let data = await connection.promise().query("select * from customers");
  return data[0];

}


// Function to add the products into database 
async function addproducts(product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent,product_image, product_type, product_release, soldby) {
  startConnection();
  let quantity = 1;
  let data = await connection.promise().query(`INSERT INTO farmartproducts (product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent, quantity, product_image, product_type, product_release,soldby )
    VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)`, [product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent, quantity, product_image, product_type, product_release, soldby]);
  return data[0];

}
async function addreview(productid,rating,review,image) {
  startConnection();
  let data = await connection.promise().query(`INSERT INTO product_review (productid,rating,review,image )
    VALUES (?, ?, ?,?)`, [productid,rating,review,image ]);
  return data[0];

}
// function to get all the products 
async function getproducts() {
  startConnection();
  let data = await connection.promise().query(`select * from farmartproducts`);
  return data[0];
}
//Function to getproducts By id
async function getProductById(id) {
  startConnection();
  let data = await connection.promise().query(`select * from farmartproducts where product_id=${id}`);
  return data[0];
}

// function to add the products in to cart
// async function addToCart(productid,quantity, customerid) {
//   startConnection();


//   let data = await connection.promise().query(`insert into farmartcart(productid, quantity, customerid) values(${productid}, ${quantity}, ${customerid})`);
//   return data[0];
// }

async function addToCart(productid, quantity, customerid) {
  startConnection();
  
  try {
    const [productRows] = await connection.promise().query(`SELECT newprice FROM farmartproducts WHERE product_id = ?`, [productid]);
    
    if (productRows.length === 0) {
      throw new Error('Product not found');
    }

    const newprice = productRows[0].newprice;
    const totalprice = newprice * quantity;

    const [result] = await connection.promise().query(
      `INSERT INTO farmartcart (productid, quantity, customerid, totalprice) VALUES (?, ?, ?, ?)`,
      [productid, quantity, customerid, totalprice]
    );

    return result;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}
//function to update totalprice
async function totalprice(qid,totalamt,pid){
  startConnection()
  let data = await connection.promise().query(`update farmartcart set quantity=${qid}, totalprice=${totalamt*qid} where id=${pid}`)
  return data[0];
}
// function to get all cart products
async function getcart() {
  startConnection();
  let data = await connection.promise().query(`select c.quantity , c.id, product_name, p.product_id , oldprice, newprice, c.customerid,p.product_image, offer_percent, available , product_brand  from farmartproducts as p
      join farmartcart as c on p.product_id=c.productid;
      `);
  return data[0];
}
// function to get all cart products by using customer
async function getcartbyid(id) {
  startConnection();
  let data = await connection.promise().query(`select c.quantity, c.id, c.totalprice, c.customerid,product_name, p.product_id ,  oldprice, newprice,p.product_image, offer_percent, available , product_brand  from farmartproducts as p
    join farmartcart as c on p.product_id=c.productid where c.customerid=${id};
      `);
  return data[0];
}

async function getTotalPriceForQuantity(qid) {
  startConnection();
  let [rows] = await connection.promise().query(
    'SELECT SUM(totalprice) as totalSum FROM farmartcart WHERE quantity = ?',
    [qid]
  );
  return rows[0].totalSum;
}

// function to delete  cart products by id
async function deletecartiteam(id) {
  startConnection();
  let sql = `DELETE FROM farmartcart WHERE id = ?`;
  let data = await connection.promise().query(sql, [id]);
  return data[0];
}






// function to add the products in to wishlist
async function addToWishlist(productid, customerid) {
  startConnection();
  let quantity = 1;
  let data = await connection.promise().query(`insert into wishlist(productid,quantity,customerid) values(${productid},${quantity},${customerid})`);
  return data[0];
}
// function to get all products in wishlist
async function getwishlist() {
  startConnection();
  let data = await connection.promise().query(`select w.quantity , w.id,  product_name, p.product_id ,oldprice, newprice,p.product_image, offer_percent, available , product_brand  from farmartproducts as p
    join wishlist as w on p.product_id=w.productid;
    `);
  return data[0];
}
// function to get all wishlist products by using customer
async function getwishlistbyid(id) {
  startConnection();
  let data = await connection.promise().query(`select w.quantity , w.id, w.customerid, product_name, p.product_id ,oldprice, newprice,p.product_image, offer_percent, available , product_brand  from farmartproducts as p
    join wishlist as w on p.product_id=w.productid where w.customerid=${id};
    `);
  return data[0];
}

// function to delete  wishlist products by id
async function deletewishlistiteam(id) {
  startConnection();
  let sql = `DELETE FROM wishlist WHERE id = ?`;
  let data = await connection.promise().query(sql, [id]);
  return data[0];
}




// function to add the products in to compare
async function addToCompare(productid, customerid) {
  startConnection();
  let quantity = 1;
  let data = await connection.promise().query(`insert into compare(productid,quantity,customerid) values(${productid},${quantity},${customerid})`);
  return data[0];
}
// function to get all products in compare
async function getcompare() {
  startConnection();
  let data = await connection.promise().query(`select cp.quantity , cp.id, product_name, p.product_id ,oldprice, newprice,p.product_image, offer_percent, available , product_brand ,sku from farmartproducts as p
        join compare as cp on p.product_id=cp.productid;
        `);
  return data[0];
}
// function to get all compare products by using customer
async function getcomparebyid(id) {
  startConnection();
  let data = await connection.promise().query(`select cp.quantity , cp.id,cp.customerid, product_name, p.product_id ,oldprice, newprice,p.product_image, offer_percent, available , product_brand ,sku from farmartproducts as p
        join compare as cp on p.product_id=cp.productid where cp.customerid=${id};
        `);
  return data[0];
}
// function to delete  wishlist products by id
async function deletecompareiteam(id) {
  startConnection();
  let sql = `DELETE FROM compare WHERE id = ?`;
  let data = await connection.promise().query(sql, [id]);
  return data[0];
}

// search products

async function searchproduct(product_name, soldby, product_brand) {
  startConnection();
  let data = await connection.promise().query(`select * from farmartproducts where product_name like'%${product_name}%' OR 
        soldby LIKE '%${soldby}%' OR product_brand LIKE '%${product_brand}%' `);
  return data[0];
}









module.exports = {
  registrationdata: async (full_name, email, phone, password, shop_name, shop_url, vendor_phone, registrationType) => registration(full_name, email, phone, password, shop_name, shop_url, vendor_phone, registrationType),
  getcustomerdata: async () => getcustomer(),
  addproductdata: async (product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent, product_image, product_type, product_release, soldby) =>
   
    addproducts(product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent, product_image, product_type, product_release, soldby),
    addreviewdata:async(productid,rating,review,image)=>addreview(productid,rating,review,image),
    getproductsdata: async () => getproducts(),
  getProductByIddata: async (id) => getProductById(id),
  addtocartdata: async (productid, quantity, customerid) => addToCart(productid, quantity, customerid),
  getcartdata: async () => getcart(),
  getcartbyiddata: async (id) => getcartbyid(id),
  getwishlistbyiddata: async (id) => getwishlistbyid(id),
  getcomparebyiddata: async (id) => getcomparebyid(id),
  updatacartquantitydata: async (quantity, productid) => Updatecartquantity(quantity, productid),
  deletecartiteamdata: async (id) => deletecartiteam(id),
  addToWishlistdata: async (productid, customerid) => addToWishlist(productid, customerid),
  getwishlistdata: async () => getwishlist(),
  deletewishlistiteamdata: async (id) => deletewishlistiteam(id),
  addToComparedata: async (productid, customerid) => addToCompare(productid, customerid),
  getcomparedata: async () => getcompare(),
  deletecompareiteamdata: async (id) => deletecompareiteam(id),
  totalpriceofcart : async (qid,totalamt,pid) => totalprice(qid,totalamt,pid),
  searchproductdata: async (product_name, soldby, product_brand) => searchproduct(product_name, soldby, product_brand)

}