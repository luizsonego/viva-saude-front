export default function formatarDataBr(dataIso) {
    if (dataIso === null || dataIso === undefined) {
        return 'sem data definida, consulte a gerência';
    }
    // Garante que a data seja tratada como local, não UTC, e remove as horas
    const data = new Date(dataIso + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export function formatarDataBrHora(dataIso) {
    if (dataIso === null || dataIso === undefined) {
        return 'sem data definida, consulte a gerência';
    }
    // Garante que a data seja tratada como local, não UTC, e remove as horas
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}


export function converterSegundosMinutos(segundos) {
    if (segundos <= 0 || segundos === null || segundos === undefined) {
        return 'sem calculo de tempo';
    }
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
}

export function converterSegundosHorasMinutos(segundos) {
    if (segundos <= 0 || segundos === null || segundos === undefined) {
        return 'sem calculo de tempo';
    }
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    if (horas > 0) {
        return `${horas}h ${minutos}m ${segundosRestantes}s`;
    } else if (minutos > 0) {
        return `${minutos}m ${segundosRestantes}s`;
    } else {
        return `${segundosRestantes}s`;
    }
}

export function formatDate(input) {
    if (!input || typeof input !== 'string') return '';
    // Espera-se o formato 'YYYY-MM-DD'
    const parts = input.split('-');
    if (parts.length !== 3) return input;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
}