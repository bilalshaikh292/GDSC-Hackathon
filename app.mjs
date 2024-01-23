import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get("/",(req,res) => {
    res.send("Hello World") 
 });

 
app.post('/GDSC', async (req, res) => {
    try {
      const imageUrl = req.body.imageUrl; 

      const predictionEndpoint =  process.env.AZUREENDPOINT + 'customvision/v3.0';
      const predictionKey =  process.env.APIKEY;
  
      const response = await axios.post(
        `${predictionEndpoint}/classify/iterations/88624425-05bc-4576-90e8-d4523fd7b9ac/image`,
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