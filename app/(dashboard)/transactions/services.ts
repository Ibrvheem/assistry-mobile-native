// services/transactions.ts
import api from "@/lib/api";
type TxType = 'credit' | 'debit';

export async function getTxs(type?: TxType, page = 1, limit = 20) {
  const params: Record<string, any> = { page, limit };
  // Only include type param when it's provided (omit for "all")
  if (type) params.type = type;

  const response = await api.get('wallet/transactions', { params });
  // // console.log('DA45', response.data);
  return response.data;
}

export async function getDebitTx(page = 1, limit = 20) {
  const txs = await getTxs('debit', page, limit);
  // // // console.log('TXS', txs);
  return txs
}

export async function getCreditTx(page = 1, limit = 20) {
  const txs = await getTxs('credit', page, limit);
  // // // console.log('TXS', txs);
  return txs
}

export async function getAllTx(page = 1, limit = 20) {
  const txs = await getTxs(undefined, page, limit);
  // // console.log('TXS_data', txs);
  return txs
}
