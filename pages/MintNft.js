import axios from "axios"
import { useEffect, useRef, useState } from "react"
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis"
import { Web3Storage } from "web3.storage"
import { useNotification } from "web3uikit"
import { useRouter } from "next/router"

import abi from "../constants/contractAbi.json"
import address from "../constants/contractAddress.json"

const MintNft = () => {
  const nameRef = useRef()
  const descriptionRef = useRef()
  const contractProcessor = useWeb3ExecuteFunction()
  const { isAuthenticated } = useMoralis()
  const [isLoading, setIsLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [nameIsValid, setNameIsValid] = useState(false)
  const [descriptionIsValid, setDescriptionIsValid] = useState(false)
  const [fileIsValid, setFileIsValid] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const dispatch = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (nameIsValid && descriptionIsValid && fileIsValid) {
      setFormIsValid(true)
    }
  }, [nameIsValid, descriptionIsValid, fileIsValid])

  let tokenUri

  const nameHandler = (event) => {
    const name = event.target.value

    if (name) {
      if (name.length > 2) {
        return setNameIsValid(true)
      } else {
        setNameIsValid(false)
      }
    } else {
      setNameIsValid(false)
    }
  }

  const descriptionHandler = (event) => {
    const description = event.target.value

    if (description) {
      if (description.length > 5) {
        return setDescriptionIsValid(true)
      } else {
        setDescriptionIsValid(false)
      }
    } else {
      setDescriptionIsValid(false)
    }
  }

  const fileHandler = (event) => {
    const file = event.target.value

    if (file) {
      return setFileIsValid(true)
    } else {
      setFileIsValid(false)
    }
  }

  const getImageUri = async () => {
    const data = metadatafile.files[0]

    if (!data) {
      return setIsEmpty(false)
    }

    const client = new Web3Storage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhYTJlOTZGNzY4NEFhNjgzNTE0ZEMxYkNDOGI3NUY3YUZENGNCMUQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjExODAyNTEyNTksIm5hbWUiOiJpbWFnZXMifQ.cokqnYRY3udCK_bN3b22XL5-j3Oj6h67J9nGDsesVGA",
    })

    const fileInput = document.querySelector('input[type="file"]')

    const rootCid = await client.put(fileInput.files) // Promise<CIDString>
    return `ipfs://${rootCid}/${data.name}`
  }

  function makeFileObjects(name, description, _imageUri) {
    const obj = {
      name: name,
      description: description,
      image: _imageUri,
    }
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" })

    const files = [new File([blob], `${name}.json`)]
    return files
  }

  const getMetadataUri = async (_imageUri) => {
    const name = nameRef.current.value
    const description = descriptionRef.current.value
    const metadata = await makeFileObjects(name, description, _imageUri)
    const client = new Web3Storage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhYTJlOTZGNzY4NEFhNjgzNTE0ZEMxYkNDOGI3NUY3YUZENGNCMUQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEyMzM1MjIxODAsIm5hbWUiOiJtZXRhZGF0YSJ9.oqONj-BglhHWGy6wKOP8zOEWJztKR98MJVXpCcZ8dLk",
    })

    const rootCid = await client.put(metadata, { name: name }) // Promise<CIDString>
    console.log(`ipfs://${rootCid}/${name}.json`)

    return `ipfs://${rootCid}/${name}.json`
  }

  const handleMint = async () => {
    dispatch({
      type: "success",
      title: "Item Minted",
      message: "Item Minted - Please refresh (and move Blocks)",
      position: "topR",
    })
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const imageUri = await getImageUri()
    console.log(imageUri)
    const metadataUri = await getMetadataUri(imageUri)
    tokenUri = metadataUri

    let options = {
      contractAddress: address,
      functionName: "mintToken",
      abi: abi,
      params: {
        _tokenURI: tokenUri,
      },
    }

    const mintNft = async () => {
      await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
          handleMint()
          setIsLoading(false)
          router.push("/Dashboard")
        },
        onError: (error) => {
          setIsLoading(false)
          alert(error)
        },
      })
    }

    await mintNft()
  }

  return (
    <div className=" h-11/12 w-full  ">
      <div className=" w-1/2 h-72 m-auto flex my-20 bg-slate-300 border-1 justify-center rounded-lg">
        <form onSubmit={formSubmitHandler} className="h-full w-full ">
          <div className=" mt-3 mb-3">
            <label className="w-11/12 flex m-auto" htmlFor="metadataName">
              Name:
            </label>
            <input
              ref={nameRef}
              onChange={nameHandler}
              onBlur={nameHandler}
              className="border-1 w-11/12 flex m-auto p-2 h-8 rounded"
              type="text"
              id="metadataName"
              name="Name"
            />
          </div>

          <div className=" mt-3 mb-3">
            <label
              className="w-11/12 flex m-auto"
              htmlFor="metadataDescription"
            >
              Description:
            </label>
            <input
              ref={descriptionRef}
              onChange={descriptionHandler}
              onBlur={descriptionHandler}
              className="border-1 w-11/12 flex m-auto p-2 h-8 rounded"
              type="text"
              id="metadataDescription"
              name="Description"
            />
          </div>
          <div className=" items-center flex mt-3 mb-3">
            <label className=" flex ml-6" htmlFor="metadatafile">
              Choose Audio File:
            </label>
            <input
              className=" rounded-full file:bg-slate-400 file:border-0 file:rounded-xl w-1/2 flex p-2"
              onChange={fileHandler}
              onBlur={fileHandler}
              type="file"
              accept="audio/*"
              id="metadatafile"
              name="Choose Audio File"
            />
          </div>
          <div className="flex ">
            {isLoading ? (
              <h3 className="m-auto h-auto w-auto flex">Minting...</h3>
            ) : (
              isAuthenticated && (
                <button
                  disabled={!formIsValid}
                  className=" m-auto flex rounded-full disabled:bg-slate-400 bg-slate-500 hover:bg-slate-400 py-2 px-5"
                  type="submit"
                >
                  Mint
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MintNft
