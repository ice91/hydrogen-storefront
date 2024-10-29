import React, { useEffect, useState } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [ReactQuill, setReactQuill] = useState<any>(null);

  useEffect(() => {
    // 動態加載 ReactQuill 和樣式
    Promise.all([
      import('react-quill'),
      import('react-quill/dist/quill.snow.css'),
    ]).then(([quillModule]) => {
      setReactQuill(quillModule.default);
    });
  }, []);

  if (!ReactQuill) {
    return <div>載入編輯器中...</div>;
  }

  return <ReactQuill value={value} onChange={onChange} />;
};
