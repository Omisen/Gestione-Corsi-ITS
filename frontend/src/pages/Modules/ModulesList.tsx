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
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    Gestione Moduli
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/modules/new')}
                    sx={{ boxShadow: 2, '&:hover': { boxShadow: 4 }, width: { xs: '100%', sm: 'auto' } }}
                >
                    Nuovo Modulo
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, boxShadow: 1 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 300, sm: 650 } }} aria-label="modules table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Codice</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem', display: { xs: 'none', sm: 'table-cell' } }}>Ore Totali</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>Azioni</TableCell>
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
                                    <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{module.totale_ore}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 0.5, sm: 1 } }}>
                                            <Tooltip title="Modifica">
                                                <IconButton size="small" color="info" onClick={() => navigate(`/modules/${module._id}/edit`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Elimina">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(module._id)}>
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
