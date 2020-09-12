import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import Account from '../entities/account.entity';
import jwt from 'jsonwebtoken';
import { JWT_PUBLIC_KEY, JWT_PRIVATE_KEY } from '../config';
import bcrypt from 'bcryptjs';
import { Context } from 'koa';

@Resolver()
export class AccountResolver {
  @Authorized()
  @Query(() => [Account])
  accounts(): Promise<Account[]> {
    return Account.find();
  }

  @Authorized()
  @Query(() => Account)
  async account(@Arg('id') id: string): Promise<Account | boolean> {
    return (await Account.findOne({ where: { id } })) || false;
  }

  @Authorized()
  @Mutation(() => Account)
  async createAccount(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<Account> {
    const passwordHash = await bcrypt.hash(password, 10);

    const account = Account.create({
      firstName,
      lastName,
      email,
      passwordHash
    });

    await account.save();
    return account;
  }

  @Authorized()
  @Mutation(() => Account)
  async updateAccount(
    @Ctx() ctx: Context,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string
  ): Promise<Account> {
    const account = await Account.findOne({
      where: { id: ctx.state.user.id }
    });

    if (!account) throw new Error(`Account doesn't exist`);

    Object.assign(account, { firstName, lastName, email });

    await account.save();
    return account;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    const account = await Account.findOne({
      where: { id: ctx.state.user.id }
    });
    if (!account) throw new Error(`Account doesn't exist`);

    await account.remove();
    return true;
  }

  @Query(() => Boolean)
  async logIn(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<boolean> {
    const account = await Account.findOne({ where: { email } });
    if (!account) return false;

    const correctPassword = await bcrypt.compare(
      password,
      account.passwordHash
    );

    if (correctPassword) {
      ctx.cookies.set(
        JWT_PUBLIC_KEY,
        jwt.sign({ id: account.id }, JWT_PRIVATE_KEY, { expiresIn: '2d' }),
        { secure: false, httpOnly: true }
      );

      return true;
    }
    return false;
  }

  @Query(() => Boolean)
  @Authorized()
  async logOut(@Ctx() ctx: Context): Promise<boolean> {
    ctx.cookies.set(JWT_PUBLIC_KEY);
    return true;
  }

  @Authorized()
  @Query(() => Account)
  async currentAccount(@Ctx() ctx: Context): Promise<Account | boolean> {
    return (
      (await Account.findOne({ where: { id: ctx.state.user.id } })) || false
    );
  }
}
