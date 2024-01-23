import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(cors());

app.get("/",(req,res) => {
    res.send("Hello World") 
 });

 
app.post('/GDSC', async (req, res) => {
    try {
      //const imageUrl = req.body.imageUrl; 

      const predictionEndpoint =  process.env.AZUREENDPOINT + 'customvision/v3.0';
      const predictionKey =  process.env.APIKEY;
  
      const response = await axios.post(
        'LINK TO API',
        {
          Url: "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eCUyMHJheXxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          headers: {
            'Prediction-Key': 'YOUR SECRET Key',
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