import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {TransactionsRepository} from "@/repositories/transactions-repository";

export class PrismaTransactionRepository implements TransactionsRepository {
  async create(data: Prisma.TransactionCreateInput) {
    const transaction = await prisma.transaction.create({
      data
    });

    return transaction;
  }

  async findById(id: number){
    id = typeof id === 'string' ? parseInt(id) : id;
    const transaction = await prisma.transaction.findUnique({
      where: {
        id
      }
    });
    return transaction;
  }

  async refund(id: number) {
    const transaction = this.findById(id);
    if (!transaction) {
      return transaction
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: id
      },
      data: {
        status: "REFUNDED",
        refunded_at: new Date(),
      }
    });

    return updatedTransaction;
  }

  async hopySlit(data: Record<string, any>) {
    const transactionData = data.data
    const transactionId = typeof data.objectId === 'string' ? parseInt(data.objectId) : data.objectId;
    const transaction = await this.findById(data.objectId);
    if (!transaction) {
      return
    }
    await prisma.transaction.update({
      where: {
        id: transactionId
      },
      data: {
        status: transactionData.status
      }
    });
    await prisma.log.create({
      data: {
        transaction_id: transactionData.id,
        event_type: data.type,
        event_payload: JSON.stringify(data),
      }
    });
  }
}