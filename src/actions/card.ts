import shuffle from 'shuffle-array';

export const generate = async (numOfColumn: number, numOfWin: number) => {
  try {
    const data = [
      [null, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
      [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
      [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
      [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
      [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
      [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    ];

    const newData: number[][] = [];
    for (let i = 0; i < numOfColumn; i++) {
      const col = shuffle(data[i]);
      newData.push(col);
    }

    const normalize: number[][] = [];
    for (let y = 0; y < newData[1].length; y++) {
      const row = [];
      for (let x = 0; x < newData.length; x++) {
        row.push(newData[x][y]);
      }
      normalize.push(row);
    }

    const result = normalize.reduce((prev, row) => {
      return [...prev, expelRow(row, numOfWin)];
    }, []);

    return result;
  } catch (err) {
    throw err;
  }
};

const expelRow: (data: number[], num: number) => void = (data, num) => {
  const newData = data.filter(Number);
  if (newData.length > num) {
    const random = Math.floor(Math.random() * newData.length);
    const kk = [...newData.slice(0, random), ...newData.slice(random + 1, newData.length)];
    return expelRow(kk, num);
  } else {
    return newData;
  }
};
