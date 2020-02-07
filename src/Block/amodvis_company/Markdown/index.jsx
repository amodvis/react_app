import React from 'react';
import ReactMarkdown from 'react-markdown';
import './index.scss';

export default function Markdown(props) {
  const adminData = props.module_data.markdown_text;
  return (
    <div>
      <ReactMarkdown className="markdown-docs-body" source={adminData} />
    </div>
  );
}
