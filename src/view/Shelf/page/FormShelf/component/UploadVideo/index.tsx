import { Button, Upload } from 'antd';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useMemo, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { useAltaIntl } from '@shared/hook/useTranslate';

interface IProps {
  dataEdit: any;
  disabled: boolean;
  name?: string;
  className?: string;
  onChange?: (value: any) => void;
  onRemove?: (value: any) => void;
  form: FormInstance<any>;
}

const UploadVideo = (props: IProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { formatMessage } = useAltaIntl();

  const initialFile: UploadFile = useMemo(() => {
    const initialUrl = props.form.getFieldValue('video');
    return {
      uid: '1',
      name:
        typeof initialUrl == 'string'
          ? initialUrl.split('/')[initialUrl.split('/').length - 1]
          : '',
      status: 'done',
      url: initialUrl,
    };
  }, [props.dataEdit]);

  const objUrl = useMemo(() => {
    if (fileList.length > 0 && fileList[0]?.uid !== initialFile.uid) {
      //@ts-ignore
      return URL.createObjectURL(fileList[0]);
    }
  }, [fileList]);


  useEffect(() => {
    if (!initialFile.url) {
      setFileList([]);
      return;
    }
    setFileList([initialFile]);
  }, [initialFile]);

  const handleChange = value => {
    if (value.file.status !== 'removed') {
      setFileList([value.file]);
      props.form.setFieldsValue({ ...props.dataEdit, video: value.file });
    }
  };

  return (
    <div className={`upload-component ${props.className}`}>
      <Upload
        disabled={props.disabled}
        name="video"
        beforeUpload={() => false}
        fileList={fileList}
        onChange={handleChange}
        maxCount={1}
        onRemove={file => {
          setFileList([]);
        }}
      >
        <Button icon={<UploadOutlined />} />
        <div className="mx-auto m-5">
          {fileList.length > 0 && (
            <video width={300} height={200} src={objUrl ? objUrl : fileList[0].url} controls />
          )}
        </div>
      </Upload>
    </div>
  );
};

export default UploadVideo;
