'use client'
import { useEffect, useState } from 'react';
import { Token } from '../types';
import { shortenString } from '../utils';
import { Input, Button, Text, Tooltip, useToast } from '@chakra-ui/react'

interface Props {
    tokens: Token[],
    addToken: (token: Token) => void,
    removeToken: (tokenAddress: string) => void
}
const TokenList = ({tokens, addToken, removeToken}: Props) => {
	const [tokenName, setTokenName] = useState("");
	const [tokenAddress, setTokenAddress] = useState("");

	return (
		<div className='flex flex-col justify-between'>
      <div className='flex flex-col bg-gray-200 rounded mb-2'>
        <Text mb='8px' className='border-b-2 border-b-gray-600'>
          Token List
        </Text>
        {
          tokens.map((item, index) => {
            return(
              <div className='flex flex-row justify-between mb-3' key={index}>
                <span>
                  {item.name}
                </span>
                <span>
                  <Tooltip label={item.publicKey}>
                    <span className='cursor-pointer'>
                      {
                        shortenString(item.publicKey, 6)
                      }
                    </span>
                  </Tooltip>
                  {
                    index != 0 &&
                    <Tooltip label={'Remove token'}>
                      <span className='ml-2 mr-2 cursor-pointer' onClick={() => removeToken(item.publicKey)}>
                        X
                      </span>
                    </Tooltip>
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
						placeholder='Token name...'
						type={"text"}  
						size='sm' 
						width='auto' 
						value={tokenName} 
						onChange={(e) => setTokenName(e.target.value)} 
            className='mb-5'
            variant='filled' 
					/>
				<Input 
          focusBorderColor='pink.400'
          placeholder='Token address...' 
          type={"text"}  
          size='sm' 
          width='auto' 
          value={tokenAddress} 
          onChange={(e) => setTokenAddress(e.target.value)} 
          className='mb-5'
          variant='filled' 
        />
				<Button 
          onClick={() => addToken({name: tokenName, publicKey: tokenAddress})}
          colorScheme='blue'
          bgColor={'blue.400'}
          variant='solid'
          className='bg-yellow-500'
        >
					Add
				</Button>
			</div>
		</div>
			
	)
}

export default TokenList