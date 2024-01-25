import background from "../assets/background.mp4";
import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const Home = () => {
  const [isloading, setisloading] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [file, setFile] = useState(null);

  const [data, setData] = useState({
    imageUrl: "",
    file: null,
  });

  // const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  isDragActive;
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      if (data.imageUrl) {
        const url = "http://localhost:5000/GDSC";
        const response = await axios.post(url, { imageUrl: data.imageUrl });
        setPredictions(response.data.predictions);
        setImageToShow(data.imageUrl);
      } else if (file) {
        const endpoint =
          "https://gdsccustomvission-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/ffa9eb29-7aec-4195-bb1f-e44ae3c639fd/classify/iterations/GDSC%20X-ray%20model/image";
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(endpoint, formData, {
          headers: {
            "Prediction-Key": "05a818d2768d4de39e1eb779332509b3",
            "Content-Type": "application/octet-stream",
          },
        });

        setPredictions(response.data.predictions);
        setImageToShow(URL.createObjectURL(file));
      }
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
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <input
                  type="text"
                  placeholder="imageUrl"
                  name="imageUrl"
                  onChange={handleChange}
                  value={data.imageUrl}
                  className="text-black py-3 px-2 w-[350px] rounded-md my-7 border-none outline-none"
                />
                <h1 className="text-center my-3">OR</h1>

                <div {...getRootProps()} style={dropzoneStyles}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>Drag n drop some files here, or click to select files</p>
                  )}
                </div>

                {file && (
                  <div>
                    <img className="my-5 rounded-lg w-[100px] h-[100px]" src={URL.createObjectURL(file)} alt="Selected" />
                  </div>
                )}

                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Test
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-xl mt-4 text-center">Results.</h2>
              {predictions.length > 0 && (
                <img
                  src={imageToShow}
                  alt="Uploaded"
                  className="my-4 w-[350px] h-[350px] object-contain"
                />
              )}

              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index} className="text-center text-lg">
                    {Math.round(prediction.probability * 100) > 0 && (
                      <>
                        <strong>{prediction.tagName}:</strong>{" "}
                        {Math.round(prediction.probability * 100)}%
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  width: "500px",
  marginBottom:"20px"
};

export default Home;
