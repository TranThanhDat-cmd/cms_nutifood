import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { IRouter } from '@routers/interface';

import BreadcrumbComponent from './BreadcumbComponent';
import TitleComponent from './TitleComponent/index';

export interface IBreadcrumbs {
  name: string;
  href?: string;
}
interface props {
  classTitle?: string;
  classBreadcrumbs?: string;
  title?: any;
  breadcrumbs?: IRouter | Array<IRouter>;
}
const MainTitleComponent = ({
  classTitle = '',
  classBreadcrumbs = '',
  title = '',
  breadcrumbs,
}: props) => {
  const intl = useIntl();
  let titleIn = '';
  if (title) {
    titleIn = intl.formatMessage({ id: title, defaultMessage: title });
  } else {
    if (Array.isArray(breadcrumbs)) {
      const index = breadcrumbs.length - 1;
      titleIn = intl.formatMessage({
        id: breadcrumbs[index]?.name,
        defaultMessage: breadcrumbs[index]?.name,
      });
    } else {
      titleIn = intl.formatMessage({
        id: breadcrumbs?.name,
        defaultMessage: breadcrumbs?.name,
      });
    }
  }
  return (
    <div className="main-title-breadcrumb__box">
      {breadcrumbs ? (
        <BreadcrumbComponent breadcrumbs={breadcrumbs} className={classBreadcrumbs} />
      ) : (
        ''
      )}
      <TitleComponent title={titleIn} className={classTitle} />
    </div>
  );
};

export default memo(MainTitleComponent);
