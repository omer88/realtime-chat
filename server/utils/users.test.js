const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      { id: 1, name: 'Mike', room: 'Node Course' },
      { id: 2, name: 'Jen', room: 'React Course' },
      { id: 3, name: 'John', room: 'Node Course' },
    ];
  });
  test('should add new user', () => {
    const users = new Users();
    const user = {
      id: 123,
      name: 'Omer',
      room: 'My room',
    };
    const reUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
    expect(reUser).toEqual(user);
  });

  test('should return names from Node Course', () => {
    const usersList = users.getUserList('Node Course');
    expect(usersList).toEqual(['Mike', 'John']);
  });

  test('should remove user', () => {
    const userId = 2;
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users).toHaveLength(2);
  });

  test('should not remove user', () => {
    const userId = 42;
    const user = users.removeUser(userId);
    expect(user).toBeFalsy();
    expect(users.users).toHaveLength(3);
  });

  test('should find user', () => {
    const userId = 2;
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  test('should not find user', () => {
    const userId = 42;
    const user = users.getUser(userId);
    expect(user).toBeFalsy();
  });
});
