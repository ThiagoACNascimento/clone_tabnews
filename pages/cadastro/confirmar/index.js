import DefaultLayout from "interface/DefaultLayout";
import { Banner } from "@primer/react";

export default function ConfirmRegisterPage() {
  return (
    <>
      <DefaultLayout
        contentWidth="small"
        metadata={{
          title: "Confirme seu email",
        }}
      >
        <Banner
          variant="warning"
          title="Quase lá!"
          description="Abra o email enviado pelo TrizCrocheting e click no link de confirmação!"
        />
      </DefaultLayout>
    </>
  );
}
