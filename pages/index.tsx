import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import * as web3 from "@solana/web3.js";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isExecutable, setIsExecutable] = useState(false);

  const addressSubmittedHandler = (address: string) => {
    // My Notes
    // publickey address's type is not string; its type is (Publickey) (equivalent of 'address' in solidity)
    // clusterApiUrl() returns RPC API URL. the url looks like this "https://api.devnet.solana.com"
    // network types are called clusters. cluster can be devnet, testnet, mainnet-beta
    // new objects I have learned: Publickey, Connection, Cluster(it doesnt look like an object actually),
    // toBase58 converts address to string.
    // end point: When an API interacts with another system, the touchpoints of this communication are considered endpoints. For APIs, an endpoint can include a URL of a server or service. endpoint >> the place where the resource lives.

    /*   ?? OPERATOR
    const favoriteFruit = null;
    const result = favoriteFruit ?? 'You did not tell me'; // if favoriteFruit is null, return 'You did not tell me', if not null return favoriteFruit 
    console.log(result); // "You did not tell me"
    */

    try {
      const key = new web3.PublicKey(address);
      const keyStr = key.toBase58();
      setAddress(keyStr);
      debugger;
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

      connection.getBalance(key).then((data) => {
        setBalance(data / web3.LAMPORTS_PER_SOL);
      });

      connection.getAccountInfo(key).then((data) => {
        setIsExecutable(data?.executable ?? false);
      });
    } catch (error) {
      setAddress("");
      setBalance(0);
      alert(error);
    }
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>Start Your Solana Journey</p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is it executable: ${isExecutable}`}</p>
      </header>
    </div>
  );
};

export default Home;
