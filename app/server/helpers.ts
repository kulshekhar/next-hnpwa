export function getPageDetails(pathname: string): PageDetails {
  const postfix = 'Next.js Firebase Hacker News';
  switch (pathname) {
    case '/':
    case '/top':
    case 'top':
      return {
        title: postfix,
        page: 'top'
      };
    case '/new':
    case 'new':
      return {
        title: `New Links | ${postfix}`,
        page: 'new'
      };
    case '/best':
    case 'best':
      return {
        title: `Best Links | ${postfix}`,
        page: 'best'
      };
    case '/show':
    case 'show':
      return {
        title: `Show | ${postfix}`,
        page: 'show'
      };
    case '/ask':
    case 'ask':
      return {
        title: `Ask | ${postfix}`,
        page: 'ask'
      };
    case '/job':
    case 'job':
      return {
        title: `Jobs | ${postfix}`,
        page: 'job'
      };
  }
}

type PageDetails = {
  title: string;
  page: string;
};
