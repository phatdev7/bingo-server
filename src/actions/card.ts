import shuffle from 'shuffle-array';
import RoomTicket, { IRoomTicket, ITicket } from 'src/models/room_ticket';

interface IResult {
  matrix: (
    | number
    | {
        value: number;
        status: string;
      }[]
  )[];
  num_of_column: number;
  num_of_row: number;
  num_of_win: number;
}

export const generate: (
  numOfColumn: number,
  numOfRow: number,
  numOfWin: number,
) => Promise<IResult> = async (numOfColumn, numOfRow, numOfWin) => {
  try {
    const data = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
    for (let y = 0; y < numOfRow; y++) {
      const row = [];
      for (let x = 0; x < newData.length; x++) {
        row.push(newData[x][y]);
      }
      normalize.push(row);
    }

    const matrix = normalize.reduce((prev, row) => {
      const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, row.length);
      const rd = shuffle.pick(options, { picks: numOfWin });
      const expelCell = row.map((cell, index) => {
        if (rd.includes(index)) {
          return {
            value: cell,
            status: 'available',
          };
        }
        return {
          value: cell,
          status: 'hidden',
        };
      });
      return [...prev, expelCell];
    }, []);

    const result: IResult = {
      matrix,
      num_of_column: numOfColumn,
      num_of_row: numOfRow,
      num_of_win: numOfWin,
    };

    return result;
  } catch (err) {
    throw err;
  }
};

export const getTicketList: (
  user_id: string,
) => Promise<ITicket[]> = async user_id => {
  try {
    const roomTicket = await RoomTicket.find();
    const cards: ITicket[] = [];
    roomTicket.forEach((element: IRoomTicket) => {
      const list = element.tickets
        .filter((item: ITicket) => item.user._id === user_id)
        .map((item: ITicket) => ({
          ...item,
          room_id: element.room_id,
          title: element.title,
        }));
      cards.push(...list);
    });
    return cards;
  } catch (err) {
    throw err;
  }
};
