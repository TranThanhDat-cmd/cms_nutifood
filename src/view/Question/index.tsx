import './style.scss';

import { Space, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu from '@layout/RightMenu';
import { QUESTIONS_PERMISSION } from '@modules/question/constants';
import questionPresenter from '@modules/question/presenter';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import SelectAndLabelComponent, {
  ISelectAndLabel,
  ISelectData
} from '@shared/components/SelectAndLabelConponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import ModalComponents from './component/MainModal/ModalQuestion';
import { IModal } from './interface';
import { routerQuestion } from './router';

const Question = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();
  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });
  const [search, setSearch] = useState<string>('');
  const [filter, setFilterOption] = useState<{}>();

  const idChooses = 'id'; //get your id here. Ex: accountId, userId,...

  const columns: ColumnsType = [
    {
      dataIndex: 'fullName',
      sorter: true,
    },
    {
      dataIndex: 'email',
      sorter: true,
    },
    {
      dataIndex: 'phoneNumber',
    },
    {
      dataIndex: 'content',
      sorter: true,
    },
    {
      dataIndex: 'answer',
      sorter: true,
      render: (item, record: any) => (
        <Tag color={record.answerStatus === 1 ? 'green' : 'red'}>
          {record.answerStatus === 1
            ? formatMessage('question.answered')
            : formatMessage('question.notAnswer')}
        </Tag>
      ),
    },

    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'action',
      render: (item, record: any, index) => (
        <Space>
          <CheckPermission permissionCode={QUESTIONS_PERMISSION.UPDATE}>
            <EditIconComponent
              onClick={() => {
                setModal({
                  dataEdit: record,
                  isVisible: true,
                  isReadOnly: false,
                  isAnswer: true,
                });
              }}
            />
          </CheckPermission>

          <CheckPermission permissionCode={QUESTIONS_PERMISSION.VIEW}>
            <InformationIconComponent
              onClick={() => {
                setModal({
                  dataEdit: record,
                  isVisible: true,
                  isReadOnly: true,
                });
              }}
            />
          </CheckPermission>

          <CheckPermission permissionCode={QUESTIONS_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('question.confirm.title.delete'),
                  content: formatMessage('question.confirm.content.delete'),
                  handleOk: () => {
                    questionPresenter.deleteQuestion(record.id).then(() => {
                      handleRefresh();
                    });
                  },
                });
              }}
            />
          </CheckPermission>
        </Space>
      ),
    },
  ];

  // const arrayAction: IArrayAction[] = [
  //   {
  //     iconType: 'add',
  //     permissionCode: QUESTIONS_PERMISSION.CREATE,
  //     handleAction: () => {
  //       setModal({ dataEdit: null, isVisible: true });
  //     },
  //   },
  // ];

  const dataString: ISelectData[] = [
    { name: 'common.all', value: null },
    { name: 'question.answered', value: 1 },
    { name: 'question.unResponsive', value: 2 },
  ];
  const arraySelectFilter: ISelectAndLabel[] = [
    { name: 'type', textLabel: 'question.filter.type', dataString },
  ];

  useEffect(() => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  }, [search, filter]);

  const handleRefresh = () => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const onChangeSelectStatus = name => status => {
    setFilterOption(pre => ({ ...pre, [name]: status }));
  };

  return (
    <div className="question">
      <MainTitleComponent breadcrumbs={[routerQuestion]} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-row ">
            {arraySelectFilter.map((item, index) => {
              return (
                <SelectAndLabelComponent
                  onChange={onChangeSelectStatus('AnswerStatus')}
                  key={item.name}
                  className="margin-select"
                  dataString={item.dataString}
                  textLabel={item.textLabel}
                />
              );
            })}
          </div>
          <div className="d-flex flex-column ">
            <div className="label-select">{formatMessage('common.keyword')}</div>
            <SearchComponent
              onSearch={handleSearch}
              placeholder={'common.keyword'}
              classNames="mb-0"
            />
          </div>
        </div>
        <TableComponent
          apiServices={questionPresenter.getListQuestion}
          defaultOption={filter}
          translateFirstKey="question"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          hasStt={true}
          disableFirstCallApi={true}
        />
      </div>
      {/* <RightMenu arrayAction={arrayAction} /> */}
      <ModalComponents modal={modal} handleRefresh={handleRefresh} setModal={setModal} />
    </div>
  );
};

export default Question;
