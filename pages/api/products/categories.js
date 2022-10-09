import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Bodysuit', 'Bikini', 'Camisole'];
  res.send(categories);
});

export default handler;
