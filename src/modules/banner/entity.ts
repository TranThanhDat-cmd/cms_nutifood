import moment from 'moment';

class BannerEntity {
  //copy props from backend:
  id: string = '';
  createdAt: string = '';
  name: string = '';
  position?: number;
  bannerMedias: any = [];
  bannerCode: string = '';

  constructor(banner: any) {
    if (!banner) return;
    Object.assign(this, banner);
    // convert entity type here
    this.createdAt = banner.createdAt ? moment(banner.createdAt).format('DD/MM/YYYY') : '';
  }
  static createListBanner(listBanner: Array<any>) {
    if (!Array.isArray(listBanner)) return [];
    return listBanner.map((banner: BannerEntity) => {
      return new BannerEntity(banner);
    });
  }
}
export default BannerEntity;
