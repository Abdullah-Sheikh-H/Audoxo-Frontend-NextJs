import Link from "next/link"
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis"
import { useEffect, useState } from "react"
import { ConnectButton } from "web3uikit"
import abi from "../constants/contractAbi.json"
import { BigNumber, ethers } from "ethers"
import address from "../constants/contractAddress.json"

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr
  const separator = "..."
  const seperatorLength = separator.length
  const charsToShow = strLen - seperatorLength
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  )
}

export default function Header() {
  const [balance, setBalance] = useState(0)
  const contractProcessor = useWeb3ExecuteFunction()
  const { isWeb3Enabled, Moralis } = useMoralis()
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    isInitializing,
    isInitialized,
    isWeb3EnableLoading,
    logout,
  } = useMoralis()

  const options = {
    contractAddress: address,
    abi: abi,
    functionName: "getContractBalance",
    params: {},
  }

  useEffect(() => {
    // if (!isAuthenticated) {
    //   return
    // }
    if (isWeb3EnableLoading && !isWeb3Enabled) {
      Moralis.enableWeb3()
    }

    if (isAuthenticated || isWeb3EnableLoading) {
      const func = async () => {
        const data = await contractProcessor.fetch({
          params: options,
        })
        const porc = BigNumber.from(data)
        const eth = ethers.utils.formatEther(porc)
        setBalance(eth)
      }
      func()
    }
  }, [isWeb3Enabled])

  // const [address, setAddress] = useState("")

  // useEffect(() => {
  //   const enable = async () => {
  //     if (isAuthenticated) {
  //       await Moralis.enableWeb3()
  //       const address = truncateStr(user.get("ethAddress"), 15)
  //       setAddress(address)
  //     }
  //   }
  //   enable()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated])

  // const login = async () => {
  //   if (!isAuthenticated) {
  //     await authenticate({ signingMessage: "Log in using Moralis" }).catch(
  //       function (error) {
  //         console.log(error)
  //       }
  //     )
  //   }
  // }

  const logOut = async () => {
    await logout()
    console.log("logged out")
  }
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Audoxo</h1>
      <h1>
        <span className="font-medium text-lg">Contract Balance:</span> {balance}
        ETH
      </h1>
      <div className="flex flex-row items-center">
        <Link href="/">
          <a className="mr-4 p-6">Home</a>
        </Link>
        {isAuthenticated && (
          <Link href="/MintNft">
            <a className="mr-4 p-6">Mint NFT</a>
          </Link>
        )}
        {isAuthenticated && (
          <Link href="/Dashboard">
            <a className="mr-4 p-6">User Dashboard</a>
          </Link>
        )}
        {/* <div className="rounded-full hover:bg-teal-300 border-0 h-auto w-auto p-4 mx-3 bg-teal-400">
          {isAuthenticating ? (
            "Loading..."
          ) : (
            <button onClick={isAuthenticated ? logOut : login}>
              <span>{isAuthenticated ? `${address}` : "Connect MetaMask"}</span>
            </button>
          )}
        </div> */}
        <ConnectButton />
      </div>
    </nav>
  )
}
