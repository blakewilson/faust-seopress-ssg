import { getNextStaticProps, is404 } from "@faustjs/next";
import { Footer, Header, Hero } from "components";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import { client, Page as PageType } from "client";

export interface PageProps {
  page: PageType | PageType["preview"]["node"] | null | undefined;
}

export function PageComponent({ page }: PageProps) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;

  // Use the "seo" object from the WP GraphQL SEOPress extension
  // Use other fields as needed.
  // @link https://github.com/moonmeister/wp-graphql-seopress#usage
  const { metaTitle, metaDesc } = page?.seo ?? {};

  return (
    <>
      <Header
        title={generalSettings.title}
        description={generalSettings.description}
      />

      <Head>
        <title>
          {metaTitle ?? `${page?.title()} - ${generalSettings.title}`}
        </title>

        {metaDesc && <meta name="description" content={metaDesc} />}
      </Head>

      <Hero
        title={page?.title()}
        bgImage={page?.featuredImage?.node.sourceUrl()}
      />

      <main className="content content-single">
        <div className="wrap">
          <div dangerouslySetInnerHTML={{ __html: page?.content() ?? "" }} />
        </div>
      </main>

      <Footer copyrightHolder={generalSettings.title} />
    </>
  );
}

export default function Page() {
  const { usePage } = client;
  const page = usePage();

  return <PageComponent page={page} />;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return getNextStaticProps(context, {
    Page,
    client,
    notFound: await is404(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
