import { useState } from "react";
import { toast } from "sonner";

type UploadedFile = {
  // lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  webkitRelativePath: string;
};

const HomePage = () => {
  const [uploadFile, setUploadFile] = useState<UploadedFile | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("There was an issue selecting your document");
      return;
    }

    const allowedType = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedType.includes(file.type)) {
      toast.error("Incompatible file type, Only .pdf, .doc and .docx accepted");
      return;
    }
    setUploadFile(file);
    toast.success(`${file.name} selected`);
  };

  const handleUploadFile = () => {};

  return (
    <div>
      <h2>Welcome to Legal-Aid</h2>
      <h3>Upload Legal document:</h3>
      <input
        type="file"
        name="docUpload"
        id="docUpload"
        accept=".doc, .docx, .pdf"
        onChange={handleSelectFile}
      />
      <button type="button" onClick={handleUploadFile}>
        Upload
      </button>
    </div>
  );
};

export default HomePage;
