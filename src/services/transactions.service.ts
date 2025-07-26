import { feClient } from './clients';

export interface ITransaction {
  transactionId: string;
  amount: number;
  transactionDate: string;
  status: string;
  userName: string;
  shopName: string;
}

export interface ITransactionResponse {
  totalCount: number;
  items: ITransaction[];
  pageIndex: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const fetchTransactions = async (pageIndex: number, pageSize: number): Promise<ITransactionResponse> => {
  const response = await feClient.get<ITransactionResponse>('/Payment/transactions', {
    params: {
      PageNumber: pageIndex,
      PageSize: pageSize
    }
  });
  return response.data;
}; 