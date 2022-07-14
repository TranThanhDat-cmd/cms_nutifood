import moment from 'moment';

class CustomerEntity {
  fullName: string = '';
  phoneNumber: string = '';
  active?: boolean;
  id?: string;
  createdAt: string = "";

  constructor(customer: any) {
    if (!customer) return;
    Object.assign(this, customer);
    // convert entity type here
    this.createdAt = customer.createdAt ? moment(customer.createdAt).format("DD/MM/YYYY") : "";
  }
  static createListCustomer(listCustomer: Array<any>) {
    if (!Array.isArray(listCustomer)) return [];
    return listCustomer.map((customer: CustomerEntity) => {
      return new CustomerEntity(customer);
    });
  }
}
export default CustomerEntity;
