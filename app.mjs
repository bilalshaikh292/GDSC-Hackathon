import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';

const app = express();



app.use(cors());
app.use(express.json())

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

  app.post('/GDSC1', upload.single('image'), async (req, res) => {
    try {
      const image = req.file;
  
      if (!image) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const predictionEndpoint = process.env.AZUREENDPOINTURL;
      const predictionKey = process.env.APIKEY;

      const formData = new FormData();
      formData.append('image', image.buffer, {
        filename: image.originalname,
      });
  

  
      const response = await axios.post(
        predictionEndpoint,
        formData,
        {
          headers: {
            'Prediction-Key': predictionKey,
            'Content-Type': 'application/octet-stream',
          },
        }
      );
  
      const predictions = response.data.predictions;
      res.json({ predictions });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: error.message });
    }

  });



export default app;