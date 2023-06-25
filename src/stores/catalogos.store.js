import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';

// const baseUrl = `http://localhost:3000/`;
const baseUrl = import.meta.env.VITE_BASE_URL;
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export const useCatalogosStore = defineStore({
    id: 'catalogos',
    state: () => ({
        loading: false,
        errord: {},
        catalogos: [],
        catalogo: {},
        familias: [],
        grupos: [],
        unidadesMedida: [],
        rutas: [],
        searching: '',
    }),
    getters: {
        dataCatalog(state) {
            return state.searching ? state.catalogos.filter( d => Object.values(d).join(' ').toLowerCase().includes(state.searching)) : state.catalogos;
        }, getFamilias(state) {
            return state.familias.map(d => {return {...d,'label': d.codigo, 'value': d.id}});
        }, getGrupos(state) {
            return state.grupos.map(d => {return {...d,'label': d.description, 'value': d.id}});
        }, getUnidadesMedida(state) {
            return state.unidadesMedida.map(d => {return {...d,'label': d.codigo, 'value': d.id}});
        }, getRutas(state) {
            return state.rutas.map(d => {return {...d,'label': d.descripcion, 'value': d.no_ruta}});
        },
        isError(state) {
            return state.catalogo
        },
        isLoading(state) {
            return state.loading
        }
    },
    actions: {
        async register(frgm, catalogo) {
            this.catalogo = {loading: true};
            try {
                console.log(`----->${baseUrl}${frgm}`, catalogo)
                let s = await fetchWrapper.post(`${baseUrl}${frgm}`, catalogo);
                console.log(s)
            } catch (error) {
                this.catalogo = {error};
            }
            this.loading = false;

        },
        async getSecondaryData() {
            this.loading = true;
            try {
                let f = await fetchWrapper.get(`${baseUrl}familias`);
                let g = await fetchWrapper.get(`${baseUrl}grupos`);
                let r = await fetchWrapper.get(`${baseUrl}rutas`);
                let u = await fetchWrapper.get(`${baseUrl}um`);
                this.familias = f;
                this.grupos = g;
                this.unidadesMedida = u;
                this.rutas = r
            } catch (error) {
                this.errord = {error};
            } finally {
                this.loading = false;
            }
        },
        async getAll(frgm) {
            this.loading = true;
            try {
                let s = await fetchWrapper.get(`${baseUrl}${frgm}`);
                this.catalogos = s
            } catch (error) {
                this.errord = {error};
            } finally {
                this.loading = false;
            }
        },
        async getById(frgm) {
            this.loading = true;

            this.catalogo = {loading: true};
            try {
                this.catalogo = await fetchWrapper.get(`${baseUrl}${frgm}/${id}`);
            } catch (error) {
                this.catalogo = {error};
            }
            this.loading = false;

        },
        async update(frgm, id, params) {
            this.catalogo = {loading: true};
            try {
                this.catalogo = await fetchWrapper.put(`${baseUrl}${frgm}/${id}`, params);
            } catch (error) {
                this.catalogo = {error};
            }
            this.loading = false;

        },
        async delete(frgm, id) {
            this.loading = true;

            // this.catalogos.find(x => x.id === id);
            await fetchWrapper.delete(`${baseUrl}${frgm}/${id}`);
            this.catalogos = this.catalogos.filter(x => x.id !== id);
            this.loading = false;
        }
    }
});