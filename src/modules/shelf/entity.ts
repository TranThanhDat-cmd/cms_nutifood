import moment from 'moment';

import ProductEntity from '@modules/product/entity';

class ShelfEntity {
  //copy props from backend:
  name: string = '';
  video: string = '';
  vertical: string = '';
  shelfProducts: ProductEntity[] = [];
  id: string = '';
  createdAt: string = '';
  constructor(shelf: any) {
    if (!shelf) return;
    Object.assign(this, shelf);
    // convert entity type here
    this.createdAt = shelf.createdAt ? moment(shelf.createdAt).format('DD/MM/YYYY') : '';
  }
  static createListShelf(listShelf: Array<any>) {
    if (!Array.isArray(listShelf)) return [];
    return listShelf.map((shelf: ShelfEntity) => {
      return new ShelfEntity(shelf);
    });
  }
}
export default ShelfEntity;

export class ShelfProductDetailEntity {
  product: ProductEntity = new ProductEntity({});
  productId: string = '';
  shelfId?: string = '';
  xDirection: number = 0;
  yDirection: number = 0;
  zDirection: number = 0;
  constructor(shelfProduct: any) {
    if (!shelfProduct) return;
    Object.assign(this, shelfProduct);
    this.product = new ProductEntity(shelfProduct.product);
  }
  static createListShelfProduct(listShelfProduct: Array<any>) {
    if (!Array.isArray(listShelfProduct)) return [];
    return listShelfProduct.map((shelfProduct: ShelfProductDetailEntity) => {
      return new ShelfProductDetailEntity(shelfProduct);
    });
  }
}
