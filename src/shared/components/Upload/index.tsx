import './styles.scss';

import { Form, Typography } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React, { ReactNode, useEffect, useState } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import UilCloudUpload from '@iconscout/react-unicons/icons/uil-cloud-upload';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import { useAltaIntl } from '@shared/hook/useTranslate';

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));

  reader.readAsDataURL(img);
}

interface Props {
  title?;
  accept?;
  name?;
  onChange?: (infoFile, stateFile) => void;
  getData?: (dataFile) => void;
  icon?: ReactNode;
  preview?: boolean;
  disabled?: boolean;
  rules?: Array<any>;
  propsDrag?: any;
  data?: Array<any>;
}

const initialState = {
  dataFile: [],
  loading: false,
  originFileObj: null,
};
//Auth: Chí Công mập
const Upload = (props: Props) => {
  const { formatMessage } = useAltaIntl();
  //state
  const [state, setState] = useState(initialState);
  console.log('state', state);

  const action = async (file): Promise<any> => {
    const response = {
      name: 'xxx.png',
      status: 'done',
    };
    file.onSuccess();
    return response;
  };

  useEffect(() => {
    let dataFile = [];
    if (props?.data && props?.data.length > 0) {
      props.getData(props?.data);
      dataFile = props.data.map(item => {
        return { ...item, name: item.FileName };
      });
    }
    setState(prev => ({ ...prev, dataFile }));
  }, [props?.data]);

  const GetTypeFile = filename => {
    const type = filename.split('.').pop();

    switch (type) {
      case 'doc':
      case 'docx':
        return <i className="far fa-file-word mr-2 font-icon-fa" />;
      case 'pdf':
        return <i className="far fa-file-pdf mr-2 font-icon-fa" />;
    }
  };

  const handleRemoveFile = data => {
    if (state.dataFile.length === 0) return;
    const arrTemp = [...state.dataFile];
    const index = arrTemp.findIndex(item => {
      return item.uid === data.uid;
    });
    if (index > -1) {
      const splice = arrTemp.splice(index, 1);
      setState(prev => ({
        ...prev,
        dataFile: arrTemp,
      }));
      props.getData(arrTemp);
    }
  };

  const propsDrag = {
    ...props.propsDrag,
    disabled: props.disabled == true ? true : false,
    name: props.name,
    multiple: true,
    showUploadList: false,
    fileList: state.dataFile,
    key: 'dragMedia',
    accept: props.accept,
    customRequest: action,
    onChange(info) {
      // console.log('info', info);
      // if (info.file.status === "uploading") {
      //     setState((prev) => ({ ...prev, loading: true }));
      //     props.onChange(info, {
      //         ...state,
      //         originFileObj: info.file.originFileObj,
      //         loading: true,
      //         name: props.name,
      //     });
      //     return;
      // }
      // if (info?.file?.status === "done") {
      let arrTemp = state?.dataFile;
      arrTemp.push(info?.file.originFileObj);
      props.getData(arrTemp);
      getBase64(info?.file.originFileObj, imageUrl => {
        setState(prev => ({
          ...prev,
          dataFile: arrTemp,
          originFileObj: info.file.originFileObj,
          loading: false,
        }));
      });
      // }
    },
  };

  const normFile = e => {
    console.log('e', e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Form.Item
        rules={props.rules ? props.rules : null}
        getValueFromEvent={normFile}
        valuePropName="fileList"
        noStyle
        name={props.name ? props.name : `attachmentFiles`}
      >
        <Dragger {...propsDrag}>
          <div className="label-upload">
            <span className="ant-upload-drag-icon ">
              {state.loading ? <LoadingOutlined /> : <UilCloudUpload size="40" color="#5490EB" />}
            </span>
            <span className="ant-upload-hint ml-3 mt-1">
              <div dangerouslySetInnerHTML={{ __html: formatMessage(props.title) }} />
            </span>
          </div>
        </Dragger>
      </Form.Item>
      {state.dataFile.length > 0 &&
        state.dataFile.map((item, index) => {
          return (
            <div key={index} className="preview py-2 w-100 d-flex">
              {GetTypeFile(item?.name)}
              <Typography.Text
                ellipsis
                style={{
                  color: '#fff',
                  width: '100%',
                }}
              >
                {item.name}{' '}
              </Typography.Text>
              <span
                className="cursor-pointer"
                style={{ marginTop: '-4px' }}
                onClick={() => handleRemoveFile(item)}
              >
                <UilTimes size="27" color="#FF4747" />
              </span>
            </div>
          );
        })}
    </>
  );
};

export default Upload;
