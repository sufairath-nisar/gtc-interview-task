export default function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
}
