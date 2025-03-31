export default function formatarDataBr(dataIso) {
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(',', '');
  }
  