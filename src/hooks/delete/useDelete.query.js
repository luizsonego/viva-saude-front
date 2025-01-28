import api from "../../services/api";

const deleteMedico = async (values) => {
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/delete/medico?id=${values}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useMedicoDelete(data) {
  return deleteMedico(data);
}
