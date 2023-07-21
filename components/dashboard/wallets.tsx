import { useEffect, useState } from 'react';
import { Token } from '../types';
import { shortenString } from '../utils';
import { Input, Button, Text, Tooltip, useToast } from '@chakra-ui/react'
import { PublicKey } from '@solana/web3.js';

interface Props {
    wallets: string[],
    addWallet: (wallet: string) => void,
    removeWallet: () => void
}
const WalletList = ({wallets, addWallet, removeWallet}: Props) => {
	const [walletAddress, setWalletAddress] = useState("");

  const toast = useToast();

  const addWalletEventHandler = () => {
    if (!walletAddress) {
      console.log(">>>")
      toast({
				title: 'Invalid Wallet Address.',
				description: "Please check the wallet address again!",
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
      return;
    }
    if (wallets.includes(walletAddress)) {
      toast({
				title: 'Already registered!',
				description: "Wallet address is exists in the current list!",
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
      return;
    } else {
      try {
        let publicKey = new PublicKey(walletAddress)
        console.log(publicKey.toBase58())
        addWallet(walletAddress)
        toast({
          title: 'Wallet Register Success!',
          description: "Please check the wallet address again!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (e) {
        console.log(e)
        toast({
          title: 'Invalid Wallet Address!',
          description: "Please check the wallet address again!",
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      
    }
  }

	return (
		<div className='flex flex-col justify-between'>
      <div className='flex flex-col bg-gray-200  rounded mb-2'>
        <Text mb='8px' className='border-b-2 border-b-gray-600' >
          Wallet List</Text>
        {
          wallets.map((item, index) => {
            return(
              <div className='flex flex-row justify-between mb-3' key={index}>
                <span>
                  {
                    shortenString(item, 8)
                  }
                </span>
              </div>
            )
          })
        }
      </div>
			<div className='flex flex-col'>
        
        <Input 
            focusBorderColor='pink.400'
            placeholder='Wallet Address...'
            type={"text"}  
            size='sm' 
            width='auto' 
            value={walletAddress} 
            onChange={(e) => setWalletAddress(e.target.value)} 
            className='mb-5'
            variant='filled' 
					/>
        <Button 
          onClick={addWalletEventHandler}
          colorScheme='blue'
          bgColor={'blue.400'}
          variant='solid'
          className='bg-yellow-500 w-full'
        >
            Add Wallet
        </Button>
			</div>
		</div>
			
	)
}

export default WalletList