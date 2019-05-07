export function dateFormatter(date: any, isLocal: boolean) {
    const d = new Date(date);

    const month = new Array(12);
    month[0] = '01';
    month[1] = '02';
    month[2] = '03';
    month[3] = '04';
    month[4] = '05';
    month[5] = '06';
    month[6] = '07';
    month[7] = '08';
    month[8] = '09';
    month[9] = '10';
    month[10] = '11';
    month[11] = '12';

    let myDate = d.getDate().toString();
    myDate = myDate.length === 1 ? `0${myDate}` : myDate;
    const myMonth = month[d.getMonth()];
    const myYear = d.getFullYear();
    const fullDateFormat = isLocal ? `${myDate}-${myMonth}-${myYear}` : `${myYear}-${myMonth}-${myDate}`;

    return fullDateFormat;
}

export function localSpliter(date: any, isLocal: boolean) {
    const d = date.split('-');
    const fullDate = isLocal ? d : `${d[2]}-${d[1]}-${d[0]}`;

    return fullDate;
}
