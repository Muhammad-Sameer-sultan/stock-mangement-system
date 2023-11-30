// src/app/api/search/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';


export async function GET(request:any) {
  const query= request.nextUrl.searchParams.get("query")
  const uri:any = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

 
  try {
    await client.connect();
    const database = client.db('inventory_managment_system');
    const inventory = database.collection('inventry');
    const products = await inventory.aggregate([{
      $match:{
        $or: [
          { 'product-slug': { $regex:query, $options: 'i' } }, // Case-insensitive regex search
        ],
      }
    }]).toArray()


    return NextResponse.json({products,success: true });
  } catch (error) {
    console.error('Error searching products:', error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
