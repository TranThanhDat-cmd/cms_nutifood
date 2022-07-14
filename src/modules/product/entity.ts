import moment from 'moment';

class ProductEntity {
  //copy props from backend:
  id: string = '';
  name: string = '';
  detail: string = '';
  story: string = '';
  nutritionInfo: string = '';
  image: any = '';
  thumbnail: any = '';
  productRecommends: any = [];
  shelfProducts: any = [];
  buyLink: string = '';
  createdAt: string = '';
  shelfId: string = '';
  xDirection: number | undefined;
  yDirection: number | undefined;
  preferredProduct: number | undefined;
  productSuitables: any = [];

  constructor(product: any) {
    if (!product) return;
    Object.assign(this, product);
    // convert entity type here
    this.createdAt = product.createdAt ? moment(product.createdAt).format('DD/MM/YYYY') : '';
    this.productRecommends = product.productRecommends
      ? product.productRecommends.map(pt => pt.productCategoryId)
      : [];
    this.shelfId = product.shelfProducts ? product.shelfProducts.map(pt => pt.shelfId) : '';
    this.xDirection = product.shelfProducts
      ? product.shelfProducts.map(pt => pt.xDirection)
      : undefined;
    this.yDirection = product.shelfProducts
      ? product.shelfProducts.map(pt => pt.yDirection)
      : undefined;
    this.preferredProduct = product.shelfProducts
      ? product.shelfProducts.map(pt => pt.zDirection)
      : undefined;
    this.productSuitables = product.productSuitables
      ? product.productSuitables.map(pt => pt.idMapping)
      : [];
  }
  static createListProduct(listProduct: Array<any>) {
    if (!Array.isArray(listProduct)) return [];
    return listProduct.map((product: ProductEntity) => {
      return new ProductEntity(product);
    });
  }
}
export default ProductEntity;
