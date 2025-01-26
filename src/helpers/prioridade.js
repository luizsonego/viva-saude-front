const prioridadeT = {
  0: "Baixa",
  1: "Média",
  2: "Alta",
};

export default function getPrioridade(p) {
  return prioridadeT[p];
}
