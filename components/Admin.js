import { BigNumber, ethers } from "ethers"
import Moralis from "moralis"
import { useEffect, useRef, useState } from "react"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import abi from "../constants/contractAbi.json"
import contractAddress from "../constants/contractAddress.json"

const Admin = () => {
  console.log(contractAddress)
  const { account, isWeb3Enabled, isWeb3EnableLoading } = useMoralis()
  const contractProcessor = useWeb3ExecuteFunction()
  const [isloading, setisloading] = useState()

  useEffect(() => {
    const func = async () => {
      await getPublicMintState()
      await getRevealState()
      await getMintPauseState()
      await getContractPauseState()
      await getAdmins()
      await getMintLimit()
      await getListingFee()
      await getListingProceeds()
    }

    if ((isWeb3Enabled && !isWeb3EnableLoading) || !isloading) {
      func()
    }
  }, [isWeb3Enabled, isloading])

  //public Mint
  const [publicMintState, setPublicMintState] = useState()

  const getPublicMintState = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getPublicMintState",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setPublicMintState(data)
  }
  const publicMintHandler = async () => {
    setisloading(true)
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "togglePublicMinting",
      params: {},
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getPublicMintState()
      },
      onError: (error) => {
        setisloading(false)
        alert(error)
      },
    })
  }

  //Reveal
  const [revealState, setRevealState] = useState()

  const getRevealState = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getRevealState",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setRevealState(data)
  }
  const revealHandler = async () => {
    setisloading(true)
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "toggleReveal",
      params: {},
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getRevealState()
      },
      onError: (error) => {
        setisloading(false)
        alert(error)
      },
    })
  }

  //Mint Pause
  const [mintPauseState, setMintPauseState] = useState()

  const getMintPauseState = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getMintPauseStatus",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setMintPauseState(data)
  }
  const mintPauseHandler = async () => {
    setisloading(true)
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "toggleMintPause",
      params: {},
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getMintPauseState()
      },
      onError: (error) => {
        setisloading(false)
        alert(error)
      },
    })
  }

  //Contract Pause
  const [contractPauseState, setContractPauseState] = useState()

  const getContractPauseState = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getPauseState",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setContractPauseState(data)
  }
  const contractPauseHandler = async () => {
    setisloading(true)
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "togglePause",
      params: {},
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getContractPauseState()
      },
      onError: (error) => {
        setisloading(false)
        alert(error)
      },
    })
  }

  //admin
  const [admins, setAdmins] = useState([])
  const adminRef = useRef()
  const [addOrRemove, setAddOrRemove] = useState(true)
  const [toAdmin, setToAdmin] = useState("")

  const removeHandler = async (e) => {
    setAddOrRemove(false)
    await getAdmins()
    console.log(toAdmin)
  }

  const addHandler = (e) => {
    setAddOrRemove(true)
  }

  const getAdmins = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getVipAddresses",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setAdmins(data)
  }

  const adminHandler = async (event) => {
    event.preventDefault()
    setisloading(true)

    const adminAdd = adminRef.current.value.toString()
    console.log(adminAdd)

    let options

    if (addOrRemove) {
      options = {
        abi: abi,
        contractAddress: contractAddress,
        functionName: "setVip",
        params: { toVip: adminAdd },
      }
      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          setisloading(false)
          await getAdmins()
        },
        onError: (error) => {
          setisloading(false)
          alert(error.message)
        },
      })
    } else if (!addOrRemove) {
      options = {
        abi: abi,
        contractAddress: contractAddress,
        functionName: "removeVip",
        params: { toVip: adminAdd },
      }
      await contractProcessor.fetch({
        params: options,
        onSuccess: async () => {
          setisloading(false)
          await getAdmins()
        },
        onError: (error) => {
          setisloading(false)
          alert(error.message)
        },
      })
    }
  }

  //Change mint limit
  const [mintLimit, setMintLimit] = useState()

  const getMintLimit = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getMintLimit",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    setMintLimit(data.toNumber())
  }
  const changeMintLimitHandler = async (e) => {
    e.preventDefault()
    const val = e.target[0].value
    console.log(val)
    setisloading(true)
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "updateMintLimit",
      params: { newLimit: val },
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getMintLimit()
      },
      onError: (error) => {
        setisloading(false)
        alert(error)
      },
    })
  }

  //Change Listing Fee
  const [listingFee, setListingFee] = useState()

  const getListingFee = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getListingPrice",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    const porc = BigNumber.from(data)
    const eth = ethers.utils.formatEther(porc)
    setListingFee(eth)
  }

  const listingFeeHandler = async (event) => {
    event.preventDefault()
    setisloading(true)

    const newFee = event.target[0].value.toString()
    const fee = ethers.utils.parseUnits(newFee, "ether")

    let options

    options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "updateListingPrice",
      params: { _listingPrice: fee },
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getListingFee()
      },
      onError: (error) => {
        setisloading(false)
        alert(error.message)
      },
    })
  }

  //Change mint limit for specfic user
  const userMintLimitHandler = async (event) => {
    event.preventDefault()
    setisloading(true)

    const userAddress = event.target[0].value.toString()
    console.log(typeof userAddress)
    const userLimit = event.target[1].value
    const lim = Number(userLimit)
    console.log(typeof lim)
    console.log(userAddress, userLimit)

    let foptions = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "updateUserLimit",
      params: { toReset: userAddress, listingAmt: lim },
    }
    await contractProcessor.fetch({
      params: foptions,
      onSuccess: async () => {
        setisloading(false)
      },
      onError: (error) => {
        setisloading(false)
        alert(error.message)
      },
    })
  }

  //withdraw
  const [withdrawAmt, setWithdrawAmt] = useState()

  const getListingProceeds = async () => {
    let options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "getListingProceeds",
      params: {},
    }
    const data = await contractProcessor.fetch({
      params: options,
    })
    if (data) {
      const porc = BigNumber.from(data)
      const eth = ethers.utils.formatEther(porc)
      setWithdrawAmt(eth)
    }
  }

  const withdrawHandler = async () => {
    let options

    options = {
      abi: abi,
      contractAddress: contractAddress,
      functionName: "withdrawListingPrice",
      params: {},
    }
    await contractProcessor.fetch({
      params: options,
      onSuccess: async () => {
        setisloading(false)
        await getListingProceeds()
      },
      onError: (error) => {
        setisloading(false)
        alert(error.message)
      },
    })
  }

  return (
    <div className="border-t-2 my-3">
      <h1 className="font-bold my-3 text-lg m-auto w-fit ">
        Admin(Contract Owner)
      </h1>
      <div>
        <div className="flex-row w-fit flex my-3">
          <h2 className="w-fit mx-2 font-medium">
            Click to toggle Public Mint:{" "}
          </h2>
          <button
            onClick={publicMintHandler}
            disabled={isloading}
            className="w-fit border-0 bg-slate-400 py-0.5 px-2 rounded-full"
          >
            {publicMintState ? "Disable" : "Enable"} Public Mint
          </button>
        </div>
        <div className="flex-row w-fit flex my-3">
          <h2 className="w-fit mx-2 font-medium">
            Click to toggle Reveal State:{" "}
          </h2>
          <button
            onClick={revealHandler}
            disabled={isloading}
            className="w-fit border-0 bg-slate-400 py-0.5 px-2 rounded-full"
          >
            {revealState ? "Unreveal" : "Reveal"}
          </button>
        </div>
        <div className="flex-row w-fit flex my-3">
          <h2 className="w-fit mx-2 font-medium">
            Click to toggle Mint Pause State:{" "}
          </h2>
          <button
            onClick={mintPauseHandler}
            disabled={isloading}
            className="w-fit border-0 bg-slate-400 py-0.5 px-2 rounded-full"
          >
            {mintPauseState ? "Unpause" : "Pause"} Minting
          </button>
        </div>
        <div className="flex-row w-fit flex my-3">
          <h2 className="w-fit mx-2 font-medium">
            Click to toggle Contract Pause State:{" "}
          </h2>
          <button
            onClick={contractPauseHandler}
            disabled={isloading}
            className="w-fit border-0 bg-slate-400 py-0.5 px-2 rounded-full"
          >
            {contractPauseState ? "Unpause" : "Pause"} Contract
          </button>
        </div>
        <form onSubmit={adminHandler} className="flex-row w-fit flex my-3 ">
          <h1 className="w-fit mx-2 font-medium">
            Add or Remove Admin Addresses:
          </h1>
          <div className="border-0 rounded-lg bg-slate-400 flex flex-row">
            {" "}
            <div className="border-0 bg-slate-400 rounded-full px-2">
              <input
                type="radio"
                id="contactChoice1"
                name="Vip"
                value="add"
                onChange={addHandler}
                checked={addOrRemove}
              />
              <label className="mr-3" htmlFor="contactChoice1">
                Add Admin
              </label>

              <input
                type="radio"
                id="contactChoice2"
                name="Vip"
                value="remove"
                onClick={removeHandler}
              />
              <label className="mr-3" htmlFor="contactChoice2">
                Remove Admin
              </label>
            </div>
            <div>
              <label className="" htmlFor="address">
                Address Admin:
              </label>
              {!addOrRemove ? (
                <select
                  ref={adminRef}
                  className="border-0 my-0.5 rounded-l-lg ml-2"
                >
                  {admins.map((admin) => (
                    <option key={admin} vlaue={admin}>
                      {admin}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  ref={adminRef}
                  onChange={(e) => setToAdmin(e.target.value)}
                  className="border-0 rounded-l-lg ml-2"
                  id="address"
                  type="text"
                />
              )}
              <button
                type="submit"
                disabled={isloading}
                className="w-fit border-r-0 hover:bg-slate-400 bg-slate-500  py-0.5 px-2 rounded-r-lg"
              >
                {addOrRemove ? "Add" : "Remove"}
              </button>
            </div>
          </div>
        </form>
        <form
          onSubmit={changeMintLimitHandler}
          className="flex-row w-fit flex my-3 "
        >
          <h1 className="w-fit mx-2 font-medium">Change Mint Limit:</h1>
          <div className="border-0 rounded-lg bg-slate-400 flex flex-row">
            <p className="mt-0.5 ml-1 mr-2">Current Mint Limit: {mintLimit}</p>
            <div>
              <label className="ml-2" htmlFor="mintlimit">
                Enter Mint Limit:
              </label>
              <input
                className="border-0 rounded-l-lg ml-2"
                id="mintlimit"
                type="number"
              />
              <button
                type="submit"
                disabled={isloading}
                className="w-fit border-r-0 hover:bg-slate-400 bg-slate-500  py-0.5 px-2 rounded-r-lg"
              >
                Update
              </button>
            </div>
          </div>
        </form>
        <form
          onSubmit={listingFeeHandler}
          className="flex-row w-fit flex my-3 "
        >
          <h1 className="w-fit mx-2 font-medium">Change Listing Fee:</h1>
          <div className="border-0 rounded-lg bg-slate-400 flex flex-row">
            <p className="mt-0.5 ml-1 mr-2">
              Current Listing Fee: {listingFee}
            </p>
            <div>
              <label className="ml-2" htmlFor="changeFee">
                Enter New Listing Fee:
              </label>
              <input
                className="border-0 rounded-l-lg ml-2"
                id="changeFee"
                type="number"
              />
              <button
                isloading={isloading}
                type="submit"
                className="w-fit border-r-0 hover:bg-slate-400 bg-slate-500  py-0.5 px-2 rounded-r-lg"
              >
                Update
              </button>
            </div>
          </div>
        </form>
        <form
          onSubmit={userMintLimitHandler}
          className="flex-row w-fit flex my-3 "
        >
          <h1 className="w-fit mx-2 font-medium">
            Give User more Minting Limit:
          </h1>
          <div className="border-0 rounded-lg bg-slate-400 flex flex-row">
            <div>
              <label className="ml-2" htmlFor="userlimit">
                Enter Number of Mints:
              </label>
              <input
                className="border-0 w-12 pl-1.5 rounded-lg ml-2"
                id="userlimit"
                type="number"
              />
              <label className="ml-2" htmlFor="useraddress">
                Enter Address of User:
              </label>
              <input
                className="border-0 rounded-l-lg ml-2"
                id="useraddress"
                type="text"
              />
              <button
                disabled={isloading}
                type="submit"
                className="w-fit border-r-0 hover:bg-slate-400 bg-slate-500  py-0.5 px-2 rounded-r-lg"
              >
                Update
              </button>
            </div>
          </div>
        </form>
        <div className="flex-row w-fit flex my-3">
          <h2 className="w-fit mx-2 font-medium">
            Click to Withdraw Listing Fees Proceeds:{" "}
          </h2>
          <div className="border-0 rounded-lg bg-slate-400 flex flex-row">
            <p className="mt-0.5 ml-1 mr-2">Current Proceeds: {withdrawAmt}</p>
            <button
              disabled={isloading}
              onClick={withdrawHandler}
              className="w-fit border-0 bg-slate-500 py-0.5 px-2 rounded-r-lg"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
