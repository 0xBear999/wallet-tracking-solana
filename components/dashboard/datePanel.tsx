import { Button, Input, Text } from '@chakra-ui/react';

interface Props {
  fromDate: string,
  toDate: string,
  setFromDate: (data: string) => void,
  setToDate: (data: string) => void,
  search: () => void
}
const DatePanel = ({ fromDate, toDate, setFromDate, setToDate, search }: Props) => {
  
  return (
    <div className='flex flex-col justify-between'>
      <div className='flex flex-col mb-2'>
      <Text mb='8px' className='border-b-2 border-b-gray-600' >
        From
      </Text>
      <Input
        placeholder="Select Date and Time"
        size="md"
        type="date"
        value={fromDate}
        // defaultValue={new Date().toString()}
        onChange={(e) => {setFromDate(e.target.value); console.log(e.target.value)}}

      />
      <Text mb='8px' className='border-b-2 border-b-gray-600' >
        To
      </Text>
      <Input
        placeholder="Select Date and Time"
        size="md"
        type="date"
        defaultValue={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      </div>
      <Button
        onClick={search}
        colorScheme='blue'
        bgColor={'blue.400'}
        variant='solid'
        className='bg-yellow-500'
      >
        Track!
      </Button>
    </div>
  )
}

export default DatePanel