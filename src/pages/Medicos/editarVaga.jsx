import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetResource } from '../../hooks/get/useGet.query';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useResourcePut } from '../../hooks/update/useUpdate.query';


const formatarData = (data) => {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};


const InputForm = ({
  label = "",
  name,
  placeholder = "",
  register,
  required,
  disabled,
  defaultValue,
  type = "text",
  hidden = false,
}) => {
  return (
    <>
      {hidden ? (
        <input type="hidden" {...register(name, { required })} defaultValue={defaultValue} />
      ) : (
        <>
          <Typography
            variant="h6"
            color="blue-gray"
            className="-mb-3"
            style={{ textTransform: "capitalize" }}
          >
            {label}
          </Typography>
          <Input
            size="lg"
            placeholder={placeholder}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            {...register(name, { required })}
            disabled={disabled}
            defaultValue={defaultValue}
            type={type}
          />
        </>
      )}
      {/* <Typography
        variant="h6"
        color="blue-gray"
        className="-mb-3"
        style={{ textTransform: "capitalize" }}
      >
        {label}
      </Typography>
      <Input
        size="lg"
        placeholder={placeholder}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        {...register(name, { required })}
        disabled={disabled}
        defaultValue={defaultValue}
        type={type}
        hidden={hidden}
      /> */}
    </>
  );
};


const TABLE_HEAD = ["Local", "Tipo", "Quantidade", "Data", "Ações"];


function EditarVaga() {
  const { id } = useParams();
  const history = useNavigate();
  const [tipo, setTipo] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataVaga, setDataVaga] = useState({});
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading, refetch } = useGetResource("vagas", "vagas", id);
  const { mutate, isPending } = useResourcePut("vaga", "editar-vaga", () => {
    handleCloseModalEdit()
    toast("Vaga atualizada com sucesso!",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        className: "bg-green-500 text-white p-2 rounded-md w-full px-10 py-5"
      }
    );
    refetch()
  });

  const onSubmit = (data) => {
    const dataForm = {
      tipo,
      ...data,
    };
    mutate(dataForm);
  };

  const handleOpenModalEdit = (idVaga) => {
    setDataVaga(idVaga)
    setOpenModal(!openModal)
  }
  const handleCloseModalEdit = () => {
    setDataVaga({})
    setOpenModal(false)
    reset()
  }


  if (isLoading) return <div>Carregando...</div>
  if (data.length === 0) return <div>Nenhuma vaga encontrada</div>

  return (
    <div>
      <div className='flex justify-between'>
        <Button variant="text" onClick={() => history(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Button>
        <h1 className='text-2xl text-center mb-5'>Vagas para <b>{data[0].medico_nome}</b></h1>
        <span> </span>
      </div>

      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              data.map((item, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={item.medico_nome}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.local}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.tipo}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.quantidade}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatarData(item.data)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        <Button variant="gradient" color="light-blue" onClick={() => handleOpenModalEdit(item)}>Editar</Button>
                      </Typography>
                    </td>
                  </tr>
                )
              })
            }

          </tbody>
        </table>

        <Dialog open={openModal} handler={handleCloseModalEdit} className='w-full' size='lg' style={{height: '90vh', overflow: 'scroll'}}>
          <DialogHeader>Editar vaga {dataVaga.local} - {formatarData(dataVaga.data)} </DialogHeader>
          <DialogBody className='overflow-scroll'>
            <form
              className="mt-8 mb-2 px-5"
              onSubmit={handleSubmit(onSubmit)}
            >

              <fieldset className="mb-8 p-6 border border-blue-100 rounded-lg">
                <legend className="text-lg font-semibold text-blue-700 px-2">Informações do Médico</legend>
                <div className="flex flex-col space-y-6 mt-4">
                  <InputForm label="medico id" name="id" register={register} defaultValue={dataVaga.id} disabled hidden />
                  <InputForm label="Local" name="local" register={register} defaultValue={dataVaga.local} />
                </div>
              </fieldset>
              <fieldset className="mb-8 p-6 border border-blue-100 rounded-lg">
                <legend className="text-lg font-semibold text-blue-700 px-2">Informações da Vaga</legend>
                <div className="flex flex-col space-y-6 mt-4">
                  <InputForm label="Data" name="data" type="date" register={register} defaultValue={dataVaga.data} />
                  <div className="grid grid-cols-2 gap-4 my-10">
                    <InputForm label="Hora Inicio" name="horario" register={register} type="time" className="w-full" defaultValue={dataVaga.horario} />
                    <InputForm label="Hora Fim" name="horario_fim" register={register} type="time" className="w-full" defaultValue={dataVaga.horario_fim}/>
                  </div>
                  <div>
                    <label className="block text-blue-gray-700 font-semibold mb-2">Tipo</label>
                    <Select
                      label="Tipo de vaga"
                      onChange={(val) => setTipo(val)}
                      className="border p-2 rounded"
                      value={dataVaga.tipo}
                    >
                      <Option value="retorno">Retorno</Option>
                      <Option value="consulta">Consulta</Option>
                      <Option value="procedimento">Procedimento</Option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-10">
                    <InputForm label="Quantidade" name="quantidade" register={register} defaultValue={dataVaga.quantidade} />
                    <InputForm label="Tempo entre atendimentos" name="tempo_entre_atendimentos" register={register} defaultValue={dataVaga.tempo_entre_atendimentos} />
                  </div>
                </div>
              </fieldset>

              <div className="mb-1 flex flex-col gap-6">
                <InputForm label="medico id" name="id" register={register} defaultValue={dataVaga.id} disabled hidden />

                <input
                  value={isPending ? "Enviando..." : "Enviar"}
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-md w-full mt-10"
                />
              </div>
            </form>
          </DialogBody>

        </Dialog>
      </Card>

      <ToastContainer />
    </div>
  )
}

export default EditarVaga
