import DefaultLayout from "interface/DefaultLayout";
import { Banner } from "@primer/react";
import { useRouter } from "next/router";

export default function ActivateUserPage() {
  const router = useRouter();

  console.log(router.query.activationTokenId);

  return (
    <>
      <DefaultLayout
        contentWidth="small"
        metadata={{
          title: "Ativar cadastro",
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
