import React from "react";
import { useSelector } from "react-redux";
import { Form, InputNumber, Select } from "antd";
import { RootState } from "@modules";
import { useAltaIntl } from "@shared/hook/useTranslate";
import { FormContent, IFormContent } from "@hoc/FormHelper";
import FormNote from "@shared/components/FormNote";
import ButtonForm from "@shared/components/ButtonForm";

const Form{{pascalCase name}}: React.FC = () => {
  const { formatMessage, intl } = useAltaIntl();
  const [form] = Form.useForm();
  const language = useSelector(
    (state: RootState) => state.settingStore.language
  );
  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: "{{camelCase name}}Name",
        label: "{{camelCase name}}.{{camelCase name}}Name",
        rules: [{ required: true }, { max: 255 }],
      },
      {
        name: "{{camelCase name}}Code",
        label: "{{camelCase name}}.{{camelCase name}}Code",
        rules: [{ required: true }, { pattern: /^\d+$/g }, { max: 255 }],
      },
      {
        name: "{{camelCase name}}Latitude",
        label: "{{camelCase name}}.{{camelCase name}}Latitude",
        rules: [{ required: true }, { type: "number", min: -90, max: 90 }],
        render: (placeholder) => {
          return <InputNumber placeholder={placeholder} />;
        },
      },
      {
        name: "{{camelCase name}}SupplierId",
        label: "{{camelCase name}}.{{camelCase name}}Supplier",
        rules: [{ required: true }],
        render: (placeholder) => {
          return <Select placeholder={placeholder}></Select>;
        },
      },
    ];
  }, [language]);
  const onFinishForm = (values) => {
    console.debug("values", values);
  };

  return (
    <div className="main-card">
      <Form
        form={form}
        className="main-form" //important
        name="form-{{camelCase name}}"
        layout="vertical"
        onFinish={onFinishForm}
      >
        {formContent.map((item: IFormContent) => {
          const renderItem = new FormContent(item);
          return (
            <Form.Item
              key={item.name}
              //@ts-ignore
              label={formatMessage(item?.label)}
              name={item?.name}
              rules={item.rules}
              hidden={item.hidden}
            >
              {renderItem.render(intl)}
            </Form.Item>
          );
        })}
        <FormNote text={formatMessage("common.formNote")} />
        <ButtonForm
          nameButtonSubmit={"common.accept"}
          formName={"form-{{camelCase name}}"}
        />
      </Form>
    </div>
  );
};

export default React.memo(Form{{pascalCase name}});
