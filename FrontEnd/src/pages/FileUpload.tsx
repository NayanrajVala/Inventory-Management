//

import { useState } from "react";
import api from "../api";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      // get presigned url
      const { data } = await api.post("/upload/presigned-url", {
        filename: file.name,
        mimetype: file.type,
      });

      const { uploadUrl, key } = data;

      //  upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      //  notify backend to process file
      await api.post("/upload/import", { key });

      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed provide valid file csv or.xlsx");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload File</h2>

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <br />
      <br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
