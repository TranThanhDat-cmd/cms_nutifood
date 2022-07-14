import './style.scss';

import { Form } from 'antd';
import lodash, { isArray } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { isCheckLoading } from '@helper/isCheckLoading';
import { IFormContent, renderForm } from '@hoc/FormHelper';
import { ModulePermissionEntity } from '@modules/permissions/entity';
import permissionsPresenter from '@modules/permissions/presenter';
import RoleEntity from '@modules/roles/entity';
import rolePresenter from '@modules/roles/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';
import { routerPermissions } from '@view/Permissions/router';

import PermissionCheckBoxGroup from '../../component/CheckboxGroup/PermissionCheckBoxGroup';
import TitlePermission from '../../component/TitlePermission/TitlePermission';
import { routerFormPermissions, routerFormPermissionsEdit } from './router';

const FormPermissions: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();
  const addRole = useSingleAsync(rolePresenter.addRole);
  const updateRole = useSingleAsync(rolePresenter.updateRole);
  const getRoleDetail = useSingleAsync(rolePresenter.getRoleDetail);
  const getListPermissionsByGroup = useSingleAsync(permissionsPresenter.getListPermissionsByGroup);
  const [listPermissions, setListPermissions] = useState<ModulePermissionEntity[]>([]);
  const [role, setRole] = useState<RoleEntity>();

  const formContent: IFormContent[] = [
    {
      label: 'roles.name',
      name: 'name',
      rules: [{ required: true }],
    },
    {
      label: 'roles.createdAt',
      name: 'createdAt',
      disabled: true,
    },
  ];

  useEffect(() => {
    getListPermissionsByGroup.execute().then(res => {
      setListPermissions(res.data);
    });
  }, []);

  useEffect(() => {
    if (id) {
      getRoleDetail.execute(id).then((res: RoleEntity) => {
        // reference: https://stackoverflow.com/questions/40774697/how-can-i-group-an-array-of-objects-by-key
        const perGroupObj = res.rolePermissions.reduce((curr, role) => {
          const { code, permission } = role;
          const groupName = !permission.name.includes(',')
            ? permission.name.split(' ')[0]
            : 'SuperAdmin';

          curr[groupName] = [...(curr[groupName] || []), code];
          return curr;
        }, {});

        form.setFieldsValue({ ...res, ...perGroupObj });
        setRole(res);
      });
    }
  }, [id]);

  const onFinish = values => {
    const listRoles = Object.keys(values)
      .filter(key => lodash.isArray(values[key]))
      .reduce((curr: string[], key) => [...curr, ...values[key].map(ite => ({ code: ite }))], []);

    const dataFinish = { ...values, rolePermissions: listRoles };

    if (id) {
      updateRole.execute(dataFinish, id).then(() => {
        history.push(routerPermissions.path);
      });
    } else {
      addRole.execute(values).then(() => {
        history.push(routerPermissions.path);
      });
    }
  };

  const handleCheckAllEachGroup = useCallback(
    (groupFieldName, groupListRole) => {
      form.setFieldsValue({ ...role, [groupFieldName]: groupListRole });
    },
    [role]
  );

  return (
    <div className="form-permissions">
      <MainTitleComponent
        breadcrumbs={
          id
            ? [routerPermissions, routerFormPermissionsEdit]
            : [routerPermissions, routerFormPermissions]
        }
      />
      <div className="main-card">
        <Form
          form={form}
          layout="vertical"
          name="form-permission"
          className="permission-box main-form"
          onFinish={onFinish}
        >
          <div className="permission-info">{renderForm(formContent, intl)}</div>
          <div className="permission-box main-role">
            <TitlePermission />
            {listPermissions.map((module: ModulePermissionEntity, index: number) => {
              return (
                <PermissionCheckBoxGroup
                  module={module}
                  index={index}
                  defaultChoose={
                    role?.rolePermissions ? role.rolePermissions.map(per => per.code) : []
                  }
                  handleCheckAll={handleCheckAllEachGroup}
                />
              );
            })}
          </div>
        </Form>
      </div>
      <ButtonForm
        isLoading={isCheckLoading([addRole, updateRole])}
        formName="permission"
        nameButtonSubmit={id ? 'common.update' : 'common.add'}
        onOk={() => form.submit()}
        onCancelForm={() => history.goBack()}
      />
    </div>
  );
};

export default FormPermissions;
