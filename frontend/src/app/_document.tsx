import { Html, Head, Main, NextScript } from "next/document";

export default function Document(props: any) {
  const { gtmHead, gtmBody } = props;

  return (
    <Html lang="pt-BR">
      <Head>
        {gtmHead && (
          <script dangerouslySetInnerHTML={{ __html: gtmHead }} />
        )}
      </Head>
      <body>
        {gtmBody && (
          <noscript dangerouslySetInnerHTML={{ __html: gtmBody }} />
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: any) => {
  const initialProps = await (await import("next/document")).default.getInitialProps(ctx);

  let gtmHead = "";
  let gtmBody = "";

  try {
    const localConfig = await import("../../config/gtm.json");
    gtmHead = localConfig.gtm_head_code;
    gtmBody = localConfig.gtm_body_code;

    // 👇 Aqui vai pro terminal do Node (não pro navegador)
    console.log("✅ GTM carregado do JSON local");
  } catch (err) {
    console.error("❌ Erro ao carregar GTM:", err);
  }

  return {
    ...initialProps,
    gtmHead,
    gtmBody,
  };
};
