import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import FundMe from "../components/FundMe";
import FunderIndex from "../components/FunderIndex";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>FundMe</title>
                <meta name="description" content="Decentrlized Smart Contract Fund Me" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <FundMe />
            <FunderIndex />
        </div>
    );
}
