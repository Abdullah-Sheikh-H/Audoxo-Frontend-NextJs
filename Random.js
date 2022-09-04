// const client = create('https://storageapi.fleek.co/b1d7d542-fbb0-47e3-8b04-0abe7014cd84-bucket')

//   try {
//     const added = await client.add(file)
//     const url = `https://ipfs.fleek.co/ipfs/QmTecfbJp9xpxoGur23fBEUYQCta7MCKygGyCMa4YQcp1D/data/${added.path}`
//     updateFileUrl(url)
//   } catch (error) {
//     console.log('Error uploading file: ', error)
//   }

// const imgObj = {
//   path: `data/${data.name}`,
//   content: data.toString("base64"),
// }

//   const options = {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-API-Key': 'Zclb9VTj5yi2czN6btYwEfoV5s9YXVCD4vjzKpJgvsITIU2SQVPsnuZvwgnoAtpP'
//     },
//     body: JSON.stringify([
//       {
//         content:img,
//         path: `data/${data.name}`
//       }
//     ])
//   };

//   fetch('https://deep-index.moralis.io/api/v2/ipfs/uploadFolder', options)
// .then(response => response.json())
// .then(response => console.log(response))
// .catch(err => console.error(err));

// const res = await axios.post(
//   "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
//   imgObj,
//   {
//     headers: {
//       "X-API-KEY":
//         "Zclb9VTj5yi2czN6btYwEfoV5s9YXVCD4vjzKpJgvsITIU2SQVPsnuZvwgnoAtpP",
//       "Content-Type": "application/json",
//       "accept": "application/json",
//     },
//   }
// )
// console.log(res)

// return res

// const file = await saveFile(data.name, data, { saveIPFS: true })
// console.log(file)
// await file.saveIPFS()
// return file.ipfs()

// const file = await new saveFile(
//   `${name}.json`,
//   { base64: btoa(JSON.stringify(metadata)) },
//   {
//     type: "base64",
//     saveIPFS: true,
//   }
// )

// const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// const { isAuthenticated } = useMoralis()
// // const { runContractFunction } = useWeb3Contract()
// const contractProcessor = useWeb3ExecuteFunction()
// // const [resp, setRes] = useState()
// const [_data, setData] = useState()

// const { runContractFunction: fetchMarketItems } = useWeb3Contract({
//   contractAddress: address,
//   functionName: "fetchMarketItems",
//   abi: abi,
//   params: {},
// })

// const fetchUri = contractProcessor.fetch({
//   contractAddress: address,
//   abi: {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "tokenId",
//         type: "uint256",
//       },
//     ],
//     name: "tokenURI",
//     outputs: [
//       {
//         internalType: "string",
//         name: "",
//         type: "string",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   functionName: "tokenURI",
//   params: { tokenId: 2 },
// })
// // const _tokenUri = async (_tokenId) => {
// //   const uri = await fetchUri()

// //   return uri
// // }

// let data

// const clickHandler = async () => {
//   // const data = await Moralis.executeFunction({
//   //   contractAddress: address,
//   //   functionName: "fetchMyNFTs",
//   //   abi: abi,
//   // })
//   const items = await fetchMarketItems()

//   data = await Promise.all(
//     items.map(async (i) => {
//       const tokenUri = await fetchUri(i.tokenId)
//       console.log(tokenUri)
//       return (
//         <li>
//           <NFTBox
//             key={i.tokenId.toString()}
//             price={i.price.toString()}
//             tokenId={i.tokenId.toString()}
//             seller={i.seller}
//             owner={i.owner}
//             tokenURI={tokenUri}
//           />
//         </li>
//       )
//     })
//   )
//   // const res = JSON.stringify(data, null, 2)

//   console.log(items)
// }

// useEffect(() => {
//   // const get = async () => {
//   //   await fetch()
//   //   console.log(data)
//   // }
//   // if (isAuthenticated) {
//   //   get()
//   // }

//   const func = async () => {
//     const items = await fetchMarketItems()
//     data = await Promise.all(
//       items.map(async (i) => {
//         const tokenUri = await fetchUri(i.tokenId)
//         console.log(tokenUri)
//         return (
//           <li>
//             <NFTBox
//               key={i.tokenId.toString()}
//               price={i.price.toString()}
//               tokenId={i.tokenId.toString()}
//               seller={i.seller}
//               owner={i.owner}
//               tokenURI={tokenUri}
//             />
//           </li>
//         )
//       })
//     )

//     setData(data)
//     // const res = JSON.stringify(data, null, 2)

//     console.log(items)
//   }
//   func()
// }, [isAuthenticated])
