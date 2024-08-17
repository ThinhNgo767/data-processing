async function processData2(input) {
let lines = input.split("\n");

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

    outputRef.current.focus();
    await Swal.fire({
      input: "textarea",
      inputValue: output,
      inputAutoFocus: true,
      confirmButtonText: "Copy",
      customClass: {
        input: "textData",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(output);
        const Toast = Swal.mixin({
          width: "18rem",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Copied successfully.",
        });
      }
    });

}

---

const handleClick = async () => {
const { value: text } = await Swal.fire({
input: "textarea",
inputLabel: "Message",
inputPlaceholder: "Type your message here...",
inputAttributes: {
"aria-label": "Type your message here",
},
showCancelButton: true,
customClass: {
input: "textData",
},
});

    if (text) {
      processData2(text);
    }

};
