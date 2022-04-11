import { parseCommit } from './parseCommit';

describe('parseCommit', () => {
  it('parses subject from commit message', () => {
    expect(parseCommit('foo')).toEqual({
      subject: 'foo',
    });
  });

  it('parses type from commit message', () => {
    expect(parseCommit('feat: foo')).toEqual({
      subject: 'foo',
      type: 'feat',
    });
  });

  it('parses scope from commit message', () => {
    expect(parseCommit('feat(bar): foo')).toEqual({
      subject: 'foo',
      type: 'feat',
      scope: 'bar',
    });
  });
});
