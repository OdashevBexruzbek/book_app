// react imports
import { useEffect } from "react";

// react redux
import { useSelector } from "react-redux";
import axiosClient from "../utils/axios";

function About() {
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      axiosClient.get("/books");
    }
  }, []);
  return <div>About</div>;
}

export default About;
