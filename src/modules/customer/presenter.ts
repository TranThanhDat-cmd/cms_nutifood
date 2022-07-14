import * as customerRepository from './repository';

const customerPresenter = { ...customerRepository };

// ở đây xử lý dữ liệu gửi lên backend và dữ liệu backend gửi về, dữ liệu backend gửi về có thể đc đưa lên store ở đây

export default customerPresenter;