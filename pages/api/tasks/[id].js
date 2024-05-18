import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const taskId = parseInt(req.query.id);
  // READ ONE DATA
  if (req.method === "GET") {
    const task = await prisma.task.findFirst({
      where: { id: taskId },
    });
    res.json(task);
  }
  // UPDATE DATA
  else if (req.method === 'PUT') {
    const { title, description, } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
      },
    });

    res.json(updatedTask);
  } 
  // DELETE DATA
  else if (req.method === 'DELETE') {
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    res.json(deletedTask);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}