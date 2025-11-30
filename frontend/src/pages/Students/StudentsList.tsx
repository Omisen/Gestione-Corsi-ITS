import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { studentService } from '../../services/studentService';
import type { Student } from '../../types/types';

const StudentsList = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAllStudents();
            setStudents(data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento degli studenti. Assicurati che il backend sia attivo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDeleteClick = (id: string) => {
        setStudentToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (studentToDelete) {
            try {
                await studentService.deleteStudent(studentToDelete);
                setStudents(students.filter((s) => s._id !== studentToDelete));
                setDeleteDialogOpen(false);
                setStudentToDelete(null);
            } catch (err) {
                console.error('Error deleting student:', err);
                alert('Errore durante l\'eliminazione dello studente');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Studenti
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/students/new')}
                >
                    Nuovo Studente
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="students table">
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cognome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Moduli</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Esami</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nessuno studente trovato.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow
                                    key={student._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{student.nome}</TableCell>
                                    <TableCell>{student.cognome}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell align="center">{student.moduli?.length || 0}</TableCell>
                                    <TableCell align="center">{student.esami?.length || 0}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Dettagli">
                                            <IconButton color="primary" onClick={() => navigate(`/students/${student._id}`)}>
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Modifica">
                                            <IconButton color="info" onClick={() => navigate(`/students/${student._id}/edit`)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Elimina">
                                            <IconButton color="error" onClick={() => handleDeleteClick(student._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Conferma eliminazione</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sei sicuro di voler eliminare questo studente? Questa azione non può essere annullata e rimuoverà anche tutti i dati associati.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Annulla</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Elimina
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentsList;
