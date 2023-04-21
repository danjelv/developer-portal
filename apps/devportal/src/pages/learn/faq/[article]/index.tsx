import fs from 'fs';
import path from 'path';

// Scripts
import { getPageContent, getPageInfo, getPartialsAsArray } from '@/src/common/page-info';
import { getFaqPaths } from '@/src/common/static-paths';
// Interfaces
import { PageInfo, PartialData } from '@/src/interfaces/page-info';
// Components
import GenericContentPage from '@/src/layouts/GenericContentPage';
import MultiPageNav from '@/src/layouts/MultiPageNav';

import { ContentPagerContext, CustomNavContext, CustomNavData } from 'ui/common/types/contentPager';
import ContentPager from 'ui/components/common/ContentPager';

export async function getStaticPaths() {
  const articlePaths = await getFaqPaths();
  return {
    paths: articlePaths,
    fallback: false,
  };
}

export async function getStaticProps(navContext: { params: CustomNavContext; context: any }) {
  const basePath = '/learn/faq';
  const navDataFile = path.join(process.cwd(), `data/faqs/${navContext?.params?.article}.json`);
  const navData: CustomNavData = JSON.parse(fs.readFileSync(navDataFile, { encoding: 'utf-8' }));
  const pageInfo = await getPageInfo(`learn/faq/${navContext?.params?.article}`, navContext.context.preview ? navContext.context.preview : null);

  // Set next/previous routes
  const pagingInfo: ContentPagerContext = {
    previous: null,
    next: navData.routes[0],
  };

  //Load page content if available. If not, load page partials. Supports simple articles with only single page Markdown file and no partials
  const partials = pageInfo?.content ? await getPageContent(pageInfo) : pageInfo?.partials ? await getPartialsAsArray(pageInfo.partials) : [];

  return {
    props: {
      pageInfo,
      partials,
      context: navContext.params,
      navData,
      basePath,
      pagingInfo,
    },
    revalidate: 600, // 10 minutes
  };
}

type ArticlePageProps = {
  pageInfo: PageInfo;
  partials: PartialData;
  navContext: CustomNavContext;
  navData: CustomNavData;
  basePath: string;
  pagingInfo: ContentPagerContext;
};

const ArticlePage = ({ pageInfo, partials, navContext, navData, basePath, pagingInfo }: ArticlePageProps): JSX.Element => {
  const CustomNav = <MultiPageNav context={navContext} navData={navData} root={basePath} />;
  const CustomNavPager = <ContentPager context={navContext} paging={pagingInfo} root={basePath} />;

  return <GenericContentPage pageInfo={pageInfo} partials={partials} customNav={CustomNav} customNavPager={CustomNavPager} />;
};

export default ArticlePage;
