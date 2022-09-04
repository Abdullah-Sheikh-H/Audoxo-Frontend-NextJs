import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import abi from "../constants/contractAbi.json"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingPrice from "./UpdateListingModal"
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

export default function NFTBox({ price, tokenId, seller, owner, tokenURI }) {
  const dispatch = useNotification()
  const {
    isWeb3Enabled,
    isAuthenticated,
    Moralis,
    account,
    isWeb3EnableLoading,
  } = useMoralis()
  const [imageURI, setImageURI] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenDescription, setTokenDescription] = useState("")
  const [showModal, setShowModal] = useState(false)

  const hideModal = () => {
    setShowModal(false)
  }

  // const { runContractFunction: getTokenURI } = useWeb3Contract({
  //   abi: BasicNftAbi,
  //   contractAddress: nftAddress,
  //   functionName: "tokenURI",
  //   params: { tokenId: tokenId },
  // })

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "createMarketSale",
    msgValue: price,
    params: {
      tokenId: tokenId,
    },
  })

  const isOwnedByUser = seller == account || owner == account
  const isNotOwner =
    seller === "0x0000000000000000000000000000000000000000" && owner !== account
  const IsNotOwner = owner === address && seller !== account

  const fomattedSellerAddress = isOwnedByUser
    ? "You"
    : truncateStr(seller || "", 15)

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : (isNotOwner || IsNotOwner) &&
        buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        })
  }

  const handleBuyItemSuccess = function () {
    dispatch({
      type: "success",
      message: "Item Bought!",
      title: "Item Bought!",
      position: "topR",
    })
  }

  async function updateUI() {
    if (tokenURI) {
      console.log(tokenURI)
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      const tokenURIResponse = await (await fetch(requestURL)).json()
      const imageURI = tokenURIResponse.image
      const imageURIURl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      setImageURI(imageURIURl)
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
    }
  }

  useEffect(() => {
    const func = async () => {
      if (isAuthenticated) {
        if (isWeb3EnableLoading) {
          await Moralis.enableWeb3()
          updateUI()
        } else {
          updateUI()
        }
      }
    }
    func()
  }, [isWeb3Enabled, account])

  return (
    <div>
      <div className="w-auto">
        {imageURI ? (
          <div>
            <UpdateListingPrice
              isVisible={showModal}
              tokenId={tokenId}
              onClose={hideModal}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned By {fomattedSellerAddress}
                  </div>
                  <audio src={imageURI} controls={true} />
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, "ether")} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}
