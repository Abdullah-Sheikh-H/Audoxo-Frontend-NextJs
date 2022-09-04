import Image from "next/image"
import styles from "../styles/Home.module.css"
import abi from "../constants/contractAbi.json"
import { useEffect, useState } from "react"
import Moralis from "moralis"
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis"
import NFTBox from "../components/NFTBox"
import { ethers } from "ethers"
import address from "../constants/contractAddress.json"

export default function Home() {
  const contractProcessor = useWeb3ExecuteFunction()
  const [nfts, setNfts] = useState([])
  const { account, isWeb3Enabled, isInitialized } = useMoralis()

  useEffect(() => {
    const func = async () => {
      await loadNFTs()
    }
    func()
    if (isInitialized) {
      async function createLiveQuery() {
        let query = new Moralis.Query("items")
        let subscription = await query.subscribe()

        subscription.on("update", (object) => {
          if (object.attributes.seller) {
            func()
          }
        })
      }
      createLiveQuery()
    }
  }, [account, isWeb3Enabled, isInitialized])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(address, abi, provider)
    const data = await contract.fetchMarketItems()

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId)

        let price = ethers.utils.formatUnits(i.price.toString(), "ether")
        let item = {
          price: i.price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          tokenURI: tokenUri,
        }
        return item
      })
    )
    return setNfts(items)
  }

  return (
    <div>
      <h1 className="text-3xl m-auto pt-2 flex font-medium h-auto w-20 ">
        Listings
      </h1>
      <div>
        <ul className="flex mt-5">
          {nfts.map((i) => (
            <li className="ml-5" key={i.tokenId.toString()}>
              <NFTBox
                price={i.price.toString()}
                tokenId={i.tokenId.toString()}
                seller={i.seller.toString()}
                owner={i.owner}
                tokenURI={i.tokenURI.toString()}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
