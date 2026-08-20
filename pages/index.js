import DefaultLayout from "interface/DefaultLayout";

function Home() {
  return (
    <>
      <DefaultLayout
        metadata={{
          description: "Fabrica de memórias",
        }}
      >
        <h1>Fabrica de memórias</h1>
      </DefaultLayout>
    </>
  );
}

export default Home;
