import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Contract from "../components/Contract";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Raffle</title>
                <meta name="description" content="Decentrlized Smart Contract Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Contract />
        </div>
    );
}
