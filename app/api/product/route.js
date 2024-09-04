// API handlers
import { connectToDatabase } from "../mongo/route";
import { ObjectId } from "mongodb";

// GET request handler
export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Fetch all products from the collection
    const products = await db.collection("products").find({}).toArray();

    // Send the products data as a response
    return new Response(
      JSON.stringify({ message: "Products fetched successfully", products }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST request handler
export async function POST(request) {
  try {
    // Parse the incoming JSON data from the request body
    const data = await request.json();

    // Validate data
    if (!data.productName || !data.quantity || !data.price) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    // Insert data into the MongoDB collection
    await collection.insertOne(data);

    // Send a success response
    return new Response(
      JSON.stringify({ message: "Product added successfully", data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(request) {
  try {
    // Parse the incoming request URL to extract the product ID
    const url = new URL(request.url);
    const productId = url.searchParams.get("id"); // Extract product ID from query parameters

    // Validate that the ID was provided
    if (!productId) {
      return new Response(
        JSON.stringify({ message: "Product ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    // Delete the product with the specified ID
    const result = await collection.deleteOne({ _id: new ObjectId(productId) });

    // Check if a product was deleted
    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send a success response
    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return new Response(
      JSON.stringify({ message: "Error processing delete request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(request) {
  try {
    // Parse the incoming JSON data from the request body
    const {quantity, price } = await request.json();
    const url = new URL(request.url);
    const productId = url.searchParams.get("id"); // Extract product ID from query parameters

    // Validate data
    if (!productId || quantity == null || price == null) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    const { db, client } = await connectToDatabase();
    const collection = db.collection("products");

    // Update the quantity and price without changing the product name
    const result = await collection.updateOne(
      { _id: new ObjectId(productId) }, // Find by product ID
      { $set: { quantity: parseInt(quantity), price: parseFloat(price) } } // Update fields
    );


    // Check if the update was successful
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return new Response(
      JSON.stringify({ message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}