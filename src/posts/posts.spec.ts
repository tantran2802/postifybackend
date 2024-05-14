import { Posts } from './post.entity';

describe('Posts', () => {
  it('should be defined', () => {
    expect(new Posts()).toBeDefined();
  });
});
