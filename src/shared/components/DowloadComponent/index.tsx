import React from 'react';
import { saveAs } from 'file-saver';

import './styles.scss';

interface Props {
  data: {
    link: string;
    name: string;
  };
  icon: React.ReactNode;
}

const DownloadMedia = (props: Props) => {
  const saveFile = (link, name) => {
    saveAs(link, name);
  };
  return (
    <div className="download-media">
      <a
        onClick={() => saveFile(props.data.link, props.data.name)}
        target="_blank"
        download={props.data.name}
        rel="noopener noreferrer"
      >
        {props.icon ? props.icon : <i className="fa fa-file"> </i>}
        <p className="name">{props.data.name}</p>
      </a>
    </div>
  );
};

export default DownloadMedia;
