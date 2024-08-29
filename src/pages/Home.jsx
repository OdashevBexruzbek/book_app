import axiosClient from "../utils/axios";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa"; // Import icons

function Home() {
  const titleRef = useRef();
  const publishRef = useRef();
  const authorRef = useRef();
  const factsRef = useRef();
  const imageRef = useRef();
  const [books, setProducts] = useState([]);
  const [productErrors, setProductErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const currentUserId = window.localStorage.getItem("userId");

  useEffect(() => {
    axiosClient
      .get("/books", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      title: titleRef.current.value,
      price: publishRef.current.value,
      author: authorRef.current.value,
      facts: factsRef.current.value,
      image: imageRef.current.value,
      userId: currentUserId,
    };

    axiosClient
      .post("/books", newProduct, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProducts((prevProducts) => [...prevProducts, response.data]);
        titleRef.current.value = "";
        publishRef.current.value = "";
        authorRef.current.value = "";
        factsRef.current.value = "";
        imageRef.current.value = "";
        setCreateModalOpen(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (product) => {
    if (product.userId !== currentUserId) {
      setProductErrors((prevErrors) => ({
        ...prevErrors,
        [product.id]: "You cannot delete this",
      }));
      return;
    }

    axiosClient
      .delete(`/books/${product.id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== product.id)
        );
        setProductErrors((prevErrors) => ({
          ...prevErrors,
          [product.id]: null,
        }));
      })
      .catch((error) => console.log(error));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-10 w-full ">
      <button
        onClick={openCreateModal}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-8 flex items-center transition-all duration-300"
      >
        <FaPlus className="inline mr-2" /> Add Books
      </button>

      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-lg shadow-lg mb-8 w-full max-w-lg ${
          createModalOpen ? "block" : "hidden"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Book Name
          </label>
          <input
            type="text"
            ref={titleRef}
            className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:border-green-500 transition-all duration-300"
            placeholder="Enter book name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Published Year
          </label>
          <input
            type="number"
            ref={publishRef}
            className="shadow-sm bg-red appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:border-green-500 transition-all duration-300"
            placeholder="Enter book published"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Author name
          </label>
          <input
            type="text"
            ref={authorRef}
            className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:border-green-500 transition-all duration-300"
            placeholder="Enter book author"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Book Facts
          </label>
          <input
            type="text"
            ref={factsRef}
            className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:border-green-500 transition-all duration-300"
            placeholder="Enter book facts"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Book Image
          </label>
          <input
            type="url"
            ref={imageRef}
            className="shadow-sm appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:border-green-500 transition-all duration-300"
            placeholder="Enter book image"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300"
        >
          Submit
        </button>
        <button
          onClick={closeCreateModal}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-300"
        >
          <FaTimes className="inline mr-2" /> Cancel
        </button>
      </form>

      <div className="">
          <div className="books-grid">
            {books.length > 0 ? (
              books.map((books) => (
                <div
                  key={books.id}
                  className="w-80 flex justify-between bg-white p-6 rounded-lg shadow-lg mb-4 border border-gray-300 transition-all duration-300"
                >
                  <div className="">
                    <img src={books.image} alt="book image" className="mb-5 w-80 h-72"/>
                    <h2 className="text-sm font-semibold text-orange-400">
                      <span className="text-orange-600">Book name:</span>{" "}
                      {books.title}
                    </h2>
                    <p className="text-orange-400">
                      <span className="text-orange-600">Author:</span>{" "}
                      {books.author}
                    </p>
                    <p className="text-orange-400">
                      <span className="text-orange-600">Published:</span>{" "}
                      {books.published}
                    </p>
                    <p className="text-orange-400">
                      <span className="text-orange-600">Facts:</span>{" "}
                      {books.facts}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => openModal(books)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition-all duration-300"
                      >
                        <FaEye className="inline mr-2" /> View
                      </button>
                      <button
                        onClick={() => handleDelete(books)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition-all duration-300"
                      >
                        <FaTrashAlt className="inline mr-2" /> Delete
                      </button>
                      {productErrors[books.id] && (
                        <p className="text-red-600 mt-2 text-sm">
                          {productErrors[books.id]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="ml-96 -mr-10 w-72  text-red-600">
                You have not added a book yet
              </p>
            )}
          </div>
        
      </div>

      {/* Modal for product details */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative z-50">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedProduct.title}
            </h2>

            <p className="text-gray-700 text-lg">
              Author: {selectedProduct.author}
            </p>
            <img src={selectedProduct.image} alt="book image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
