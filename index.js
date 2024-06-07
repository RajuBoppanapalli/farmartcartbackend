
let express = require("express");

let db_connction = require("./db_connection")

//import cros
let cors = require("cors");

const formidable = require('express-formidable');

const path = require('path');
const fs = require('fs');


let app = express();

app.use(cors());

app.use(formidable());

app.listen(4002);






app.get("/employee", (req, res) => {
     res.write("express api");
     res.end();
})


app.get("/customers", async (req, res) => {
     let data = await db_connction.getcustomerdata();
     res.write(JSON.stringify(data));
     res.end();
})

app.post("/register", async (req, res) => {
     const { full_name, email, phone, password, registrationType, shop_name, shop_url, vendor_phone, } = req.fields;
     await db_connction.registrationdata(full_name, email, phone, password, shop_name, shop_url, vendor_phone, registrationType
     );

     res.end();
});

app.post("/add-product", async (req, res) => {
     const { product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent,  product_image, product_type, product_release, soldby } = req.fields
     await db_connction.addproductdata(product_name, product_brand, newprice, oldprice, available, categories, sku, offer_percent, product_image, product_type, product_release, soldby);
     res.end();

});
app.post("/add-review", async (req, res) => {
     const { productid,rating,review,image } = req.fields
     await db_connction.addreviewdata(productid,rating,review,image);
     res.end();

});

app.get("/getproduts", async (req, res) => {
     let data = await db_connction.getproductsdata();
     res.write(JSON.stringify(data));
     res.end();

})

app.get("/getproduts/:id", async (req, res) => {
     let { id } = req.params;
     const data = await db_connction.getProductByIddata(id);
     res.write(JSON.stringify(data));
     res.end();

})

app.post("/totalamtupdate",async (req, res) => {
     const {qid, totalamt, pid} =req.fields
     await db_connction.totalpriceofcart(qid, totalamt, pid)
     res.end()
})

app.post("/addtocart", async (req, res) => {
     const { productid, quantity, customerid } = req.fields;
     console.log({ productid, customerid });
     await db_connction.addtocartdata(productid, quantity, customerid);
     res.end();
});

//create get api for addto cart

app.get("/getcartdata", async (req, res) => {

     let data = await db_connction.getcartdata();
     res.write(JSON.stringify(data));
     res.end();

})
app.get("/getcartdata/:id", async (req, res) => {
     const id = req.params.id;
     try {
          let data = await db_connction.getcartbyiddata(id);
          res.json(data);
     } catch (error) {
          console.error("Error fetching cart data:", error);
          res.status(500).json({ error: "Internal Server Error" });
     }

})



app.delete("/cart/del/:id", async (req, res) => {
     const id = req.params.id;
     console.log(id);
     await db_connction.deletecartiteamdata(id);
     console.log("delete cart");
     res.end();
})

app.post("/addtowishlist", async (req, res) => {
     const { productid, customerid } = req.fields;
     console.log({ productid, customerid });
     await db_connction.addToWishlistdata(productid, customerid);

     res.end();
});

app.get("/wishlistdata", async (req, res) => {
     let data = await db_connction.getwishlistdata();
     res.write(JSON.stringify(data));
     res.end();
})
app.get("/getwishlistdata/:id", async (req, res) => {
     const id = req.params.id;
     try {
          let data = await db_connction.getwishlistbyiddata(id);
          res.json(data);
     } catch (error) {
          console.error("Error fetching cart data:", error);
          res.status(500).json({ error: "Internal Server Error" });
     }

})


//create delete wishlist iteam api
app.delete("/wishlist/del/:id", async (req, res) => {
     const id = req.params.id;
     console.log(id);
     await db_connction.deletewishlistiteamdata(id);
     console.log("delete wishlist");
     res.end();
})


app.post("/addtocompare", async (req, res) => {
     const { productid, customerid } = req.fields;
     console.log({ productid, customerid });
     await db_connction.addToComparedata(productid, customerid);
     res.end();
});
app.get("/comparedata", async (req, res) => {
     let data = await db_connction.getcomparedata();
     res.write(JSON.stringify(data));
     res.end();
})
app.get("/getcomparedata/:id", async (req, res) => {
     const id = req.params.id;
     try {
          let data = await db_connction.getcomparebyiddata(id);
          res.json(data);
     } catch (error) {
          console.error("Error fetching cart data:", error);
          res.status(500).json({ error: "Internal Server Error" });
     }

})

app.delete("/compare/del/:id", async (req, res) => {
     const id = req.params.id;
     console.log(id);
     await db_connction.deletecompareiteamdata(id);
     console.log("delete wishlist");
     res.end();
})


app.post("/searchproduct", async (req, res) => {
     let { product_name, soldby, product_brand } = req.fields
     let data1 = await db_connction.searchproductdata(product_name, soldby, product_brand);
     res.write(JSON.stringify(data1));

     res.end();

})








