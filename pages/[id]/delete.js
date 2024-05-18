import '../../app/delete.css';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Delete = () => {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      const response = await fetch(`/api/tasks/${id}`);
      const data = await response.json();
      setTask(data);
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      // Task deleted successfully
      router.push("/");
    } else {
      // Handle error
      alert("Failed to delete task");
    }
  };

  return (
    <>
      <div className="container-delete">
        <div className="header-delete">
          <h1>Deletar Tarefa</h1>
        </div>
        <form>
          <div className="delete-message">
            Você tem certeza que deseja deletar <strong>{task?.title}</strong>?
          </div>
          <div className="delete-actions">
            <Link
              href="/" className='btn-cancel'
            >
              Cancelar
            </Link>
            <button
              className="btn-delete"
              type="button"
              onClick={handleDelete} // Alterei de handleUpdate para handleDelete
            >
              Deletar
            </button>
          </div>
        </form>
      </div>
      <Head>
        <title>Delete Task</title>
      </Head>
    </>
  );
};

export default Delete;