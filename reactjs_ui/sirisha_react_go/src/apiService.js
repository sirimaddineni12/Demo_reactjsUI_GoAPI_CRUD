// src/apiService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/records';

export const getRecords = () => axios.get(API_URL);
export const addRecord = (record) => axios.post(API_URL, record);
export const updateRecord = (id, record) => axios.put(`${API_URL}/${id}`, record);
export const deleteRecord = (id) => axios.delete(`${API_URL}/${id}`);
export const activateRecord = (id) => axios.patch(`${API_URL}/${id}/activate`);
export const deactivateRecord = (id) => axios.patch(`${API_URL}/${id}/deactivate`);
