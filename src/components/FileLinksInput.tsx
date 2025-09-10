//src/components/FileLinksInput.tsx
import React, { useState } from "react";
import type { TaskFileLink } from "@/types/homework";
import { uid } from "@/lib/fakeApi";

const FileLinksInput: React.FC<{ value: TaskFileLink[]; onChange: (v: TaskFileLink[]) => void }> = ({ value, onChange }) => {
  const [url, setUrl] = useState(""); const [title, setTitle] = useState("");
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="input" placeholder="Посилання на Google Drive" value={url} onChange={e=>setUrl(e.target.value)} />
        <input className="input" placeholder="Назва (необов’язково)" value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="btn" onClick={() => {
          if (!url) return;
          onChange([...value, { id: uid(), url, title: title || undefined }]);
          setUrl(""); setTitle("");
        }}>Додати</button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(f => (
            <span key={f.id} className="badge">
              {f.title ?? f.url}
              <button className="ml-2 opacity-60 hover:opacity-100" onClick={() => onChange(value.filter(x => x.id !== f.id))}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileLinksInput;
