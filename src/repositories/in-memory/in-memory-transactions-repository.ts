import {Prisma, Transaction, User} from "@prisma/client";
import {TransactionsRepository} from "@/repositories/transactions-repository";

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = [];

  async findById(id: number) {
    const transaction = this.items.find(item => item.id === id);
    if (!transaction) {
      return null;
    }
    return transaction;
  }

  async create(data: Prisma.TransactionCreateInput) {
    const transaction = {
      id: 1,
      transaction_id: null,
      amount: data.amount,
      currency: data.currency,
      payment_method: data.payment_method,
      description: data.description || null,
      customer_name: data.customer_name || null,
      customer_email: data.customer_email || null,
      status: "PENDING",
      created_at: new Date(),
      updated_at: new Date(),
      refunded_at: null,
    }
    this.items.push(transaction);
    return transaction;
  }

  async refund(id: number) {
    const transaction = this.items.find(item => item.id === id);
    if (!transaction) {
      return null;
    }
    transaction.status = "REFUNDED";
    transaction.refunded_at = new Date();
    return transaction;
  }

  async hopySlit(data: Record<string, any>) {
    const transaction = this.items.find(item => item.id === data.id);
    if (!transaction) {
      return null;
    }
    transaction.status = "REFUNDED";
    transaction.refunded_at = new Date();
  }
}