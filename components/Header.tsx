import { ConnectButton } from "web3uikit";

function Header() {
    return (
        <div className="p-5 border-b-4 flex flex-row">
            <h1 className="py-4 px-4 text-3xl font-blog">Decentralized Raffle</h1>
            <div className="ml-auto py-2 py-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    );
}

export default Header;
