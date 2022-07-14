import React, { useState } from 'react';
import lodash from 'lodash';
import * as Icon from 'react-feather';
import { useIntl } from 'react-intl';
import { Input } from 'antd';

interface Iprops {
  onChange?: (value) => void;
  onClick?: (value) => void;
  classNames?: string;
  placeholder?: string;
  onSearch?: (value) => void;
}

const SearchComponent = (props: Iprops) => {
  const { classNames } = props;
  const [valueInput, setValueInput] = useState<string | undefined>();
  const intl = useIntl();
  const onClickKeyDown = (event: any) => {
    if (event.keyCode === 13 && props.onClick) {
      props.onClick(valueInput);
    }
  };

  const onSearch = React.useMemo(() => {
    return lodash.debounce(text => {
      props.onSearch && props.onSearch(text);
    }, 800);
  }, [props.onSearch]);

  React.useEffect(() => {
    if (valueInput == null) {
      return;
    }
    onSearch(valueInput);
    return () => {
      onSearch.cancel();
    };
  }, [valueInput]);

  const onChange = e => {
    const text = e.target.value;
    setValueInput(text);
    props.onChange && props.onChange(e);
  };

  return (
    <div className={`search-bar ${classNames ? classNames : ''}`}>
      <Input
        type="text"
        onChange={onChange}
        onKeyDown={onClickKeyDown}
        placeholder={intl.formatMessage({
          id: props.placeholder,
          defaultMessage: props.placeholder,
        })}
        suffix={<Icon.Search />}
      />
      {/* <a className="icon-search" onClick={() => props.onClick(valueInput)}>
        <Icon.Search />
      </a> */}
    </div>
  );
};

export default React.memo(SearchComponent);
