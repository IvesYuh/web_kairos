import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemAviso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
}

export interface IDetalheAviso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
}

type TAvisosComTotalCount = {
  data: IListagemAviso[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TAvisosComTotalCount | Error> => {
  try {
    const urlRelativa = `/avisos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&titulo_like=${filter}`;
    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: number): Promise<IDetalheAviso | Error> => {
  try {
    const { data } = await Api.get(`/avisos/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheAviso, 'id'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheAviso>('/avisos', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetalheAviso): Promise<void | Error> => {
  try {
    await Api.put(`/avisos/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/avisos/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const AvisosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};