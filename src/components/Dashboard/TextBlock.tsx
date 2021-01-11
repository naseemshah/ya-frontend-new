import React from 'react';

type TextBlockProps = {
  label: string,
  text: string
}

function TextBlock({ label, text }: TextBlockProps) {
  return (
    <>
      <div>{label}</div>
      <div>{text}</div>
    </>
  );
}

export default TextBlock;
