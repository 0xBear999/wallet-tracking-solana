'use client'
import { useEffect, useState, CSSProperties } from 'react';
import { INIT_TOKEN } from '../const';
import { Token, TransactionLog } from '../types';
import TokenList from './tokens';
import { useToast } from '@chakra-ui/react'
import WalletList from './wallets';
import DatePanel from './datePanel';
import { PublicKey } from '@solana/web3.js';
import { fetchTxs } from '../../lib/util';
import { CSVLink, CSVDownload } from "react-csv";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
  };
const Dashboard = () => {
	const [tokens, setTokens] = useState<Token[]>([INIT_TOKEN]);
	const [wallets, setWallets] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [resultData, setResultdata] = useState<TransactionLog[]>([])

	const date = new Date();
	const [fromDate, setFromDate] = useState(date.getFullYear() + "-" +((date.getMonth()+1).toString().length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" + (date.getDate().toString().length != 2 ?"0" + date.getDate() : date.getDate()))
	const [toDate, setToDate] = useState(date.getFullYear() + "-" +((date.getMonth()+1).toString().length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" + (date.getDate().toString().length != 2 ?"0" + date.getDate() : date.getDate()))

	const toast = useToast()

	const addToken = (newToken: Token) => {
		if (!newToken.name || !newToken.publicKey) {
			toast({
			  title: 'Invalid Token Info.',
			  description: "Please check the token name and address again!",
			  status: 'error',
			  duration: 3000,
			  isClosable: true,
			  })
			return;
		  }
		  try {
			  let publicKey = new PublicKey(newToken.publicKey)
			  console.log(publicKey.toBase58())
			  if (tokens.filter(item => item.publicKey == newToken.publicKey).length>0) {
          toast({
            title: 'Already registered.',
            description: "Token address duplicated!",
            status: 'error',
            duration: 3000,
            isClosable: true,
            })
          return
        } else {
          setTokens([...tokens, newToken])
          toast({
            title: 'Successfully registered.',
            description: "Token register successed.",
            status: 'success',
            duration: 3000,
            isClosable: true,
            })
        }
			  
			} catch (e) {
			  console.log(e);
			  toast({
				title: 'Invalid Token Info.',
				description: "Please check the token name and address again!",
				status: 'error',
				duration: 3000,
				isClosable: true,
			  })
			}

		

	}

	const removeToken = (tokenAddress: string) => {
    setTokens(tokens.filter(token => token.publicKey!=tokenAddress))
    toast({
      title: 'Token removed.',
      description: "Successfully token removed!",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

	const addWallet = (wallet: string) => {
		setWallets([...wallets, wallet]);
	}

	const removeWallet = () => {
		
	}

  const search = async () => {
	setLoading(true)
    let result = await fetchTxs(wallets, tokens, new Date(fromDate).getTime()/1000, new Date(toDate).getTime()/1000)
	setResultdata(result)
	setLoading(false)
  }
    
	return (
		<div>
			<div className='grid grid-cols-3 gap-8'>
			<TokenList 
				tokens={tokens} 
				addToken={addToken} 
				removeToken={removeToken} />
			<WalletList 
				addWallet={addWallet}
				removeWallet={removeWallet}
				wallets={wallets}
			/>
			<DatePanel 
				fromDate={fromDate}
				setFromDate={setFromDate}
				toDate={toDate}
				setToDate={setToDate}
        		search={search}
			/>
			 
			{/* <CSVDownload data={resultData} target="_blank" />; */}

		</div>
		<div >
			<ClipLoader
				color={"#fff"}
				loading={loading}
				cssOverride={override}
				size={150}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
			{
				!loading && resultData.length>0 &&
				<CSVLink data={resultData}>Download</CSVLink>

			}
		</div>
		</div>
	)
}

export default Dashboard