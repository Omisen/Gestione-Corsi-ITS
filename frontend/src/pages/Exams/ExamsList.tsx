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
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Gestione Esami
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/exams/new')}
                    sx={{ boxShadow: 2, '&:hover': { boxShadow: 4 }, width: { xs: '100%', sm: 'auto' } }}
                >
                    Nuovo Esame
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="exams table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Studente</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem', display: { xs: 'none', sm: 'table-cell' } }}>Modulo</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem', display: { xs: 'none', md: 'table-cell' } }}>Data</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Voto</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Azioni</TableCell>
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
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{moduleLabel(exam.modulo)}</TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(exam.data).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{exam.voto}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
                                            <Tooltip title="Modifica">
                                                <IconButton size="small" color="info" onClick={() => navigate(`/exams/${exam._id}/edit`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Elimina">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(exam._id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
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
