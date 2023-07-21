import { ConfirmedSignatureInfo, Connection, LAMPORTS_PER_SOL, ParsedInstruction, PublicKey } from "@solana/web3.js"
import { RPC_URL } from "../components/const";
import { Token, TransactionLog } from "../components/types";
import { sleep } from "../components/utils";

const solConnection = new Connection(RPC_URL, "confirmed")
export const fetchTxs = async (addresses: string[], tokens: Token[], fromTimestamp: number, toTimestamp: number): Promise<TransactionLog[]> => {
    try {
      // solConnection.getTransactions()
    console.log("fetching signatures...")
    let addressSignatures = new Map<string, ConfirmedSignatureInfo[]>();
    let transactionHistories = new Map<string, TransactionLog[]>();
    let resultData: TransactionLog[] = [];

    await Promise.allSettled(addresses.map(async address => {
      let signs:ConfirmedSignatureInfo[] = []
      let transactionLog: TransactionLog[] = [];

      do {
        if (signs.length== 0) {

          let signatures = await solConnection.getSignaturesForAddress(new PublicKey(address));
          console.log("fetched ", signatures.length, " for ", address)
          signs.push(...signatures)

          if (signatures.length<1000) break;
        } else {
          let signatures = await solConnection.getSignaturesForAddress(new PublicKey(address), {before: signs[signs.length-1].signature});
          signs.push(...signatures)
          if (signatures.length<1000) break;
        }

        // console.log("signatures ", signatures)
        // console.log("first ", signatures[0].blockTime)
        // console.log("last ", signatures[signatures.length -1].blockTime)

        let lastTime = signs[signs.length-1]
        let lastTimestamp = lastTime.blockTime ?? 0;
        if (lastTimestamp<fromTimestamp) {
          break;
        }
      } while (true)
      signs = signs.filter(sign => sign && !sign.err && sign.blockTime && sign.blockTime>fromTimestamp && sign.blockTime<toTimestamp);
      addressSignatures.set(address, signs)
      let signatures = signs.map(sign => sign.signature)
      console.log(address, " signatures ", signatures.length, signatures);
      let txInfo = await solConnection.getParsedTransactions(signatures, 'finalized');
      do {
        if (!signatures || signatures.length==0) {
          break;
        }
        if (!txInfo || txInfo.length == 0 || !txInfo[0]) {
          console.log("fetching tx info again...")
          await sleep(3000);
          txInfo = await solConnection.getParsedTransactions(signatures, 'finalized');

        } else {
          break;
        }
      } while (true);
      console.log("fetched tx info for wallet ", address);

      console.log(" tx ", txInfo)
      let tokenAddresses = tokens.map(token => token.publicKey)
      txInfo.map(tx => {
        
        tx?.transaction.message.instructions.map(ix => {
          if (
            (ix as ParsedInstruction).program == 'spl-token' && 
            (ix as ParsedInstruction).parsed.type=='transfer' && 
            tx.meta?.postTokenBalances &&
            tx.meta?.postTokenBalances?.filter(tokenBalance => tokenAddresses.includes(tokenBalance.mint)).length > 0
          ) {
            let postTokenBalance = 0;
            let tokenName = "";
            let tokenDecimal = 9;
            let preTokenBalance = 0;
            let tokenAddress = "";

            for (let i=0; i< tx.meta.postTokenBalances.length; i++) {
              if (tx.meta.postTokenBalances[i].owner == address && tokenAddresses.includes(tx.meta.postTokenBalances[i].mint)) {
                
                for (let i=0; i< tokens.length; i++) {
                  if ( tokens[i].publicKey==tx.meta.postTokenBalances[i].mint ) {
                    tokenName = tokens[i].name;
                    tokenAddress = tokens[i].publicKey;
                    break;
                  }
                }
                tokenDecimal = tx.meta.postTokenBalances[i].uiTokenAmount.decimals
                postTokenBalance = parseInt(tx.meta.postTokenBalances[i].uiTokenAmount.amount)
                break;
              }
            }
            if (tx.meta.preTokenBalances) {              
              for (let i=0; i<tx.meta.preTokenBalances.length; i++) {
                if (tx.meta.preTokenBalances[i].owner == address && tokenAddresses.includes(tx.meta.preTokenBalances[i].mint)) {
                  preTokenBalance = parseInt(tx.meta.preTokenBalances[i].uiTokenAmount.amount)
                  break;
                }
              }
            }

            transactionLog.push({
              profit: parseFloat(((postTokenBalance-preTokenBalance)/Math.pow(10, tokenDecimal)).toFixed(2)),
              time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
              tokenAddress: tokenAddress,
              tokenName: tokenName
            })
            resultData.push({
              address: address,
              profit: parseFloat(((postTokenBalance-preTokenBalance)/Math.pow(10, tokenDecimal)).toFixed(2)),
              time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
              tokenAddress: tokenAddress,
              tokenName: tokenName
            })
          } else if (
            (ix as ParsedInstruction).program == "system" && 
            (ix as ParsedInstruction).parsed.type == 'transfer' &&
            (
              (ix as ParsedInstruction).parsed.info.source == address || 
              (ix as ParsedInstruction).parsed.info.destination == address
            )
          ) {
            if ((ix as ParsedInstruction).parsed.info.source == address && !((ix as ParsedInstruction).parsed.info.destination == address)) {
              transactionLog.push({
                profit: -parseFloat(((ix as ParsedInstruction).parsed.info.lamports/LAMPORTS_PER_SOL).toFixed(2)),
                time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
                tokenAddress: "So11111111111111111111111111111111111111112",
                tokenName: "SOL"
              })
              resultData.push({
                address,
                profit: -parseFloat(((ix as ParsedInstruction).parsed.info.lamports/LAMPORTS_PER_SOL).toFixed(2)),
                time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
                tokenAddress: "So11111111111111111111111111111111111111112",
                tokenName: "SOL"
              })
            } else if ((ix as ParsedInstruction).parsed.info.destination == address && !((ix as ParsedInstruction).parsed.info.source == address)) {
              transactionLog.push({
                profit: parseFloat(((ix as ParsedInstruction).parsed.info.lamports/LAMPORTS_PER_SOL).toFixed(2)),
                time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
                tokenAddress: "So11111111111111111111111111111111111111112",
                tokenName: "SOL"
              })
              resultData.push({
                address,
                profit: parseFloat(((ix as ParsedInstruction).parsed.info.lamports/LAMPORTS_PER_SOL).toFixed(2)),
                time: tx.blockTime? new Date(tx.blockTime* 1000).toString(): "",
                tokenAddress: "So11111111111111111111111111111111111111112",
                tokenName: "SOL"
              })
            }
          }
        })
      })

      transactionHistories.set(address, transactionLog)
    }))

    return resultData;
    } catch (e) {
      console.log("err ", e);
      return []
    }
}