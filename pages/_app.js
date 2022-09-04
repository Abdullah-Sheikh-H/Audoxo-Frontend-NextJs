import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import Moralis from "moralis"

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Audoxo</title>
        <meta name="description" content="Audoxo Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={true} serverUrl="" appId="">
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
