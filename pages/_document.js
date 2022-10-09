import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en"> 
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link 
            href="https://fonts.googleapis.com/css2?family=Cookie&display=swap" 
            rel="stylesheet" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" 
            rel="stylesheet" />

          <link rel="stylesheet" href="/front/css/bootstrap.min.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/font-awesome.min.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/elegant-icons.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/jquery-ui.min.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/magnific-popup.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/owl.carousel.min.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/slicknav.min.css" type="text/css" />
          <link rel="stylesheet" href="/front/css/style.css" type="text/css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });
  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
