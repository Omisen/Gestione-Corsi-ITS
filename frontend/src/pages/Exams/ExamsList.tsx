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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { examService } from '../../services/examService';
import type { Exam } from '../../types/types';

const ExamsList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState<string | null>(null);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const data = await examService.getAllExams();
            setExams(data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento degli esami. Assicurati che il backend sia attivo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleDeleteClick = (id: string) => {
        setExamToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (examToDelete) {
            try {
                await examService.deleteExam(examToDelete);
                setExams(exams.filter((e) => e._id !== examToDelete));
                setDeleteDialogOpen(false);
                setExamToDelete(null);
            } catch (err) {
                console.error('Error deleting exam:', err);
                alert('Errore durante l\'eliminazione dell\'esame');
            }
        }
    };

    const studentLabel = (s: string | any) => {
        if (!s) return '-';
        return typeof s === 'string' ? s : `${s.nome} ${s.cognome}`;
    };

    const moduleLabel = (m: string | any) => {
        if (!m) return '-';
        return typeof m === 'string' ? m : m.nome;
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
                    Esami
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/exams/new')}
                >
                    Nuovo Esame
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="exams table">
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Studente</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Modulo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Voto</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nessun esame trovato.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            exams.map((exam) => (
                                <TableRow
                                    key={exam._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{studentLabel(exam.studente)}</TableCell>
                                    <TableCell>{moduleLabel(exam.modulo)}</TableCell>
                                    <TableCell>{new Date(exam.data).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{exam.voto}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Modifica">
                                            <IconButton color="info" onClick={() => navigate(`/exams/${exam._id}/edit`)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Elimina">
                                            <IconButton color="error" onClick={() => handleDeleteClick(exam._id)}>
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
                        Sei sicuro di voler eliminare questo esame? Questa azione non può essere annullata.
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

export default ExamsList;
