"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { Copy, Check, Wallet } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModeToggle } from "@/components/ui/toggle"

export default function Page() {
    const [walletNumber, setWallet] = useState<number>(0)
    const [publicKeys, setPublicKeys] = useState<string[] | undefined>()
    const [privateKeys, setPrivateKeys] = useState<string[] | undefined>()
    const [mnemonic, setMnemonic] = useState()
    const [copying, setCopying] = useState({ type: '', index: -1 })
    const [showAlert, setShowAlert] = useState(false)

    const generateWallet = async () => {
        try {
            const response = await axios.post("/api/create-wallet", { walletNumber })
            if (response.status === 200) {
                setWallet((prev) => prev + 1)
                const { mnemonic, publicKey, privateKey } = response.data
                setPublicKeys((prev) => (prev ? [...prev, publicKey] : [publicKey]))
                setPrivateKeys((prev) => (prev ? [...prev, privateKey] : [privateKey]))
                setMnemonic(mnemonic)
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            }
        } catch (error) {
            console.error("Failed to generate wallet:", error)
        }
    }

    const addWallet = async () => {
        try {
            const response = await axios.post("/api/add-wallet", { walletNumber, mnemonic })
            if (response.status === 200) {
                setWallet((prev) => prev + 1)
                const { publicKey, privateKey } = response.data
                setPublicKeys((prev) => (prev ? [...prev, publicKey] : [publicKey]))
                setPrivateKeys((prev) => (prev ? [...prev, privateKey] : [privateKey]))
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            }
        } catch (error) {
            console.error("Failed to add wallet:", error)
        }
    }
    // @ts-ignore
    const copyToClipboard = async (text, type, index) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopying({ type, index })
            setTimeout(() => setCopying({ type: '', index: -1 }), 2000)
        } catch (error) {
            console.error("Failed to copy:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <ModeToggle></ModeToggle>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Wallet className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Wallet Manager</h1>
                    </div>
                    <p className="text-gray-600 mb-6">Create and manage your crypto wallets securely</p>
                    <Button
                        onClick={walletNumber === 0 ? generateWallet : addWallet}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {walletNumber === 0 ? "Create New Wallet" : "Add Another Wallet"}
                    </Button>
                </div>

                {showAlert && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Wallet successfully {walletNumber === 1 ? 'created' : 'added'}!
                        </AlertDescription>
                    </Alert>
                )}

                {mnemonic && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-3">Recovery Phrase</h2>
                        <p className="text-yellow-700 mb-4">
                            Store this mnemonic phrase safely. It's required to recover your wallet:
                        </p>
                        <div className="bg-white p-4 rounded-md border border-yellow-300 font-mono text-sm break-all">
                            {mnemonic}
                        </div>
                    </div>
                )}

                {publicKeys && privateKeys && publicKeys.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Wallets</h2>
                        <div className="space-y-6">
                            {publicKeys.map((key, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                >
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Public Key
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => copyToClipboard(key, 'public', index)}
                                                >
                                                    {copying.type === 'public' && copying.index === index ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            <code className="bg-white px-3 py-2 rounded-md text-sm break-all border border-gray-200">
                                                {key}
                                            </code>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Private Key
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => copyToClipboard(privateKeys[index], 'private', index)}
                                                >
                                                    {copying.type === 'private' && copying.index === index ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            <code className="bg-white px-3 py-2 rounded-md text-sm break-all border border-gray-200">
                                                {privateKeys[index]}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No wallets created yet. Create your first wallet to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}