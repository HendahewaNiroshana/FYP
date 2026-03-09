const mongoose = require("mongoose");
const Document = require("./models/Document");
require("dotenv").config();



const HF_API_KEY = process.env.HF_API_KEY;
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

// 🔹 Create embedding
async function createEmbedding(text) {
  const res = await fetch(
    `https://api-inference.huggingface.co/pipeline/feature-extraction/${EMBEDDING_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }), // 👈 wrap inside { inputs: ... }
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HF API Error: ${res.status} ${errText}`);
  }

  const data = await res.json();

  // HuggingFace sometimes returns [[numbers]] (2D array), so flatten if needed
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data[0];
  }
  return data;
}





async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding");

    const docs = [
      {
        title: "Health Benefits of Cinnamon",
        content:
          "Cinnamon helps regulate blood sugar, improves digestion, and has antioxidant properties.",
      },
      {
        title: "Cinnamon in Cooking",
        content:
          "Cinnamon is widely used in desserts, curries, drinks, and even bread for its unique flavor.",
      },
      {
        title: "Cinnamon in Traditional Medicine",
        content:
          "In Ayurveda and Chinese medicine, cinnamon has been used for thousands of years to treat cold, cough, and digestive issues.",
      },
      {
        title: "Types of Cinnamon",
        content:
          "There are mainly two types of cinnamon: Ceylon Cinnamon (True Cinnamon) and Cassia Cinnamon. Ceylon is healthier and sweeter.",
      },
    ];

    for (let doc of docs) {
      console.log(`🔹 Creating embedding for: ${doc.title}`);
      const embedding = await createEmbedding(doc.content);

      const newDoc = new Document({
        title: doc.title,
        content: doc.content,
        embedding: embedding,
      });

      await newDoc.save();
      console.log(`✅ Inserted: ${doc.title}`);
    }

    console.log("🎉 Seeding completed!");
  } catch (err) {
    console.error("❌ Error in seeding:", err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
