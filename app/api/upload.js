import formidable from 'formidable';
import fs from 'fs';
import pinataSDK from '@pinata/sdk';

// Initialize Piñata
const pinata = pinataSDK(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_API_SECRET);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).send('File upload failed');
        return;
      }

      const fileStream = fs.createReadStream(files.file.filepath);

      try {
        const result = await pinata.pinFileToIPFS(fileStream);
        res.status(200).json({ success: true, hash: result.IpfsHash });
      } catch (error) {
        res.status(500).json({ success: false, error: 'File pinning failed' });
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
}
