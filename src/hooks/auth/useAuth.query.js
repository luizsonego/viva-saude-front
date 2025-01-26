import axios from "axios";

const postAuth = async (values) => {
  try {
    const data = await axios.post(
      `${process.env.REACT_APP_API}/site/login`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: function (status) {
          return true;
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useLoginRequest(data) {
  return postAuth(data);
}
