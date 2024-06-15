// src/Records.js

import React, { useState, useEffect } from 'react';
import { getRecords, addRecord, updateRecord, deleteRecord, activateRecord, deactivateRecord } from './apiService';
import { Button, Form, ListGroup, Alert, Container, Row, Col, Card } from 'react-bootstrap';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ name: '' });
  const [editRecord, setEditRecord] = useState({ id: null, name: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await getRecords();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleAddRecord = async () => {
    try {
      await addRecord(newRecord);
      setNewRecord({ name: '' });
      fetchRecords();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditRecord({ ...editRecord, name: e.target.value });
  };

  const handleUpdateRecord = async (id) => {
    try {
      await updateRecord(id, { name: editRecord.name });
      setEditRecord({ id: null, name: '' });
      fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteRecord(id);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleActivateRecord = async (id) => {
    const record = records.find(r => r.id === id);
    if (record.is_active) {
      setAlertMessage('Record is already active');
      setShowAlert(true);
      return;
    }

    try {
      await activateRecord(id);
      fetchRecords();
    } catch (error) {
      console.error('Error activating record:', error);
    }
  };

  const handleDeactivateRecord = async (id) => {
    const record = records.find(r => r.id === id);
    if (!record.is_active) {
      setAlertMessage('Record is already deactivated');
      setShowAlert(true);
      return;
    }

    try {
      await deactivateRecord(id);
      fetchRecords();
    } catch (error) {
      console.error('Error deactivating record:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <h1 className="my-4">Records</h1>
          {showAlert && <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
          <Form>
            <Form.Group controlId="formNewRecord">
              <Form.Label>New Record Name</Form.Label>
              <Form.Control
                type="text"
                value={newRecord.name}
                onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                placeholder="Enter new record name"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddRecord} className="mt-2">Add Record</Button>
          </Form>
          <Card className="my-4">
            <Card.Body>
              <ListGroup>
                {records.map((record) => (
                  <ListGroup.Item key={record.id}>
                    <Row className="align-items-center">
                      <Col xs="6">
                        {editRecord.id === record.id ? (
                          <Form.Control
                            type="text"
                            value={editRecord.name}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <>
                            {record.name} - {record.is_active ? 'Active' : 'Inactive'}
                          </>
                        )}
                      </Col>
                      <Col xs="6" className="text-right">
                        {editRecord.id === record.id ? (
                          <>
                            <Button variant="success" onClick={() => handleUpdateRecord(record.id)} className="mr-2">Save</Button>
                            <Button variant="secondary" onClick={() => setEditRecord({ id: null, name: '' })}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="info" onClick={() => setEditRecord({ id: record.id, name: record.name })} className="mr-2">Edit</Button>
                            <Button variant="danger" onClick={() => handleDeleteRecord(record.id)} className="mr-2">Delete</Button>
                            <Button variant="success" onClick={() => handleActivateRecord(record.id)} className="mr-2">Activate</Button>
                            <Button variant="warning" onClick={() => handleDeactivateRecord(record.id)}>Deactivate</Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Records;
