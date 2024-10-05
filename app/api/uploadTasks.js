import pinataSDK from '@pinata/sdk';

// Initialize Piñata
const pinata = pinataSDK(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_API_SECRET);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const tasks = req.body;  // Receive tasks in JSON format

    // Pin JSON object to IPFS
    try {
      const result = await pinata.pinJSONToIPFS(tasks);
      res.status(200).json({ success: true, ipfsHash: result.IpfsHash });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to pin tasks to IPFS' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
