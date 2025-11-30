import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { moduleService } from '../../services/moduleService';
import type { ModuleFormData } from '../../types/types';

const ModuleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ModuleFormData>();

    useEffect(() => {
        if (isEditMode && id) {
            const fetchModule = async () => {
                try {
                    setLoading(true);
                    const moduleData = await moduleService.getModuleById(id);
                    setValue('nome', moduleData.nome);
                    setValue('codice', moduleData.codice);
                    setValue('totale_ore', moduleData.totale_ore);
                    setValue('descrizione', moduleData.descrizione);
                } catch (err) {
                    console.error(err);
                    setError('Errore nel caricamento dei dati del modulo.');
                } finally {
                    setLoading(false);
                }
            };
            fetchModule();
        }
    }, [isEditMode, id, setValue]);

    const onSubmit = async (data: ModuleFormData) => {
        try {
            setLoading(true);
            setError(null);

            // Ensure totale_ore is a number
            const formattedData = {
                ...data,
                totale_ore: Number(data.totale_ore),
            };

            if (isEditMode && id) {
                await moduleService.updateModule(id, formattedData);
            } else {
                await moduleService.createModule(formattedData);
            }

            navigate('/modules');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.Errore || 'Si è verificato un errore durante il salvataggio.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/modules')}
                    color="inherit"
                >
                    Indietro
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    {isEditMode ? 'Modifica Modulo' : 'Nuovo Modulo'}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                label="Nome Modulo"
                                variant="outlined"
                                fullWidth
                                {...register('nome', { required: 'Il nome è obbligatorio' })}
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                            />
                            <TextField
                                label="Codice"
                                variant="outlined"
                                fullWidth
                                {...register('codice', { required: 'Il codice è obbligatorio' })}
                                error={!!errors.codice}
                                helperText={errors.codice?.message}
                            />
                        </Box>

                        <TextField
                            label="Totale Ore"
                            variant="outlined"
                            fullWidth
                            type="number"
                            {...register('totale_ore', {
                                required: 'Il totale ore è obbligatorio',
                                min: { value: 1, message: 'Deve essere almeno 1 ora' }
                            })}
                            error={!!errors.totale_ore}
                            helperText={errors.totale_ore?.message}
                        />

                        <TextField
                            label="Descrizione"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            {...register('descrizione')}
                            error={!!errors.descrizione}
                            helperText={errors.descrizione?.message}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/modules')}
                                disabled={loading}
                            >
                                Annulla
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                            >
                                {isEditMode ? 'Aggiorna' : 'Salva'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default ModuleForm;
