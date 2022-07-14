import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
interface IProps {
  children: any;
  yCoor?: number;
  delay: number; // delay
  loading?: any;
}

const InfiniteScrollLazyLoad = ({ children, yCoor, delay, loading }: IProps) => {
  const refScrollLazy = useRef(null);
  const childrenNew: Array<any> = useMemo(
    () => (children.length != undefined ? children : [children]),
    [children]
  );

  const childrenDom = children => {
    return children.map(x => ({
      dom: x,
      active: false,
    }));
  };

  const [activeChildren, setActiveChildren] = useState({
    current: -1,
    children: [],
  });

  useEffect(() => {
    setActiveChildren(pre => ({
      ...pre,
      current: -1,
      children: childrenDom(childrenNew),
    }));
    checkScrollHeight();
    window.removeEventListener('scroll', checkScrollHeight);
    window.addEventListener('scroll', checkScrollHeight);
    return () => {
      window.removeEventListener('scroll', checkScrollHeight);
    };
  }, [childrenNew]);

  const checkScrollHeight = () => {
    const offsetTop = yCoor || refScrollLazy.current.offsetTop + refScrollLazy.current.offsetHeight;

    if (window.pageYOffset + window.innerHeight >= offsetTop - 200) {
      setActiveChildren(pre => {
        if (pre.current + 1 >= childrenNew.length) {
          window.removeEventListener('scroll', checkScrollHeight);
        }

        return {
          current: pre.current + 1,
          children: pre.children.map((x, index) => ({
            dom: x.dom,
            active: x.active || pre.current == index,
          })),
        };
      });
    }
  };
  return (
    <div ref={refScrollLazy}>
      {activeChildren.children.map((x, index) => {
        return x.active ? (
          <Suspense fallback={loading || <div />} key={index}>
            {{ ...x.dom }}
          </Suspense>
        ) : null;
      })}
    </div>
  );
};
export default React.memo(InfiniteScrollLazyLoad);
