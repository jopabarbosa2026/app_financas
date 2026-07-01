export type CategoryType = "receita" | "despesa" | "ambos";
export type TransactionType = "receita" | "despesa";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category_id: string;
  created_at: string;
  categories: Pick<Category, "id" | "name"> | null;
};
