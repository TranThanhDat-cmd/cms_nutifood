import './style.scss';

import { Button, Col, Form, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import CONFIG from '@config/index';
import store from '@core/store/redux';
import { useAsync } from '@hook/useAsync';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { RootState } from '@modules';
import authenticationPresenter from '@modules/authentication/presenter';
import { removeProfile } from '@modules/authentication/profileStore';
import UserEntity from '@modules/user/entity';
import MainTitleComponent from '@shared/components/MainTitleComponent';

import AvatarUser from './components/AvatarUser';
import ModalChangePassWord from './components/ModalChangePassWord';
import { routerViewProfile } from './router';

const UserProfile = () => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const useTranslate = (key: string) => {
    return intl.formatMessage({ id: key, defaultMessage: key });
  };
  const { updateProfileUser, getProfile } = authenticationPresenter;
  const [updateProfileCall, getProfileCall] = useAsync(updateProfileUser, getProfile);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisableForm, setIsDisableForm] = useState(true);
  const user = useSelector((state: RootState) => state.profile.user);

  const showModal = () => {
    setIsVisible(true);
  };
  const setValuesForm = (res: any) => {
    const _user = { ...res };
    _user.accountType = res.accountType === 1 ? 'SSO' : useTranslate('account.account.typeUser');

    setIsDisableForm(true);
    form.setFieldsValue(_user);
  };

  useEffect(() => {
    if (user != null) {
      setValuesForm(user);
    }
  }, [user]);

  const arrayAction: IArrayAction[] = [
    {
      iconType: 'edit',
      name: useTranslate('common.edit'),
      handleAction: () => setIsDisableForm(false),
    },
    {
      iconType: 'key',
      name: useTranslate('common.change.password'),
      handleAction: () => showModal(),
    },
    {
      iconType: 'logOut',
      name: useTranslate('common.logout'),
      handleAction: () => {
        store.dispatch(removeProfile());
        window.location.href = CONFIG.LOGIN_PAGE;
      },
    },
  ];

  const chooseFile = file => {
    form.setFieldsValue({ avatar: file });
  };

  const placeholder = (label: string): string => {
    return intl.formatMessage(
      { id: 'common.input.placeholder' },
      {
        label: intl.formatMessage({ id: label, defaultMessage: label }).toLocaleLowerCase(),
      }
    );
  };

  const onUpdateProfile = (values: UserEntity) => {
    if (typeof values.avatar == 'string') {
      values.avatar = '';
    }
    updateProfileCall.execute(values, user?.id).then(() => {
      getProfileCall.execute().then(() => {
        setIsDisableForm(true);
      });
    });
  };

  return (
    <div className="main-component">
      <MainTitleComponent breadcrumbs={routerViewProfile} />
      <div className="profile-user__box">
        <Form
          name="userProfileForm"
          initialValues={user}
          layout="vertical"
          requiredMark={false}
          form={form}
          onFinish={onUpdateProfile}
          onResetCapture={() => {
            setIsDisableForm(true);
          }}
          id="userProfileForm"
        >
          <Row className="profile-form__box" justify="center">
            <Col span={4} className="profile-avatar">
              <AvatarUser disabled={isDisableForm} chooseFile={chooseFile} />
            </Col>
            <Col span={12}>
              <div className="main-form">
                <Form.Item label={useTranslate('accounts.accountFullName')} name="userName">
                  <Input
                    disabled
                    placeholder={placeholder('accounts.accountFullName')}
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  label={useTranslate('user.fullName')}
                  name="fullName"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      max: 99,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input
                    disabled={isDisableForm}
                    placeholder={placeholder('user.fullName')}
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  label={useTranslate('accounts.accountEmail')}
                  name="emailAddress"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: 'email',
                    },
                  ]}
                >
                  <Input
                    disabled={isDisableForm}
                    placeholder={placeholder('accounts.accountEmail')}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <RightMenu arrayAction={arrayAction} />
      </div>
      <ModalChangePassWord setIsModalVisible={setIsVisible} isModalVisible={isVisible} />

      <div className="button-center__box profile-button-update">
        {!isDisableForm && (
          <>
            <Button className="cancel-button mx-5" onClick={() => setIsDisableForm(true)}>
              <FormattedMessage id="common.cancel" />
            </Button>
            <Button
              type="primary"
              className="normal-button"
              htmlType="submit"
              form="userProfileForm"
              loading={updateProfileCall.status == 'loading'}
            >
              <FormattedMessage id="common.save" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(UserProfile);
