const statusT = {
  0: "Pendente",
  1: "Agendado",
  2: "Concluído",
  3: "Cancelado",
};

export default function getStatus(status) {
  return statusT[status];
}
