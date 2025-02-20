import React from "react";
import { useNavigate } from "react-router-dom";
import EditConfigs from "../../pages/Configuracoes/edit";

const Modal = () => {
  const history = useNavigate();

  const closeModal = (e) => {
    e.stopPropagation();
    history(-1);
  };

  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <>
      <div
        className="absolute inset-0 w-screen h-screen bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm "
        style={{
          zIndex: 9999999,
        }}
      >
        <span
          className="inline-block absolute top-0 right-0 mr-4 mt-4 cursor-pointer"
          onClick={closeModal}
        >
          <svg
            class="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <div className="w-1/2 h-96">
          <EditConfigs />
        </div>
      </div>
    </>
  );
};

export default Modal;
