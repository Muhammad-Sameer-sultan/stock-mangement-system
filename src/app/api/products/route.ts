import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const { MongoClient } = require("mongodb");
// s@meer
// sameer
const uri = process.env.MONGODB_URI;
export async function GET() {
  // Replace the uri string with your connection string.
  // const uri = "mongodb+srv://sameer:" + encodeURIComponent("s@meer") + "@cluster0.3kswfzx.mongodb.net/";
  // const uri = "mongodb://localhost:27017/inventory_managment_system";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("inventory_managment_system");
    const inventory = database.collection("inventry");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const allProucts = await inventory.find(query).toArray();

    // console.log(allProucts);
    return NextResponse.json({ allProucts, success: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request: any) {
  const body = await request.json();
  // console.log("body==>",body)
  // Replace the uri string with your connection string.

  const client = new MongoClient(uri);
  // Check if required fields are present in the request body
  const requiredFields = ["date", "price", "product-slug", "quantity"];
  const missingFields = requiredFields.filter((field) => {
    const value = body[field];
    return value === "" || value === 0;
  });

  if (missingFields.length > 0) {
    return new Response(
      `Missing or invalid values for required fields: ${missingFields.join(
        ", "
      )}`,
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await client.connect();

    const database = client.db("inventory_managment_system");
    const inventory = database.collection("inventry");

    // Insert the new product into the collection
    const newProduct = await inventory.insertOne(body);
    return NextResponse.json({ newProduct, success: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// export async function DELETE(request: any) {
//   try {
//     const body =  await request.json() ;
//     console.log("body",body.id)
//     console.log("body",body)
//     if (!body.id) {
//       return NextResponse.json({ success: false, message: "Invalid request format" });
//     }

//     const client = new MongoClient(uri);

//     try {
//       await client.connect();

//       const database = client.db("inventory_managment_system");
//       const inventory = database.collection("inventry");

//       console.log("invent",inventory.json())
//       const result = await inventory.deleteOne({ _id: body.id });

//       if (result.deletedCount === 1) {
//         return NextResponse.json({ success: true, deletedCount: result.deletedCount });
//       } else {
//         return NextResponse.json({ success: false, message: "Product not found or not deleted" });
//       }
//     } finally {
//       await client.close();
//     }
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json({ success: false, message: "Internal server error" });
//   }
// }

export async function PUT(request: any) {

  const {id, newSlug , newPrice,newQuantity} = await request.json();
 

  const client = new MongoClient(uri);

  try {

    const database = client.db("inventory_managment_system");
    const inventory = database.collection("inventry");
    const filter = { _id: new ObjectId(id) };

const updateDoc={
  $set:{
    price: newPrice,
    ['product-slug']: newSlug,
    quantity: newQuantity

  }
}
const result = await inventory.updateOne(filter,updateDoc);
    return NextResponse.json({success: true ,message:`${result.matchedCount} doucument match the filter, updated ${result.modifiesCount} document(s) `});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function DELETE(request: any) {

  const {id} = await request.json();
 

  const client = new MongoClient(uri);

  try {

    const database = client.db("inventory_managment_system");
    const inventory = database.collection("inventry");


const result = await inventory.deleteOne({"_id": new ObjectId(id) });

console.log(result)
    return NextResponse.json({success: true ,message:`delted from database successfully `});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


