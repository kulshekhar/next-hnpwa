export function getPageTitle(pathname: string): string {
  const postfix = 'Next.js Firebase Hacker News';
  switch (pathname) {
    case '/':
    case '/top':
    case 'top':
      return postfix;
    case '/new':
    case 'new':
      return `New Links | ${postfix}`;
    case '/best':
    case 'best':
      return `Best Links | ${postfix}`;
    case '/show':
    case 'show':
      return `Show | ${postfix}`;
    case '/ask':
    case 'ask':
      return `Ask | ${postfix}`;
    case '/job':
    case 'job':
      return `Jobs | ${postfix}`;
  }
}
