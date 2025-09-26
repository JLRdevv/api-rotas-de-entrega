export function gmtMinus3(date: Date) {
    const now = date.getTime() - 10800000;
    return new Date(now);
}

export function dateFiltering(date: string[]) {
    if (date.length === 1) {
        const parsedDate = stringToDate(date[0]);
        return {
            from: startOfDay(parsedDate),
            to: endOfDay(parsedDate),
        };
    }
    const [date1, date2] = date
        .map(stringToDate)
        .sort((a, b) => a.getTime() - b.getTime());
    return {
        from: startOfDay(date1),
        to: endOfDay(date2),
    };
}

export function dateToString(date: Date): string {
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function stringToDate(dmy: string): Date {
    const [day, month, year] = dmy.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

function startOfDay(date: Date): Date {
    const newDate = new Date(date.getTime());
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
}

function endOfDay(date: Date): Date {
    const newDate = new Date(date.getTime());
    newDate.setUTCHours(23, 59, 59, 999);
    return newDate;
}
