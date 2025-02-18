import {PrismaTransactionRepository} from "@/repositories/prisma/prisma-transaction-repository";
import {TransactionService} from "@/services/transaction";

export function makeTransactionService() {
  const transactionRepository = new PrismaTransactionRepository();
  return new TransactionService(transactionRepository);
}