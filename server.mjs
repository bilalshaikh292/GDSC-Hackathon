import app from './app.mjs';
import config from './config.mjs';

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000; 

app.listen( PORT,() => {
    console.log(`server is listeinig at http://localhost:${PORT}`);
    }); 