import React, { PropsWithChildren } from 'react';
import HeaderComponent from './Header';
import SiderComponent from './Sidebar';
interface IDefaultLayoutProps {
}

const DefaultLayout: React.FC<PropsWithChildren<IDefaultLayoutProps>> = props => {
  const [menu, setMenu] = React.useState<string>('sider-component big');

  const onClick = e => {
    const targetNode = e.target as HTMLDivElement;
    if (targetNode.className == 'main-component' || e.target == e.currentTarget) {
      setMenu('sider-component');
      return;
    }
    if (
      targetNode.tagName == 'INPUT' ||
      targetNode.tagName == 'BUTTON' ||
      targetNode.onclick != null ||
      targetNode.parentElement!.onclick != null
    ) {
      return;
    }
    setMenu('sider-component');
  };

  return (
    <div className="all-page-component">
      <SiderComponent setClassName={setMenu} className={menu} />
      <div className="right-page-component" onClick={onClick}>
        <div className="w-100 d-flex flex-row-reverse">
          <HeaderComponent />
        </div>
        <div className="main-component">{props.children}</div>
      </div>
    </div>
  );
};

export default React.memo(DefaultLayout);
