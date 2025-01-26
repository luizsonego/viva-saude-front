import api from "../../services/api";

const putAgendamento = async (values) => {
  console.log("ENVIANDO: ", values);
  try {
    const data = await api.post(
      `${process.env.REACT_APP_API}/v1/update/agendamento`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            process.env.REACT_APP_ACCESS_TOKEN
          )}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export function useUpdateAgendamento(data) {
  return putAgendamento(data);
}
