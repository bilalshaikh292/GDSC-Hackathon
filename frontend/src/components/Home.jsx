import background from "../assets/background.mp4";
import axios from "axios";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Home = () => {
  const [data, setData] = useState({
    imageUrl: "",
    file: null,
  });

  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({
          ...file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    }
  }, []);

  console.log(files);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      if (data.imageUrl) {
        const url = "http://localhost:5000/GDSC";
        const response = await axios.post(url, { imageUrl: data.imageUrl });
        setPredictions(response.data.predictions);
        setImageToShow(data.imageUrl);
      } else if (files.length > 0) {
        const url = "http://localhost:5000/GDSC1";
        const formData = new FormData();
        // files.forEach((file, index) => {
        //   formData.append(`image${index + 1}`, file[]);
        // });
        formData.append("image", files[0], files[0].name);
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

  
        setPredictions(response.data.predictions);
        setImageToShow(files[0].preview); // Update as needed
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
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
                <h1 className="my-4">Preview</h1>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                  {files.map((file) => (
                    <li
                      key={file.name}
                      className="relative h-32 rounded-md shadow-lg"
                    >
                      <img src={file.preview} height={100} width={100} />

                      <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                        {file.name}
                      </p>
                    </li>
                  ))}
                </ul>
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
              <h2 className="text-xl mt-4 text-center">Results.</h2>
              {predictions.length > 0 && (
                <img
                  src={imageToShow}
                  alt="Uploaded"
                  className="my-4 max-w-[500px] max-h-[500px] object-contain"
                />
              )}

              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index} className="text-center text-lg">
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

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  width: "500px",
};

export default Home;
