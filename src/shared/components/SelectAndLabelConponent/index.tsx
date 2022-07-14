import { Select } from 'antd';
import lodash from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import UilAngelDown from '@iconscout/react-unicons/icons/uil-angle-down';

const { Option } = Select;

export interface ISelectData {
  value?: any;
  name?: any;
}

export interface ISelectAndLabel {
  textLabel?: any;
  defaultValue?: any;
  dataString?: Array<ISelectData>;
  onChange?: any;
  placeholder?: string;
  style?: any;
  value?: any;
  className?: string;
  dropdownClassName?: string;
  name?: string;
}

const SelectAndLabelComponent = (props: ISelectAndLabel) => {
  const intl = useIntl();
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChange = value => {
    setValue(value);
    props.onChange && props.onChange(value);
  };
  const className = props.className ? props.className : '';
  const all = intl.formatMessage({ id: 'common.all' });

  return (
    <div className={`select-label-component ${className}`}>
      <div className="label-select">
        {props?.textLabel && (
          <div>
            <FormattedMessage id={props.textLabel} defaultMessage={props.textLabel} />
          </div>
        )}
        <Select
          className="select-custom"
          style={{ ...props?.style, minWidth: '14rem' }}
          value={value == undefined ? all : value}
          defaultValue={props?.defaultValue ? props?.defaultValue : all}
          onChange={onChange}
          placeholder={props?.placeholder}
          dropdownClassName={props?.dropdownClassName}
        >
          {!lodash.isEmpty(props?.dataString) &&
            props?.dataString &&
            props.dataString.map((item, index) => {
              return (
                <Option value={item.value} key={index}>
                  <FormattedMessage id={item?.name} />
                </Option>
              );
            })}
        </Select>
      </div>
    </div>
  );
};

export default React.memo(SelectAndLabelComponent);
