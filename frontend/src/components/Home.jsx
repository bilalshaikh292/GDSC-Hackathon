import background from "../assets/background.mp4";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [data, setData] = useState({
    imageUrl: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const [isloading, setisloading] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const url = "http://localhost:5000/GDSC";
      const response = await axios.post(url, data);
      setPredictions(response.data.predictions);
      setImageToShow(data.imageUrl);
      setisloading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setisloading(false);
        setError(error.response.data.message);
      }
    }
  };
  return (
    <div className="flex">
      {isloading ? (
        <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-100">
          <div>
            <h1 className="text-2xl">Loading...</h1>
          </div>
        </div>
      ) : (
        <div className="main">
          <div className="overlay"></div>
          <video src={background} autoPlay loop muted />
          <div className="content gap-14">
            <div>
              <h1 className="text-3xl text-center">Welcome</h1>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  type="text"
                  placeholder="imageUrl"
                  name="imageUrl"
                  onChange={handleChange}
                  value={data.imageUrl}
                  required
                  className="text-black py-3 px-2 w-[350px] rounded-md my-7 border-none outline-none"
                />
                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Upload
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-xl mt-4">Predictions:</h2>
              <img
                src={imageToShow}
                alt="Uploaded"
                className="my-4 max-w-[500px] max-h-[500px] object-contain"
              />
              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index}>
                    <strong>{prediction.tagName}:</strong>{" "}
                    {Math.round(prediction.probability * 100)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="content"></div>
          <div></div> */}
        </div>
      )}
    </div>
  );
};

export default Home;
