const { generateMessage, generateLocationMessage } = require('./message');

//Another option to simulate date - Date class extention
// const constantDate = new Date(12345);

// /*eslint no-global-assign:off*/
// Date = class extends Date {
//   constructor() {
//     return constantDate;
//   }
// };

// global.Date = jest.fn(() => ({
//   getTime: jest.fn(() => 12345),
// }));

jest.mock('moment', () => {
  return jest.fn(() => {
    return {
      valueOf: jest.fn(() => 12345),
    };
  });
});

describe('Generate Message', () => {
  test('should generate correct message object', () => {
    const result = generateMessage('Omer', 'Hi there');
    expect(result).toEqual({
      from: 'Omer',
      text: 'Hi there',
      createdAt: 12345,
    });
  });
});

describe('Generate Location Message', () => {
  test('should generate correct location message object', () => {
    const lat = 1;
    const long = 2;
    const result = generateLocationMessage('Omer', lat, long);
    expect(result).toEqual({
      from: 'Omer',
      url: `https://www.google.com/maps?q=${lat},${long}`,
      createdAt: 12345,
    });
  });
});
