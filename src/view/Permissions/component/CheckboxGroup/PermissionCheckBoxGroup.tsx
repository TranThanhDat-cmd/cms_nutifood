import { Checkbox, Col, Form, Row, Typography } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';

import { ModulePermissionEntity } from '@modules/permissions/entity';
import { useAltaIntl } from '@shared/hook/useTranslate';

const CheckboxGroup = Checkbox.Group;
interface ISelectPermission {
  module: ModulePermissionEntity;
  index: number;
  defaultChoose: string[];
  handleCheckAll: (groupName, listRole) => void;
}

const PermissionCheckBoxGroup: React.FC<ISelectPermission> = ({
  index,
  module,
  defaultChoose,
  handleCheckAll,
}) => {
  const { formatMessage } = useAltaIntl();
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const listPerCheckBoxValue = React.useMemo(() => {
    if (!module) return [];
    return module.rolePermissions?.map(role => role.code);
  }, [module, defaultChoose]);

  const onChangeGroupCheckbox = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < module?.rolePermissions.length);
    setCheckAll(list.length === module?.rolePermissions.length);
  };

  const onCheckAllChange = e => {
    handleCheckAll(
      !module.name.includes(',') ? module.name : 'SuperAdmin',
      e.target.checked ? listPerCheckBoxValue : []
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (!isEmpty(defaultChoose)) {
      const defaultCheckList = defaultChoose.filter(
        per => per.split('.')[1] == module.rolePermissions[0].code.split('.')[1]
      );
      const isCheckAll = defaultCheckList.length == listPerCheckBoxValue.length;
      setCheckAll(isCheckAll);
      if (defaultCheckList.length > 0 && defaultCheckList.length !== listPerCheckBoxValue.length) {
        setIndeterminate(defaultCheckList.length < listPerCheckBoxValue.length);
        setCheckAll(false);
      }
    }
  }, [defaultChoose, listPerCheckBoxValue]);

  const ListPermission = React.memo(({ permission }: { permission: any[] }) => {
    return (
      <>
        {permission.map((item: any) => {
          return (
            <Checkbox value={item.code} key={item.code}>
              {formatMessage(`${item.code}`)}
            </Checkbox>
          );
        })}
      </>
    );
  });

  return (
    <Row className="module-item-box">
      <Col span={2} className="module-item-index">
        {index + 1}
      </Col>
      <Col span={5} className="module-item-title">
        <Typography.Text ellipsis={true} title={formatMessage(`role.${module.name}`)}>
          {formatMessage(`role.${module.name}`)}
        </Typography.Text>
      </Col>
      <Col span={5} className="module-item-checkAll">
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          {formatMessage('common.checkAll')}
        </Checkbox>
      </Col>
      <Col flex={1}>
        {index !== 8 ? (
          <Form.Item name={module.name} key={module.name}>
            <CheckboxGroup
              // value={checkedList}
              onChange={onChangeGroupCheckbox}
              className="module-item-checkbox-group"
            >
              <ListPermission permission={module.rolePermissions} />
            </CheckboxGroup>
          </Form.Item>
        ) : (
          <Form.Item name="SuperAdmin" key="superAdmin">
            <CheckboxGroup
              // value={checkedList}
              onChange={onChangeGroupCheckbox}
              className="module-item-checkbox-group"
            >
              <ListPermission permission={module.rolePermissions} />
            </CheckboxGroup>
          </Form.Item>
        )}
      </Col>
    </Row>
  );
};

export default PermissionCheckBoxGroup;
