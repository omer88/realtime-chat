const { generateMessage } = require('./message');

//Another option to simulate date - Date class extention
// const constantDate = new Date(12345);

// /*eslint no-global-assign:off*/
// Date = class extends Date {
//   constructor() {
//     return constantDate;
//   }
// };

global.Date = jest.fn(() => ({
  getTime: jest.fn(() => 12345),
}));

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
