import {expect, describe, it, beforeEach} from 'vitest';
import {RegisterService} from "@/services/register";
import {compare} from "bcryptjs";
import {InMemoryUsersRepository} from "@/repositories/in-memory/in-memory-users-repository";
import {UserAlreadyExistsError} from "@/services/errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let registerService: RegisterService;

describe('register', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerService = new RegisterService(usersRepository);
  })


  it('should be able to register', async () => {
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'teste@email.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password', async () => {
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'teste@email.com',
      password: '123456'
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'teste@email.com';

    await registerService.execute({
      name: 'John Doe',
      email: email,
      password: '123456'
    });

    await expect(() =>
      registerService.execute({
        name: 'John Doe2',
        email: email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

});
