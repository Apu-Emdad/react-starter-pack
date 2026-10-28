import { describe, expect, it } from 'vitest';
import { registerSchema } from './register.schema';

const valid = {
  userName: 'apu_emdad',
  email: 'apu@mail.com',
  password: 'correct-horse',
  confirmPassword: 'correct-horse',
};

describe('registerSchema', () => {
  it('accepts valid values and lowercases the user name and email', () => {
    const result = registerSchema.parse({
      ...valid,
      userName: ' Apu_Emdad ',
      email: 'APU@Mail.com',
    });
    expect(result.userName).toBe('apu_emdad');
    expect(result.email).toBe('apu@mail.com');
  });

  it.each([
    ['a short user name', { userName: 'ab' }],
    ['a user name with spaces', { userName: 'apu emdad' }],
    ['an invalid email', { email: 'not-an-email' }],
    ['a short password', { password: 'short', confirmPassword: 'short' }],
  ])('rejects %s', (_label, patch) => {
    expect(registerSchema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });

  it('rejects a confirm password that does not match', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'other-password',
    });
    expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
  });
});
