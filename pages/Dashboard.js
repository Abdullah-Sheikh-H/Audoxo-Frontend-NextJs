import Image from "next/image"
import styles from "../styles/Home.module.css"
import abi from "../constants/contractAbi.json"
import { useEffect, useState } from "react"
import { Button, useNotification } from "web3uikit"
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis"
import NFTBox from "../components/NFTBox"
import { BigNumber, ethers } from "ethers"
import NFTBoxDashboard from "../components/NFTBoxDashboard"
import Admin from "../components/Admin"
import address from "../constants/contractAddress.json"

export default function Home() {
  const contractProcessor = useWeb3ExecuteFunction()
  const {
    account,
    isWeb3Enabled,
    isInitialized,
    isWeb3EnableLoading,
    user,
    Moralis,
    initialize,
  } = useMoralis()
  const { runContractFunction } = useWeb3Contract()
  const [listedNfts, setListedNfts] = useState([])
  const [boughtNfts, setBoughtNfts] = useState([])
  const [proceeds, setProceeds] = useState("0")
  const dispatch = useNotification()
  const [data, setData] = useState([])
  const [isAdmin, setIsAdmin] = useState()

  useEffect(() => {
    const func = async () => {
      await loadListedNFTs()
      await loadBoughtNFTs()
      await getProceeds()
      await getAdmin()
    }
    if (isWeb3Enabled || isWeb3EnableLoading) {
      func()
    }
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

  async function getAdmin() {
    let User
    if (user) {
      User = await user.get("ethAddress")
    }
    const adm = await runContractFunction({
      params: {
        abi: abi,
        contractAddress: address,
        functionName: "owner",
        params: {},
      },
      onError: (error) => console.log(error),
    })
    if (adm) {
      if (account.toLowerCase() === adm.toLowerCase()) {
        setIsAdmin(true)
      }
    }
  }

  async function getProceeds() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: abi,
        contractAddress: address,
        functionName: "getProceeds",
        params: {},
      },
      onError: (error) => console.log(error),
    })
    if (returnedProceeds) {
      const porc = BigNumber.from(returnedProceeds)
      const eth = ethers.utils.formatEther(porc)
      const ethst = eth.toString()
      setProceeds(eth)
    }
  }

  async function loadBoughtNFTs() {
    // const provider = new ethers.providers.JsonRpcProvider()
    // const contract = new ethers.Contract(address, abi, provider)
    // const data = await contract.fetchMyNFTs()

    let dataBought = await runContractFunction({
      params: {
        abi: abi,
        contractAddress: address,
        functionName: "fetchMyNFTs",
        params: {},
      },
      onError: (error) => console.log(error),
    })

    if (dataBought) {
      const items = await Promise.all(
        dataBought.map(async (i) => {
          const tokenUri = await runContractFunction({
            params: {
              abi: abi,
              contractAddress: address,
              functionName: "tokenURI",
              params: { tokenId: i.tokenId },
            },
            onError: (error) => console.log(error),
          })

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
      return setBoughtNfts(items)
    }
  }

  async function loadListedNFTs() {
    // const provider = new ethers.providers.JsonRpcProvider()
    // const contract = new ethers.Contract(address, abi, provider)
    // const data = await contract.fetchItemsListed()
    const dataList = await runContractFunction({
      params: {
        abi: abi,
        contractAddress: address,
        functionName: "fetchItemsListed",
        params: {},
      },
      onError: (error) => console.log(error),
    })

    if (dataList) {
      const items = await Promise.all(
        dataList.map(async (i) => {
          const tokenUri = await runContractFunction({
            params: {
              abi: abi,
              contractAddress: address,
              functionName: "tokenURI",
              params: { tokenId: i.tokenId },
            },
            onError: (error) => console.log(error),
          })

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
      return setListedNfts(items)
    }
  }

  const handleWithdrawSuccess = async (tx) => {
    await tx.wait(1)
    dispatch({
      type: "success",
      message: "Withdrawing proceeds",
      position: "topR",
    })
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-medium m-3 ">Bougth Nfts:</h1>
        <ul className="flex mt-5">
          {boughtNfts.map((i) => (
            <li className="ml-5" key={i.tokenId.toString()}>
              <NFTBoxDashboard
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
      <div>
        <h1 className="text-lg font-medium m-3 ">Listed Nfts:</h1>
        <ul className="flex mt-5">
          {listedNfts.map((i) => (
            <li className="ml-5" key={i.tokenId.toString()}>
              <NFTBoxDashboard
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
      <div className="m-auto h-32 w-2/4 border rounded-lg bg-slate-400">
        <div className="m-auto p-3 w-fit">
          Withdraw {<span className="font-medium">{proceeds}</span>} ETH
          proceeds
        </div>
        {proceeds != "0" ? (
          <div className="m-auto p-3 w-fit">
            <Button
              onClick={() => {
                runContractFunction({
                  params: {
                    abi: abi,
                    contractAddress: address,
                    functionName: "withdrawProceeds",
                    params: {},
                  },
                  onError: (error) => console.log(error),
                  onSuccess: handleWithdrawSuccess,
                })
              }}
              text="Withdraw"
              type="button"
            />
          </div>
        ) : (
          <div className="m-auto p-3 w-fit">No proceeds detected</div>
        )}
      </div>
      {isAdmin && <Admin />}
    </div>
  )
}
