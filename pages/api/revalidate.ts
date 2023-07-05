import { NextApiHandler, NextApiRequest } from 'next'

interface RequestWithBody extends NextApiRequest {
  body: {
    path?: string
  }
}

export const handler: NextApiHandler = async (req: RequestWithBody, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'Incorrect request method' })
  }

  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const body = req.body

  if (!body.path) {
    return res.status(400).json({ message: 'Must include path in request body' })
  }

  if (typeof body.path !== 'string') {
    return res.status(400).json({ message: 'Path must be a string type' })
  }

  try {
    await res.revalidate(body.path)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}

export default handler
