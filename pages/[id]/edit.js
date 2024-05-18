import '../../app/edit.css';
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const onChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

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

  const handleUpdate = async () => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      // Task updated successfully
      router.push("/");
    } else {
      // Handle error
      alert("Failed to edit task");
    }
  };

  return (
    <>
      <div className="container-edit">
        <div className="header-edit">
          <h1>Editar Tarefa</h1>
        </div>
        <form>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={task?.title}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="description"
              value={task?.description}
              onChange={onChange}
            />
          </div>
          <button
            className="btn-submit"
            type="button"
            onClick={handleUpdate}
          >
            Editar Tarefa
          </button>
        </form>
      </div>
      <Head>
        <title>Editar Tarefa</title>
      </Head>
    </>
  );
};

export default Edit;