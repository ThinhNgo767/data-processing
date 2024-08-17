import "./style.css";

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

const DataProcessing = () => {
  const [dataInput, setDataInput] = useState("");
  const [dataOnput, setDataOnput] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function processData() {
    let lines = dataInput.split("\n");

    let result = [];

    for (let i = 0; i < lines.length; i++) {
      let parts = lines[i].split("\t");
      if (parts.length > 1) {
        let numbers = parts[1].split(";");
        for (let j = 0; j < numbers.length; j++) {
          let number = numbers[j].trim();
          if (number !== "") {
            result.push(number);
          }
        }
      }
    }

    // Kết hợp các số trong mảng kết quả thành một chuỗi
    let output = result.sort((a, b) => a - b).join(`\n`);

    // Hiển thị kết quả
    setDataOnput(output);
    outputRef.current.focus();
  }

  async function copyData() {
    try {
      dataOnput === ""
        ? Swal.fire({
            width: "25rem",
            position: "center",
            icon: "warning",
            title: "Output data is empty!",
            showConfirmButton: false,
            timer: 1500,
          })
        : navigator.clipboard.writeText(dataOnput) &&
          Swal.fire({
            width: "20rem",
            position: "center",
            icon: "success",
            title: "Copy success!",
            showConfirmButton: false,
            timer: 1500,
          });
    } catch (err) {
      setError(err);
      Swal.fire({
        width: "25rem",
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async function pasteData() {
    try {
      let clipboardText = await navigator.clipboard.readText();

      setDataInput((prev) => prev + clipboardText + "\n");
      inputRef.current.focus();
    } catch (err) {
      setError(err);
      Swal.fire({
        width: "25rem",
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async function deleteData() {
    try {
      Swal.fire({
        width: "25rem",
        title: "Do you want to delete?",
        showDenyButton: true,
        confirmButtonText: "Yes Delete",
        denyButtonText: `Don't Delete`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({
            width: "20rem",
            icon: "success",
            title: "Delete success!",
            showConfirmButton: false,
            timer: 1500,
          });
          setDataInput("");
          setDataOnput("");
          setTimeout(() => {
            inputRef.current.focus();
          }, 2000);
        } else if (result.isDenied) {
          Swal.fire({
            width: "20rem",
            icon: "info",
            title: "Canceled delete!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } catch (err) {
      setError(err);
      Swal.fire({
        width: "25rem",
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  return (
    <main className="container_box">
      <section className="box_content">
        <div className="item_content">
          <h1>Data Processing</h1>
          <textarea
            ref={inputRef}
            id="dataInput"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          ></textarea>
        </div>
        <div className="item_btn">
          <button onClick={pasteData}>Paste Data</button>
          <button onClick={processData}>Process Data</button>
        </div>

        <div className="item_content">
          <h2>Data Output</h2>
          <textarea
            ref={outputRef}
            id="dataOutput"
            value={dataOnput}
            onChange={(e) => setDataOnput(e.target.value)}
          ></textarea>
        </div>
        <div className="item_btn">
          <button onClick={copyData}>Copy Data</button>
          <button onClick={deleteData}>Delete Data</button>
        </div>
      </section>
    </main>
  );
};

export default DataProcessing;
