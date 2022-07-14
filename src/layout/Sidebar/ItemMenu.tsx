import { Dropdown, Menu } from 'antd';
import lodash from 'lodash';
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';

import { UilEllipsisV } from '@iconscout/react-unicons';
import { IRouter } from '@routers/mainRouter';

interface IMenu {
  data: IRouter;
  activePath?: string;
}

const SubItem: React.FC<IMenu> = (props: IMenu) => {
  const item = props.data;
  const _pathnameSplit = props.activePath?.split('/');
  const history = useHistory();
  return (
    <Menu mode="vertical" className="dropdown-3dot">
      {item.routes.length > 0 &&
        item.routes.map((linkNav: IRouter, index) => {
          let active = '';
          if (!lodash.isEmpty(linkNav.menu?.activePath)) {
            const activeMenu = linkNav.menu.activePath.some(x =>
              _pathnameSplit?.some(y => '/' + y == x || y == x)
            );

            if (activeMenu) {
              active = 'ant-menu-item-selected';
            }
          } else if (matchPath(props.activePath, { path: linkNav.path, exact: linkNav.exact })) {
            active = 'ant-menu-item-selected';
          }

          let path = linkNav.path;
          if (linkNav.menu?.generatePath) {
            const params = useSelector(linkNav.menu?.selector);
            path = linkNav.menu.generatePath(params);
          }
          return (
            <Menu.Item
              className={active}
              key={index}
              onClick={() => {
                history.push(path);
              }}
            >
              <FormattedMessage id={linkNav.name} defaultMessage={linkNav.name} />
            </Menu.Item>
          );
        })}
    </Menu>
  );
};

const Item: React.FC<IMenu> = (props: IMenu) => {
  const item = props.data;
  const location = useLocation();
  const active = useMemo(() => {
    if (!lodash.isEmpty(item.menu?.activePath)) {
      const _pathnameSplit = location.pathname.split('/');
      _pathnameSplit.shift();
      const activeMenu = item.menu.activePath.some(x =>
        _pathnameSplit.some(y => '/' + y == x || y == x)
      );
      return activeMenu ? 'menu-active' : '';
    }
    return matchPath(location.pathname, { path: item.path, exact: item.exact })
      ? 'menu-active'
      : '';
  }, [location.pathname]);
  let path = item.path;
  if (item.menu?.generatePath) {
    const params = useSelector(item.menu?.selector);
    path = item.menu.generatePath(params);
  }
  if (item.routes && item.routes.length > 0) {
    return (
      <div className={`menu--component--item three-dot ${active}`} key={item.path}>
        <div className="item-label">
          <span>
            <span className="item-hover__icon">{item.menu.icon}</span>
            <a className="item__nav">
              <FormattedMessage id={item.name} defaultMessage={item.name} />
            </a>
          </span>

          <Dropdown
            overlay={<SubItem data={item} activePath={location.pathname} />}
            placement="bottomLeft"
            trigger={['hover']}
          >
            <span className="icon-3dot">
              <UilEllipsisV />
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }

  return (
    <div className={`menu--component--item ${active}`}>
      <Link to={path} className="item-label">
        <span>
          <span className="item-hover__icon">{item.menu.icon}</span>
          <span className="item__nav">
            <FormattedMessage id={item.name} defaultMessage={item.name} />
          </span>
        </span>
      </Link>
    </div>
  );
};

export default memo(Item);
