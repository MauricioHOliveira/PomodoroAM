
import '../app/create.css';
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const Create = () => {
  const router = useRouter();
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const onChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      // Task created successfully
      router.push("/");
    } else {
      // Handle error
      alert("Failed to create task");
    }
  };

  return (
    <>
      <div className="container-create">
        <div className="header-create">
          <h1>Criar Tarefa</h1>
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
            onClick={handleCreate}
          >
            Criar Tarefa
          </button>
        </form>
      </div>
      <Head>
        <title>Criar Tarefa</title>
      </Head>
    </>
  );
};

export default Create;