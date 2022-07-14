import moment from 'moment';

import ProductEntity from '@modules/product/entity';

class CategoryEntity {
  //copy props from backend:
  name: string = '';
  description: string = '';
  image: any;
  productRecommends: ProductEntity[] = [];
  createdAt: string = '';
  constructor(category: any) {
    if (!category) return;
    Object.assign(this, category);
    // convert entity type here
    this.createdAt = category.createdAt ? moment(category.createdAt).format('DD/MM/YYYY') : '';
    this.productRecommends = category.productRecommends
      ? category.productRecommends.map(product => new ProductEntity(product.product))
      : [];
  }
  static createListCategory(listCategory: Array<any>) {
    if (!Array.isArray(listCategory)) return [];
    return listCategory.map((category: CategoryEntity) => {
      return new CategoryEntity(category);
    });
  }
}
export default CategoryEntity;
