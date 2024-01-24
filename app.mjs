import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json())

app.get("/",(req,res) => {
    res.send("Hello World") 
 });

 
app.post('/GDSC', async (req, res) => {
    try {
      const imageUrl = req.body.imageUrl; 

      const predictionEndpoint =  process.env.AZUREENDPOINTURL;
      const predictionKey =  process.env.APIKEY;
  
      const response = await axios.post(
        predictionEndpoint,
        {
          Url: imageUrl,
        },
        {
          headers: {
            'Prediction-Key': predictionKey,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const predictions = response.data.predictions;
      res.json({ predictions });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json(error.message);
    }
  });

export default app;