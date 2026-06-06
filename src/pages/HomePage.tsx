const HomePage = () => {
  return (
    <div>
      <h3>Upload Legal document:</h3>
      <input
        type="file"
        name="docUpload"
        id="docUpload"
        accept=".doc, .docx, .pdf"
      />
    </div>
  );
};

export default HomePage;
