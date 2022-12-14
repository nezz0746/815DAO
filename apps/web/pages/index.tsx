import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="h-full flex border flex-col justify-center items-center">
      <Head>
        <title>Typescript Eth Starter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>Hello 815DAO</p>
    </div>
  );
};

export default Home;
