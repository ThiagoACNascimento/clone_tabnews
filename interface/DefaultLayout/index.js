import Head from "next/head";
import styles from "./index.module.css";
import { PageLayout, Header, Text } from "@primer/react";

const contentWidthClasses = {
  small: styles.smallContent,
};

export default function DefaultLayout({
  children,
  metadata = {},
  contentWidth = "medium",
}) {
  const extraContentClassName = contentWidthClasses[contentWidth];

  return (
    <>
      <Head>
        <title>
          {metadata.title
            ? `${metadata.title} · TrizCrocheting`
            : "TrizCrocheting"}
        </title>

        {metadata.description && (
          <meta name="description" content={metadata.description} />
        )}
      </Head>

      <Header>
        <Header.Item full>
          <Header.Link href="/">TrizCrocheting</Header.Link>
        </Header.Item>

        <Header.Item>
          <Header.Link href="/login">Login</Header.Link>
        </Header.Item>

        <Header.Item>
          <Header.Link href="/cadastro">Cadastrar</Header.Link>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayout.Content
          width={contentWidth}
          className={extraContentClassName}
        >
          {children}
        </PageLayout.Content>
        <PageLayout.Footer divider={"line"}>
          <Text size="small"> © {new Date().getFullYear()} TrizCrocheting</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
