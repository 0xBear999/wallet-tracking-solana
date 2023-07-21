export const shortenString = (str: string, length = 6) => {
    if (str.length>12) return str.slice(0, length)+"..."+str.slice(-length);
    return str
}

export const sleep = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time))
  }