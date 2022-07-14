import * as shelfRepository from './repository';

const shelfPresenter = { ...shelfRepository };

// ở đây xử lý dữ liệu gửi lên backend và dữ liệu backend gửi về, dữ liệu backend gửi về có thể đc đưa lên store ở đây

export default shelfPresenter;