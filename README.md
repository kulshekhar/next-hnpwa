# A PWA made using Next.js and the Hacker News API 

- Single page app
- Works just as well with JavaScript disabled
- Code split and bundled to minimize the payload on the first visit (automatically done by Next.js)

## Served Using Firebase Functions and Static Hosting

https://next-fb-hnpwa.firebaseapp.com/

### Local Lighthouse Results:

![Local Lighthouse](performance/fb-local-lighthouse.png)

### WebPageTest.org Results:

![Local Lighthouse](performance/fb-webpagetest.png)

Complete results: https://www.webpagetest.org/result/170923_0Q_ee3d10dc5b386229a2ad0ec4ea1abf9e/

## Hosted on Heroku

https://next-hnpwa.herokuapp.com

### Local Lighthouse Results:

![Local Lighthouse](performance/heroku-local-lighthouse.png)

### WebPageTest.org Results:

![Local Lighthouse](performance/heroku-webpagetest1.png)

The timings that resulted in an `F` for the 'First Byte Time' are as shown below:

![Local Lighthouse](performance/heroku-webpagetest2.png)

Complete results: https://www.webpagetest.org/result/170923_TJ_70e85a49a2ab814ff7134a8019384b20/
