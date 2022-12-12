import { ConnectButton } from "web3uikit";

function Header() {
    return (
        <div className="flex flex-row p-5 border-b-4">
            <h1 className="px-4 py-4 text-3xl font-blog">Decentralized Funding</h1>
            <div className="py-2 py-4 ml-auto">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    );
}

export default Header;
