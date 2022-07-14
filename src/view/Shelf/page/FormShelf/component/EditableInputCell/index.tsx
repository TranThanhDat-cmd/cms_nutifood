import { Form, InputNumber } from 'antd';
import React from 'react';

import { useAltaIntl } from '@shared/hook/useTranslate';

interface IProps {
  name: string;
  className?: string;
  itemCell: number;
  indexRow: number;
  record?: any;
  setDataSource: (value: any) => void;
}

// antd reference: https://ant.design/components/table/#components-table-demo-edit-cell
const EditableInputCell = (props: IProps) => {
  const [editing, setEditing] = React.useState(false);
  const inputRef: any = React.useRef(null);
  const { formatMessage } = useAltaIntl();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
      form.setFieldsValue({ [props.name]: props.itemCell });
    }
  }, [editing]);

  const handleSave = async e => {
    try {
      const values: { xDirection: number } | { yDirection: number } = await form.validateFields();
      const position = values;
      props.setDataSource(prev => [
        ...prev.map((item, index) => {
          if (index == props.indexRow)
            return {
              ...item,
              ...position,
            };
          return item;
        }),
      ]);
      setEditing(false);
    } catch (err) {}
  };

  return (
    <Form form={form}>
      <Form.Item
        key={props.name}
        name={props.name}
        preserve={false}
        rules={[
          {
            required: true,
            message: formatMessage('common.input.notEmpty'),
          },
        ]}
      >
        {editing ? (
          <InputNumber required ref={inputRef} onBlur={handleSave} onPressEnter={handleSave} />
        ) : (
          <div className="editable-cell-value-wrap" onClick={() => setEditing(true)}>
            {props.itemCell}
          </div>
        )}
      </Form.Item>
    </Form>
  );
};

export default EditableInputCell;
