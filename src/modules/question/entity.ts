import moment from 'moment';

class QuestionEntity {
  //copy props from backend:
  id?: string = '';
  fullName?: string = '';
  phoneNumber?: string = '';
  email?: string = '';
  type?: number = 0;
  content?: string = '';
  createdAt?: string = '';
  constructor(question: any) {
    if (!question) return;
    Object.assign(this, question);
    // convert entity type here
    this.createdAt = question?.createdAt ? moment(question?.createdAt).format('DD/MM/YYYY') : '';
  }
  static createListQuestion(listQuestion: Array<any>) {
    if (!Array.isArray(listQuestion)) return [];
    return listQuestion.map((question: QuestionEntity) => {
      return new QuestionEntity(question);
    });
  }
}
export default QuestionEntity;
