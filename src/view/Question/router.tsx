import { QuestionCircleOutlined } from '@ant-design/icons';
import { QUESTIONS_PERMISSION } from '@modules/question/constants';
import { IRouter } from '@routers/interface';

export const routerQuestion: IRouter = {
  path: '/question',
  loader: import('./index'),
  exact: true,
  menu: {
    icon: <QuestionCircleOutlined />,
    activePath: ['/question'],
  },
  name: 'question.name', //translate here for breadcrumb and sidebar
  permissionCode: QUESTIONS_PERMISSION.VIEW,
};
