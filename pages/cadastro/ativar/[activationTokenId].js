import DefaultLayout from "interface/DefaultLayout";
import { Banner } from "@primer/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ActivateUserPage() {
  const router = useRouter();
  const activationTokenId = router.query.activationTokenId;

  useEffect(() => {
    if (!activationTokenId) {
      return;
    }

    sendActivationRequest();

    async function sendActivationRequest() {
      try {
        const response = await fetch(
          `/api/v1/activations/${activationTokenId}`,
          {
            method: "PATCH",
          },
        );

        // const activationResponseBody = await response.json();

        if (response.status === 200) {
          // retorna um sucesso
          return;
        }

        // sinal de fracasso
      } catch {
        // sinal de fracasso
      }
    }
  }, [activationTokenId]);

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
