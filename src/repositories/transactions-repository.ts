import {Prisma, Transaction, Log} from "@prisma/client";

export interface TransactionsRepository {
  create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
  findById(id: number): Promise<Transaction|null>;
  refund(id: number): Promise<Transaction | null>;
  hopySlit(data: Record<string, any>): void;
}