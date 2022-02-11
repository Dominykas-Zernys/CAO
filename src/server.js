const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const client = new MongoClient(process.env.url);

app.use(express.json());

app.get('/categories', async (req, res) => {
  try {
    const connection = await client.connect();
    const allCategories = await connection
      .db('caofeb11')
      .collection('categories')
      .find()
      .toArray();
    await connection.close();
    return res.json({ message: 'success', data: allCategories });
  } catch (error) {
    res.json({ message: 'something went wrong', data: error });
  }
});

app.get('/products', async (req, res) => {
  try {
    const connection = await client.connect();
    const allProducts = await connection
      .db('caofeb11')
      .collection('products')
      .find()
      .toArray();
    await connection.close();
    return res.json({
      message: 'success',
      data: allProducts,
    });
  } catch (error) {
    res.json({ message: 'something went wrong', data: error });
  }
});

app.get('/categoryvalue', async (req, res) => {
  try {
    const connection = await client.connect();
    const Guitars = await connection
      .db('caofeb11')
      .collection('products')
      .aggregate([
        // Stage 1: Filter pizza order documents by pizza size
        {
          $match: { category: 'Guitar' },
        },
        // Stage 2: Group remaining documents by pizza name and calculate total quantity
        {
          $group: { _id: '$category', totalQuantity: { $sum: '$price' } },
        },
      ])
      .toArray();
    const Trombones = await connection
      .db('caofeb11')
      .collection('products')
      .aggregate([
        // Stage 1: Filter pizza order documents by pizza size
        {
          $match: { category: 'Trombone' },
        },
        // Stage 2: Group remaining documents by pizza name and calculate total quantity
        {
          $group: { _id: '$category', totalQuantity: { $sum: '$price' } },
        },
      ])

      .toArray();
    await connection.close();
    return res.json({
      message: 'success',
      data: {
        guitars: Guitars[0].totalQuantity,
        trombones: Trombones[0].totalQuantity,
      },
    });
  } catch (error) {
    res.json({ message: 'something went wrong', data: error });
  }
});

app.listen(PORT, console.log('server is running on port ' + PORT));
