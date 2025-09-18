import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { CidadesService } from '../../shared/services/api/cidades/CidadesService';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';


export const Dashboard = () => {

  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [totalCountCidades, setTotalCountCidades] = useState(0);
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);

  useEffect(() => {
    setIsLoadingCidades(true);
    setIsLoadingPessoas(true);

      CidadesService.getAll(1)
        .then((result) => {
          setIsLoadingCidades(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setTotalCountCidades(result.totalCount);
          }
        });
        PessoasService.getAll(1)
        .then((result) => {
          setIsLoadingPessoas(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setTotalCountPessoas(result.totalCount);
          }
        });
  }, []);

  return (
    <LayoutBaseDePagina 
      titulo='Página inicial'

      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}>

        <Box width="100%" height={window.innerHeight - 200} display="flex">
          <Grid container margin={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8, lg: 7, xl: 5 }}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' align='center'>
                      Total de pessoas
                    </Typography>
                    <Box padding={4} display='flex' justifyContent='center' alignItems='center'>
                      {!isLoadingPessoas && (
                        <Typography variant='h2' align='center'>
                          {totalCountPessoas}
                        </Typography>
                      )}
                    </Box>
                        {isLoadingPessoas && (
                          <Typography variant='h3' align='center'>
                            Carregando...
                          </Typography>
                        )}
                  </CardContent>
                </Card>

              </Grid>

              <Grid size={{ xs: 12, md: 8, lg: 7, xl: 5 }}>
                
                <Card>
                  <CardContent>
                    <Typography variant='h5' align='center'>
                      Total de cidades
                    </Typography>

                    <Box padding={4} display='flex' justifyContent='center' alignItems='center'>
                        {!isLoadingCidades && (
                          <Typography variant='h2' align='center'>
                            {totalCountCidades}
                          </Typography>
                        )}
                        {isLoadingCidades && (
                          <Typography variant='h3' align='center'>
                            Carregando...
                          </Typography>
                        )}
                    </Box>
                  </CardContent>
                </Card>

              </Grid>

            </Grid>
          </Grid>
        </Box>
    </LayoutBaseDePagina>
  );
};    