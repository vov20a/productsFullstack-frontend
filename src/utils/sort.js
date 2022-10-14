export const sortMode = (type, sortArray) => {
    type.includes('title')
        ? type.includes('-') ? sortArray = [...sortArray].sort((a, b) =>
            a[type.replace("-", "")].localeCompare(b[type.replace("-", "")]))
            : sortArray = [...sortArray].sort((a, b) =>
                b[type.replace("-", "")].localeCompare(a[type.replace("-", "")]))
        : type.includes('-') ? sortArray = [...sortArray].sort((a, b) => a[type.replace("-", "")] - b[type.replace("-", "")]) :
            sortArray = [...sortArray].sort((a, b) => b[type.replace("-", "")] - a[type.replace("-", "")])
        ;
    return sortArray;
}

