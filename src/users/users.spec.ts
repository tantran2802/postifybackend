import { Users } from './user.entity';

describe('Users', () => {
  it('should be defined', () => {
    expect(new Users()).toBeDefined();
  });
});
