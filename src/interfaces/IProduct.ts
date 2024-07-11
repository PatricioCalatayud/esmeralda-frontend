export interface IProduct {
  article_id: number;
  description: string;
  url_img: string;
  price: number;
  stock: number;
  discount?: number;
  averageRating?: number;
  isAvailable?: boolean;
  isDeleted?: boolean;
  categoryId: number;
  size?: string;
  quantity?: number;
  id?: number;
  name?: string;
  imgUrl?: string;
}
