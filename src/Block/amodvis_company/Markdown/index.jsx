import React from 'react';
import ReactMarkdown from 'react-markdown';
import './index.scss';

export default function Markdown(props) {
  let adminData;
  if (!props.module_data || !props.module_data.markdown_text) {
    adminData = "";
  } else {
    adminData = props.module_data.markdown_text;
  }
  return (
    <div>
      <ReactMarkdown className="markdown-docs-body" source={adminData} />
    </div>
  );
}
