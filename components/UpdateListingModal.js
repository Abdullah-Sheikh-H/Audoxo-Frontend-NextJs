import { useEffect, useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis"
import { BigNumber, ethers } from "ethers"
import abi from "../constants/contractAbi.json"
import address from "../constants/contractAddress.json"

export default function UpdateListingPrice({ tokenId, isVisible, onClose }) {
  const [priceToUpdateListingWith, setpriceToUpdateListingWith] = useState(0)
  const dispatch = useNotification()
  const contractProcessor = useWeb3ExecuteFunction()

  const [withdrawAmt, setWithdrawAmt] = useState()

  useEffect(() => {
    const func = async () => {
      await getListingPrice()
    }
    func()
  }, [])

  const getListingPrice = async () => {
    let options = {
      abi: abi,
      contractAddress: address,
      functionName: "getListingPrice",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    const porc = BigNumber.from(data)
    const eth = ethers.utils.formatEther(porc)
    setWithdrawAmt(data)
  }

  const handleUpdateListingAddress = async (tx) => {
    await tx.wait(1)
    dispatch({
      type: "success",
      title: "Item Listed",
      message: "Item Listed - Please refresh (and move Blocks)",
      position: "topR",
    })
    onClose && onClose()
    setpriceToUpdateListingWith("0")
  }

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "createMarketItem",
    params: {
      tokenId: tokenId,
      price: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
    msgValue: withdrawAmt,
  })

  return (
    <div>
      <Modal
        title={<h1>List Item</h1>}
        isVisible={isVisible}
        onCancel={onClose}
        onCloseButtonPressed={onClose}
        onOk={async () => {
          await getListingPrice()
          updateListing({
            onError: (error) => {
              console.log(error)
            },
            onSuccess: handleUpdateListingAddress,
          })
        }}
      >
        <Input
          label="List NFT (ETH)"
          name="Listing Price"
          type="number"
          onChange={(event) => {
            setpriceToUpdateListingWith(event.target.value)
          }}
        />
      </Modal>
    </div>
  )
}
