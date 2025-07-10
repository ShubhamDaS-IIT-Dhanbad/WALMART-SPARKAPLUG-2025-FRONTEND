import LinkInputForm from "./linkInputForm";

const App = () => {
  const handleSubmit = (links) => {
    console.log("Submitted links:", links);
  };

  return (
    <div >
      <LinkInputForm onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
