import { useEffect, useState } from 'react';
import { Box, LinearProgress, Paper, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { AvisosService, IDetalheAviso } from '../../shared/services/api/avisos/AvisosService';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

interface IFormData {
  titulo: string;
}

const formValidationSchema: yup.SchemaOf<Omit<IDetalheAviso, 'id'>> = yup.object().shape({
  titulo: yup.string().required('Título é obrigatório').min(3, 'Título deve ter ao menos 3 caracteres'),
  descricao: yup.string().required('Descrição é obrigatória').min(5, 'Descrição deve ter ao menos 5 caracteres'),
  data: yup.string().default(() => new Date().toISOString()),
});

export const DetalheDeAvisos: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      AvisosService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/avisos');
          } else {
            setTitulo(result.titulo);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        titulo: '',
        descricao: '',
        data: '',
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'novo') {
          AvisosService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/avisos');
                } else {
                  navigate(`/avisos/detalhe/${result}`);
                }
              }
            });
        } else {
          AvisosService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/avisos');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      AvisosService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro apagado com sucesso!');
          navigate('/avisos');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'novo' ? 'Novo aviso' : titulo}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'novo'}
          mostrarBotaoApagar={id !== 'novo'}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/avisos')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/avisos/detalhe/novo')}
        />
      }
    >
      <VForm
        ref={formRef}
        onSubmit={handleSave}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" spacing={2} p={2}>
            {isLoading && (
              <Grid>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                <VTextField
                  fullWidth
                  name="titulo"
                  label="Título"
                  disabled={isLoading}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                <VTextField
                  fullWidth
                  name="descricao"
                  label="Descrição"
                  disabled={isLoading}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
                <VTextField
                  fullWidth
                  name="data"
                  label="Data"
                  disabled={isLoading}
                  onChange={(e) => setData(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};