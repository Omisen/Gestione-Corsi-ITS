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
} from '@mui/icons-material';
import { moduleService } from '../../services/moduleService';
import type { Module } from '../../types/types';

const ModulesList = () => {
    const navigate = useNavigate();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const data = await moduleService.getAllModules();
            setModules(data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento dei moduli. Assicurati che il backend sia attivo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleDeleteClick = (id: string) => {
        setModuleToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (moduleToDelete) {
            try {
                await moduleService.deleteModule(moduleToDelete);
                setModules(modules.filter((m) => m._id !== moduleToDelete));
                setDeleteDialogOpen(false);
                setModuleToDelete(null);
            } catch (err) {
                console.error('Error deleting module:', err);
                alert('Errore durante l\'eliminazione del modulo');
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
                    Moduli
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/modules/new')}
                >
                    Nuovo Modulo
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="modules table">
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Codice</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ore Totali</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Azioni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nessun modulo trovato.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            modules.map((module) => (
                                <TableRow
                                    key={module._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{module.nome}</TableCell>
                                    <TableCell>{module.codice}</TableCell>
                                    <TableCell align="center">{module.totale_ore}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Modifica">
                                            <IconButton color="info" onClick={() => navigate(`/modules/${module._id}/edit`)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Elimina">
                                            <IconButton color="error" onClick={() => handleDeleteClick(module._id)}>
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
                        Sei sicuro di voler eliminare questo modulo? Questa azione non può essere annullata.
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

export default ModulesList;
